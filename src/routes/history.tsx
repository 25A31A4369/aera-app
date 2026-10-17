import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Flag, Bookmark, ChevronRight } from "lucide-react";
import { AppShell, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { facilitiesQuery, friendlyError, myReportsQuery, savedIdsQuery } from "@/lib/facilities";
import { REPORT_LABELS, timeAgo, type ReportType } from "@/lib/trust";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Activity History — AERA" },
      {
        name: "description",
        content: "View your submitted place reports and recent interactions.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  const reports = useQuery({
    ...myReportsQuery(user?.id),
    enabled: !!user?.id,
  });

  const saved = useQuery({
    ...savedIdsQuery(user?.id),
    enabled: !!user?.id,
  });

  const allFacilities = useQuery({
    ...facilitiesQuery,
    enabled: !!user?.id,
  });

  if (loading) {
    return (
      <AppShell title={t("nav_history")}>
        <Spinner />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title={t("nav_history")}>
        <StateBox
          title="Sign in to view your history"
          body="Sign in with your account to see your submitted reports and activity history."
          action={
            <Link to="/auth" className={primaryBtn}>
              {t("sign_in_title")}
            </Link>
          }
        />
      </AppShell>
    );
  }

  const isLoading = reports.isLoading || saved.isLoading || allFacilities.isLoading;
  const isError = reports.isError || saved.isError;
  const reportList = reports.data ?? [];
  const savedIds = saved.data ?? [];
  const hasActivity = reportList.length > 0 || savedIds.length > 0;

  return (
    <AppShell
      title={t("nav_history")}
      subtitle="Your submitted reports and saved place interactions"
    >
      <div className="space-y-4">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <StateBox
            title="Couldn't load history"
            body={friendlyError(reports.error || saved.error)}
          />
        ) : !hasActivity ? (
          <StateBox
            title="No activity history yet"
            body="When you submit status reports or save water and shade places, your activity will appear here."
            action={
              <Link to="/" className="font-semibold text-primary">
                Explore places
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {/* Reports Section */}
            {reportList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                  <Flag className="h-3.5 w-3.5 text-primary" />
                  <span>Submitted Reports ({reportList.length})</span>
                </div>
                <div className="space-y-2">
                  {reportList.map((r) => (
                    <Link
                      key={r.id}
                      to="/facility/$id"
                      params={{ id: r.facility_id }}
                      className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs hover:border-primary/50 transition-all active:scale-[0.99]"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {r.facilities?.name ?? "Place"}
                          </p>
                          <span className="inline-flex shrink-0 items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                            {REPORT_LABELS[r.report_type as ReportType] ?? r.report_type}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1 italic">
                            "{r.comment}"
                          </p>
                        )}
                        <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 inline" />
                          <span>{timeAgo(r.created_at)}</span>
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Places Section */}
            {savedIds.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                  <Bookmark className="h-3.5 w-3.5 text-primary" />
                  <span>Saved Places ({savedIds.length})</span>
                </div>
                <div className="space-y-2">
                  {savedIds.map((id) => {
                    const place = allFacilities.data?.find((f) => f.id === id);
                    if (!place) return null;
                    return (
                      <Link
                        key={id}
                        to="/facility/$id"
                        params={{ id }}
                        className="group flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs hover:border-primary/50 transition-all active:scale-[0.99]"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {place.name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {place.category === "water" ? "Drinking water" : "Shade & rest spot"}
                            {place.address ? ` · ${place.address}` : ""}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
