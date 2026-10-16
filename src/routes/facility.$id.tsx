import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Flag } from "lucide-react";
import { AppShell, CategoryIcon, DemoBadge, SaveButton, Spinner, StateBox, TrustBadge, knownText } from "@/components/aera";
import { CATEGORY_LABELS, facilityQuery, friendlyError } from "@/lib/facilities";
import { REPORT_LABELS, computeTrust, timeAgo, type ReportType } from "@/lib/trust";

export const Route = createFileRoute("/facility/$id")({
  head: () => ({
    meta: [
      { title: "Place details — AERA" },
      { name: "description", content: "Access details, freshness status and community reports for this place." },
      { property: "og:title", content: "Place details — AERA" },
      { property: "og:description", content: "Access details, freshness status and community reports." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacilityPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={value === "Not confirmed" ? "text-muted-foreground italic" : "font-medium"}>{value}</span>
    </div>
  );
}

function FacilityPage() {
  const { id } = Route.useParams();
  const q = useQuery(facilityQuery(id));

  if (q.isLoading) return <AppShell><Spinner /></AppShell>;
  if (q.isError) return <AppShell><StateBox title="Couldn't load this place" body={friendlyError(q.error)} /></AppShell>;
  const f = q.data;
  if (!f) return <AppShell><StateBox title="Place not found" action={<Link to="/" className="font-semibold text-primary">Back to Explore</Link>} /></AppShell>;

  const trust = computeTrust(f.last_confirmed_at, f.facility_reports);
  const reports = [...f.facility_reports].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <AppShell>
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Explore
      </Link>

      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <CategoryIcon category={f.category} className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium leading-tight">{f.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {CATEGORY_LABELS[f.category]} {f.is_demo && <DemoBadge />}
          </div>
        </div>
      </div>

      {f.is_demo && (
        <p className="mt-4 rounded-xl bg-demo/50 p-3 text-xs text-demo-foreground">
          This is fictional sample data for demonstration. It is not a real place.
        </p>
      )}

      {f.description && <p className="mt-4 text-sm leading-relaxed">{f.description}</p>}
      <p className="mt-2 text-sm text-muted-foreground">{f.address ?? "Address not confirmed"}</p>

      <div className="mt-5 rounded-2xl border bg-card p-4 shadow-soft">
        <TrustBadge status={trust.status} label={trust.label} />
        <p className="mt-2 text-sm text-muted-foreground">{trust.reason}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Last confirmed: {f.last_confirmed_at ? `${new Date(f.last_confirmed_at).toLocaleString()} (${timeAgo(f.last_confirmed_at)})` : "Never"}
          {f.verification_source && ` · Source: ${f.verification_source}`}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <SaveButton facilityId={f.id} />
        <Link to="/report" search={{ facility: f.id }} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground">
          <Flag className="h-4 w-4" /> Report status
        </Link>
      </div>

      <section className="mt-6 divide-y rounded-2xl border bg-card px-4">
        <Row label="Drinking water" value={knownText(f.has_water, "Available", "Not available")} />
        <Row label="Shade" value={knownText(f.has_shade, "Available", "Not available")} />
        <Row label="Place to rest" value={knownText(f.has_seating, "Available", "Not available")} />
        <Row label="Free entry" value={knownText(f.is_free)} />
        <Row label="Open to public" value={knownText(f.public_access)} />
        <Row label="Resting permitted" value={knownText(f.resting_allowed)} />
        <Row label="Opening hours" value={f.opening_hours ?? "Not confirmed"} />
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Report history</h2>
        {reports.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No reports yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="rounded-xl border bg-card p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{REPORT_LABELS[r.report_type as ReportType] ?? r.report_type}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{r.is_demo ? <DemoBadge /> : "Community report"}</div>
                {r.comment && <p className="mt-1.5">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
