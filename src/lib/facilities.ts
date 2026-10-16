import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Facility = Tables<"facilities">;
export type FacilityReport = Tables<"facility_reports">;
export type FacilityWithReports = Facility & { facility_reports: FacilityReport[] };

export const CATEGORY_LABELS: Record<string, string> = {
  water: "Drinking Water",
  shade: "Shade",
  rest: "Rest Area",
};

export const facilitiesQuery = queryOptions({
  queryKey: ["facilities"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("facilities")
      .select("*, facility_reports(*)")
      .order("name");
    if (error) throw error;
    return data as FacilityWithReports[];
  },
});

export const facilityQuery = (id: string) =>
  queryOptions({
    queryKey: ["facility", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*, facility_reports(*)")
        .eq("id", id)
        .order("created_at", { referencedTable: "facility_reports", ascending: false })
        .maybeSingle();
      if (error) throw error;
      return data as FacilityWithReports | null;
    },
  });

export const savedIdsQuery = (userId: string | undefined) =>
  queryOptions({
    queryKey: ["saved", userId],
    enabled: !!userId,
    queryFn: async () => {
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
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  if (msg.includes("RATE_LIMIT")) return msg.replace(/^.*RATE_LIMIT:\s*/, "");
  if (/fetch|network/i.test(msg)) return "Could not reach the server. Check your connection and try again.";
  return msg || "Something went wrong.";
}
