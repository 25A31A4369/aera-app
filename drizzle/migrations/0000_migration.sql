
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 60),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NULLIF(left(coalesce(NEW.raw_user_meta_data->>'display_name', ''), 60), ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  category text NOT NULL CHECK (category IN ('water','shade','rest')),
  description text,
  address text,
  latitude double precision CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  longitude double precision CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  opening_hours text,
  has_water boolean,
  has_shade boolean,
  has_seating boolean,
  is_free boolean,
  public_access boolean,
  resting_allowed boolean,
  verification_source text,
  last_confirmed_at timestamptz,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX facilities_category_idx ON public.facilities(category);
GRANT SELECT ON public.facilities TO anon, authenticated;
GRANT ALL ON public.facilities TO service_role;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "facilities public read" ON public.facilities FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.facility_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  user_id uuid,
  report_type text NOT NULL CHECK (report_type IN ('available','unavailable','restricted')),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 300),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (is_demo OR user_id IS NOT NULL)
);
CREATE INDEX facility_reports_facility_idx ON public.facility_reports(facility_id, created_at DESC);
CREATE INDEX facility_reports_user_idx ON public.facility_reports(user_id, created_at DESC);
GRANT SELECT ON public.facility_reports TO anon, authenticated;
GRANT INSERT ON public.facility_reports TO authenticated;
GRANT ALL ON public.facility_reports TO service_role;
ALTER TABLE public.facility_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports public read" ON public.facility_reports FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reports insert as self" ON public.facility_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_demo = false);

-- Rate limit + bump last_confirmed_at on "available"
CREATE OR REPLACE FUNCTION public.facility_report_guard() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_demo THEN RETURN NEW; END IF;
  NEW.created_at := now();
  IF EXISTS (SELECT 1 FROM public.facility_reports
             WHERE user_id = NEW.user_id AND facility_id = NEW.facility_id
               AND created_at > now() - interval '2 minutes') THEN
    RAISE EXCEPTION 'RATE_LIMIT: You reported this place very recently. Please wait a couple of minutes.';
  END IF;
  IF NEW.comment IS NOT NULL THEN NEW.comment := NULLIF(btrim(NEW.comment), ''); END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER facility_report_guard BEFORE INSERT ON public.facility_reports
FOR EACH ROW EXECUTE FUNCTION public.facility_report_guard();

CREATE OR REPLACE FUNCTION public.facility_report_after() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.report_type = 'available' AND NOT NEW.is_demo THEN
    UPDATE public.facilities SET last_confirmed_at = NEW.created_at, updated_at = now() WHERE id = NEW.facility_id;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER facility_report_after AFTER INSERT ON public.facility_reports
FOR EACH ROW EXECUTE FUNCTION public.facility_report_after();

CREATE TABLE public.saved_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  facility_id uuid NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, facility_id)
);
CREATE INDEX saved_facilities_user_idx ON public.saved_facilities(user_id);
GRANT SELECT, INSERT, DELETE ON public.saved_facilities TO authenticated;
GRANT ALL ON public.saved_facilities TO service_role;
ALTER TABLE public.saved_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved own read" ON public.saved_facilities FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "saved own insert" ON public.saved_facilities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved own delete" ON public.saved_facilities FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- DEMO DATA (fictional)
INSERT INTO public.facilities (id, name, category, description, address, opening_hours, has_water, has_shade, has_seating, is_free, public_access, resting_allowed, verification_source, last_confirmed_at, is_demo) VALUES
('00000000-0000-4000-8000-000000000001','Sample Water Kiosk A','water','Fictional drinking water point used to show a recently confirmed place.','Sample Street 1 (fictional)','6:00 AM – 9:00 PM (sample)',true,true,false,true,true,true,'Fictional sample data', now() - interval '2 hours', true),
('00000000-0000-4000-8000-000000000002','Sample Shaded Bench B','shade','Fictional shaded seating area whose information is old.','Sample Park Road (fictional)',NULL,false,true,true,true,true,true,'Fictional sample data', now() - interval '5 days', true),
('00000000-0000-4000-8000-000000000003','Sample Rest Shelter C','rest','Fictional rest shelter with conflicting community reports.','Sample Market Lane (fictional)',NULL,true,true,true,true,true,NULL,'Fictional sample data', now() - interval '3 hours', true),
('00000000-0000-4000-8000-000000000004','Sample Covered Spot D','shade','Fictional location with unknown access details.',NULL,NULL,NULL,true,NULL,NULL,NULL,NULL,NULL,NULL, true);

INSERT INTO public.facility_reports (facility_id, user_id, report_type, comment, is_demo, created_at) VALUES
('00000000-0000-4000-8000-000000000001',NULL,'available','Sample report: water was flowing.',true, now() - interval '2 hours'),
('00000000-0000-4000-8000-000000000001',NULL,'available',NULL,true, now() - interval '6 hours'),
('00000000-0000-4000-8000-000000000002',NULL,'available','Sample report from long ago.',true, now() - interval '5 days'),
('00000000-0000-4000-8000-000000000003',NULL,'available','Sample report: open.',true, now() - interval '3 hours'),
('00000000-0000-4000-8000-000000000003',NULL,'unavailable','Sample report: gate was locked.',true, now() - interval '1 hour');
