import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell, DemoBadge, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { friendlyError, myReportsQuery } from "@/lib/facilities";
import { REPORT_LABELS, timeAgo, type ReportType } from "@/lib/trust";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AERA" },
      { name: "description", content: "Your AERA account and the reports you have submitted." },
      { property: "og:title", content: "Profile — AERA" },
      { property: "og:description", content: "Your AERA account and reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const reports = useQuery(myReportsQuery(user?.id));

  if (loading) return <AppShell title="Profile"><Spinner /></AppShell>;
  if (!user)
    return (
      <AppShell title="Profile">
        <StateBox title="You're browsing as a guest" body="Sign in to save places and submit reports." action={<Link to="/auth" className={primaryBtn}>Sign in or create account</Link>} />
      </AppShell>
    );

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <AppShell title="Profile">
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="font-semibold break-all">{user.email}</p>
        <button onClick={signOut} className="mt-4 h-11 w-full rounded-xl border font-semibold">Sign out</button>
      </div>

      <h2 className="mt-6 font-semibold">Your reports</h2>
      <div className="mt-3 space-y-2">
        {reports.isLoading ? <Spinner /> : reports.isError ? <StateBox title="Couldn't load reports" body={friendlyError(reports.error)} /> :
          !reports.data?.length ? <StateBox title="No reports yet" body="Reports you submit will appear here." action={<Link to="/report" className="font-semibold text-primary">Submit a report</Link>} /> :
          reports.data.map((r) => (
            <Link key={r.id} to="/facility/$id" params={{ id: r.facility_id }} className="block rounded-xl border bg-card p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.facilities?.name ?? "Place"}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                {REPORT_LABELS[r.report_type as ReportType]} {r.facilities?.is_demo && <DemoBadge />}
              </div>
              {r.comment && <p className="mt-1">{r.comment}</p>}
            </Link>
          ))}
      </div>
    </AppShell>
  );
}
