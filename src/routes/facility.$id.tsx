import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Navigation, AlertTriangle, MapPin, Clock, Info, Calendar } from "lucide-react";
import {
  AppShell,
  CategoryIcon,
  DemoBadge,
  SaveButton,
  Spinner,
  StateBox,
  TrustBadge,
  knownText,
} from "@/components/aera";
import { CATEGORY_LABELS, facilityQuery, friendlyError } from "@/lib/facilities";
import { REPORT_LABELS, computeTrust, timeAgo, type ReportType } from "@/lib/trust";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/facility/$id")({
  head: () => ({
    meta: [
      { title: "Place Details — AERA" },
      {
        name: "description",
        content:
          "Access details, freshness status, directions, and community reports for this place.",
      },
      { property: "og:title", content: "Place Details — AERA" },
      {
        property: "og:description",
        content: "Access details, freshness status and community reports.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FacilityPage,
});

function Row({
  label,
  value,
  subvalue,
}: {
  label: string;
  value: string;
  subvalue?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <div className="text-right">
        <span
          className={
            value === "Not confirmed"
              ? "text-muted-foreground italic"
              : "font-semibold text-foreground"
          }
        >
          {value}
        </span>
        {subvalue && <p className="text-[11px] text-muted-foreground font-mono">{subvalue}</p>}
      </div>
    </div>
  );
}

function FacilityPage() {
  const { id } = Route.useParams();
  const { t } = useLanguage();
  const q = useQuery(facilityQuery(id));

  if (q.isLoading)
    return (
      <AppShell>
        <Spinner />
      </AppShell>
    );

  if (q.isError)
    return (
      <AppShell>
        <StateBox
          title="Couldn't load this place"
          body={friendlyError(q.error)}
          action={
            <Link to="/" className="font-semibold text-primary text-xs">
              {t("btn_back_explore")}
            </Link>
          }
        />
      </AppShell>
    );

  const f = q.data;
  if (!f)
    return (
      <AppShell>
        <StateBox
          title="Place not found"
          body="This spot may have been removed or does not exist."
          action={
            <Link to="/" className="font-semibold text-primary text-xs">
              {t("btn_back_explore")}
            </Link>
          }
        />
      </AppShell>
    );

  const trust = computeTrust(f.last_confirmed_at, f.facility_reports);
  const reports = [...f.facility_reports].sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Directions destination
  const hasCoords = f.latitude != null && f.longitude != null;
  const directionsDestination = hasCoords ? `${f.latitude},${f.longitude}` : (f.address ?? null);
  const directionsUrl = directionsDestination
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(directionsDestination)}`
    : null;

  const trustLabel =
    trust.status === "recent"
      ? t("trust_recent")
      : trust.status === "stale"
        ? t("trust_stale")
        : t("trust_uncertain");

  return (
    <AppShell>
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{t("btn_back_explore")}</span>
      </Link>

      {/* Place Header */}
      <div className="mt-2 flex items-start gap-3.5">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-xs">
          <CategoryIcon category={f.category} className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
              {f.name}
            </h1>
            {f.is_demo && <DemoBadge />}
          </div>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {CATEGORY_LABELS[f.category] ?? f.category}
          </p>
        </div>
      </div>

      {/* Demo notice if demo row */}
      {f.is_demo && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-demo/40 p-3 text-xs text-demo-foreground leading-relaxed">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            This is fictional sample data for demonstration. It illustrates how water points and
            shade spots appear on AERA.
          </span>
        </div>
      )}

      {/* Description */}
      {f.description && (
        <p className="mt-3 text-sm text-foreground/90 leading-relaxed">{f.description}</p>
      )}

      {/* Location summary */}
      <div className="mt-2.5 flex items-start gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
        <span>{f.address ?? "Address not confirmed"}</span>
      </div>

      {/* Trust & Freshness Card */}
      <div className="mt-4 rounded-2xl border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <TrustBadge status={trust.status} label={trustLabel} />
          <span className="text-[11px] text-muted-foreground font-medium">
            {f.last_confirmed_at ? `Confirmed ${timeAgo(f.last_confirmed_at)}` : "Never confirmed"}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{trust.reason}</p>
        {f.verification_source && (
          <p className="mt-2 border-t pt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Source: {f.verification_source}</span>
          </p>
        )}
      </div>

      {/* Primary Action Buttons: Directions, Save, and Report a Problem */}
      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          {/* Directions Button (when supported) */}
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/95 active:scale-[0.99]"
            >
              <Navigation className="h-4 w-4" />
              <span>{t("btn_directions")}</span>
            </a>
          ) : (
            <div className="flex h-12 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/40 px-3 text-[11px] text-muted-foreground text-center">
              Directions unavailable (coordinates unverified)
            </div>
          )}

          {/* Save / Unsave Button */}
          <div className="w-36 shrink-0">
            <SaveButton facilityId={f.id} />
          </div>
        </div>

        {/* Report a Problem Button */}
        <Link
          to="/report"
          search={{ facility: f.id }}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>{t("btn_report_problem")}</span>
        </Link>
      </div>

      {/* Location & Facility Amenities Details */}
      <section className="mt-5 rounded-2xl border bg-card p-4 shadow-soft">
        <h2 className="text-sm font-bold text-foreground pb-2 border-b">
          Location & Access Details
        </h2>
        <div className="divide-y">
          <Row
            label="Drinking water"
            value={knownText(f.has_water, "Available", "Not available")}
          />
          <Row label="Shade" value={knownText(f.has_shade, "Available", "Not available")} />
          <Row
            label="Place to rest"
            value={knownText(f.has_seating, "Available", "Not available")}
          />
          <Row label="Free entry" value={knownText(f.is_free)} />
          <Row label="Open to public" value={knownText(f.public_access)} />
          <Row label="Resting permitted" value={knownText(f.resting_allowed)} />
          <Row label="Opening hours" value={f.opening_hours ?? "Not confirmed"} />
          {f.address && <Row label="Address" value={f.address} />}
          {hasCoords && (
            <Row
              label="Coordinates"
              value={`${f.latitude?.toFixed(4)}, ${f.longitude?.toFixed(4)}`}
              subvalue={`Lat ${f.latitude}, Lng ${f.longitude}`}
            />
          )}
        </div>
      </section>

      {/* Report History */}
      <section className="mt-5">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Community Report History</span>
          </h2>
          <span className="text-xs text-muted-foreground">
            {reports.length} {reports.length === 1 ? "report" : "reports"}
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/60 p-4 text-center text-xs text-muted-foreground">
            No community reports submitted for this place yet.
          </div>
        ) : (
          <ul className="mt-2 space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="rounded-xl border bg-card p-3 text-xs shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground">
                    {REPORT_LABELS[r.report_type as ReportType] ?? r.report_type}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{timeAgo(r.created_at)}</span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {r.is_demo ? <DemoBadge /> : "Community submission"}
                </div>
                {r.comment && (
                  <p className="mt-1.5 rounded-lg bg-muted/40 p-2 text-xs text-foreground/90 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
