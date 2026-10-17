import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Facility = Tables<"facilities">;
export type FacilityReport = Tables<"facility_reports">;
export type FacilityWithReports = Facility & { facility_reports: FacilityReport[] };

import {
  INITIAL_SAMPLE_FACILITIES,
  isDemoModeActive,
  getDemoSavedIds,
  getDemoReports,
  DEMO_USER,
} from "./demo-mode";

export const CATEGORY_LABELS: Record<string, string> = {
  water: "Drinking Water",
  shade: "Shade",
  rest: "Rest Area",
};

// Fallback coordinate map for sample demo facilities that might have null coordinates in DB
const SAMPLE_COORDS: Record<string, { lat: number; lng: number }> = {
  "00000000-0000-4000-8000-000000000001": { lat: 17.385, lng: 78.4867 },
  "00000000-0000-4000-8000-000000000002": { lat: 17.3882, lng: 78.4895 },
  "00000000-0000-4000-8000-000000000003": { lat: 17.382, lng: 78.484 },
  "00000000-0000-4000-8000-000000000004": { lat: 17.3895, lng: 78.4835 },
};

function enrichFacility(f: FacilityWithReports): FacilityWithReports {
  // If demo row and coords are missing, provide sample coords
  let lat = f.latitude;
  let lng = f.longitude;
  if (f.is_demo && (lat == null || lng == null)) {
    const fallback = SAMPLE_COORDS[f.id];
    if (fallback) {
      lat = fallback.lat;
      lng = fallback.lng;
    }
  }

  // Merge any local demo reports submitted in this session
  const localDemoReports = getDemoReports().filter((r) => r.facility_id === f.id);
  const existingReportIds = new Set(f.facility_reports?.map((r) => r.id) ?? []);
  const extraReports = localDemoReports.filter((r) => !existingReportIds.has(r.id));
  const mergedReports = [...extraReports, ...(f.facility_reports ?? [])];

  return {
    ...f,
    latitude: lat,
    longitude: lng,
    facility_reports: mergedReports,
  };
}

export const facilitiesQuery = queryOptions({
  queryKey: ["facilities"],
  queryFn: async () => {
    let list: FacilityWithReports[] = [];
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("*, facility_reports(*)")
        .order("name");
      if (!error && data && data.length > 0) {
        list = data as FacilityWithReports[];
      }
    } catch {
      // If network fails or table unavailable, use sample facilities
    }

    if (list.length === 0) {
      list = INITIAL_SAMPLE_FACILITIES;
    }

    return list.map(enrichFacility);
  },
});

export const facilityQuery = (id: string) =>
  queryOptions({
    queryKey: ["facility", id],
    queryFn: async () => {
      let item: FacilityWithReports | null = null;
      try {
        const { data, error } = await supabase
          .from("facilities")
          .select("*, facility_reports(*)")
          .eq("id", id)
          .order("created_at", { referencedTable: "facility_reports", ascending: false })
          .maybeSingle();
        if (!error && data) {
          item = data as FacilityWithReports;
        }
      } catch {
        // ignore
      }

      if (!item) {
        item = INITIAL_SAMPLE_FACILITIES.find((f) => f.id === id) ?? null;
      }

      return item ? enrichFacility(item) : null;
    },
  });

export const savedIdsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["saved", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (isDemoModeActive() || userId === DEMO_USER.id) {
        return getDemoSavedIds();
      }

      const { data, error } = await supabase
        .from("saved_facilities")
        .select("facility_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((d) => d.facility_id);
    },
  });

export const myReportsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["my-reports", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (isDemoModeActive() || userId === DEMO_USER.id) {
        const demoReports = getDemoReports();
        return demoReports.map((r) => {
          const fac = INITIAL_SAMPLE_FACILITIES.find((f) => f.id === r.facility_id);
          return {
            ...r,
            facilities: {
              name: fac?.name ?? "Sample Facility",
              is_demo: true,
            },
          };
        });
      }

      const { data, error } = await supabase
        .from("facility_reports")
        .select("*, facilities(name, is_demo)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export function friendlyError(e: unknown): string {
  const msg =
    e instanceof Error
      ? e.message
      : typeof e === "object" && e && "message" in e
        ? String((e as { message: unknown }).message)
        : String(e);
  if (msg.includes("RATE_LIMIT")) return msg.replace(/^.*RATE_LIMIT:\s*/, "");
  if (/fetch|network/i.test(msg))
    return "Could not reach the server. Check your connection and try again.";
  return msg || "Something went wrong.";
}
