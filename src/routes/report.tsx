import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell, Spinner, StateBox, inputCls, primaryBtn } from "@/components/aera";
import { facilitiesQuery, friendlyError } from "@/lib/facilities";
import { REPORT_LABELS, type ReportType } from "@/lib/trust";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  validateSearch: z.object({ facility: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Report a place — AERA" },
      { name: "description", content: "Tell others whether a water, shade or rest spot is still available." },
      { property: "og:title", content: "Report a place — AERA" },
      { property: "og:description", content: "Share whether a place is still available." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

const schema = z.object({
  facility_id: z.string().uuid("Choose a place"),
  report_type: z.enum(["available", "unavailable", "restricted"], { message: "Choose what you saw" }),
  comment: z.string().trim().max(300, "Keep comments under 300 characters").optional(),
});

function ReportPage() {
  const { user, loading } = useAuth();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const places = useQuery(facilitiesQuery);
  const [facilityId, setFacilityId] = useState(search.facility ?? "");
  const [type, setType] = useState<ReportType | "">("");
  const [comment, setComment] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse({ facility_id: facilityId, report_type: type, comment: comment || undefined });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
      const { error } = await supabase.from("facility_reports").insert({
        facility_id: parsed.data.facility_id,
        report_type: parsed.data.report_type,
        comment: parsed.data.comment || null,
        user_id: user!.id,
      });
      if (error) throw error;
      return parsed.data.facility_id;
    },
    onSuccess: (fid) => {
      toast.success("Thanks — your report was saved.");
      qc.invalidateQueries();
      navigate({ to: "/facility/$id", params: { id: fid } });
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  if (loading) return <AppShell title="Report"><Spinner /></AppShell>;
  if (!user)
    return (
      <AppShell title="Report" subtitle="Help others know what's really there.">
        <StateBox title="Sign in to submit a report" body="Anyone can browse, but reports need an account so they can't be faked easily." action={<Link to="/auth" className={primaryBtn}>Sign in</Link>} />
      </AppShell>
    );

  return (
    <AppShell title="Report" subtitle="What did you see at this place?">
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium">Place</span>
          {places.isLoading ? <Spinner /> : (
            <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)} className={cn(inputCls, "mt-1.5")}>
              <option value="">Choose a place…</option>
              {places.data?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}{p.is_demo ? " (demo)" : ""}</option>
              ))}
            </select>
          )}
        </label>

        <fieldset>
          <legend className="text-sm font-medium">Status</legend>
          <div className="mt-1.5 grid gap-2">
            {(Object.keys(REPORT_LABELS) as ReportType[]).map((k) => (
              <button type="button" key={k} onClick={() => setType(k)}
                className={cn("h-14 rounded-xl border px-4 text-left font-semibold", type === k ? "border-primary bg-secondary text-primary" : "bg-card")}>
                {REPORT_LABELS[k]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium">Comment (optional)</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={300} rows={3}
            className={cn(inputCls, "mt-1.5 h-auto py-3")} placeholder="e.g. Tap working, queue was short" />
          <span className="text-xs text-muted-foreground">{comment.length}/300</span>
        </label>

        <button type="submit" disabled={mut.isPending} className={primaryBtn}>
          {mut.isPending ? "Submitting…" : "Submit report"}
        </button>
        <p className="text-center text-xs text-muted-foreground">Reports are shared publicly without your name.</p>
      </form>
    </AppShell>
  );
}
