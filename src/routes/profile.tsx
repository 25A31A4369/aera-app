import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LogIn, LogOut, RotateCcw, Clock, ChevronRight, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { friendlyError, myReportsQuery } from "@/lib/facilities";
import { REPORT_LABELS, timeAgo, type ReportType } from "@/lib/trust";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { signOutUser } from "@/lib/auth-service";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — AERA" },
      {
        name: "description",
        content: "Account details and activity history.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const { resetOnboarding, t } = useLanguage();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [isRestarting, setIsRestarting] = useState(false);

  const reports = useQuery({
    ...myReportsQuery(user?.id),
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOutUser();
    navigate({ to: "/auth", replace: true });
    toast.success("Signed out successfully");
  };

  const handleStartOver = async () => {
    setIsRestarting(true);
    try {
      if (user) {
        await qc.cancelQueries();
        qc.clear();
        await signOutUser();
      }

      // Clear temporary navigation, search, filters, form drafts
      if (typeof window !== "undefined") {
        try {
          sessionStorage.clear();
          localStorage.removeItem("aera_explore_search");
          localStorage.removeItem("aera_explore_filter");
          localStorage.removeItem("aera_report_draft");
          localStorage.removeItem("aera_selected_facility");
          localStorage.removeItem("aera_mock_session");
        } catch {
          // ignore
        }
      }

      // Reset onboarding flags so user returns to Welcome
      resetOnboarding();

      toast.success("Restarted from Welcome");

      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        navigate({ to: "/", replace: true });
      }
    } catch {
      toast.error("Failed to restart. Please try again.");
      setIsRestarting(false);
    }
  };

  if (loading) {
    return (
      <AppShell title={t("nav_profile")}>
        <Spinner />
      </AppShell>
    );
  }

  return (
    <AppShell title={t("nav_profile")}>
      <div className="space-y-6">
        {/* 1. Account Details */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Account Details
          </h2>
          {user ? (
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-foreground truncate">
                      {user.user_metadata?.display_name
                        ? String(user.user_metadata.display_name)
                        : user.email?.split("@")[0]}
                    </p>
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Account Status</span>
                <span className="text-xs font-semibold text-primary">Signed In</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition active:scale-[0.99]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t("sign_out_button")}</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs space-y-3 text-center">
              <p className="text-xs text-muted-foreground">
                You are currently not signed in. Sign in to save places and view your history.
              </p>
              <Link to="/auth" className={primaryBtn}>
                <LogIn className="h-4 w-4 mr-1.5" />
                <span>{t("sign_in_title")}</span>
              </Link>
            </div>
          )}
        </section>

        {/* 2. History */}
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            History
          </h2>
          {user ? (
            reports.isLoading ? (
              <Spinner />
            ) : reports.isError ? (
              <StateBox title="Couldn't load history" body={friendlyError(reports.error)} />
            ) : !reports.data?.length ? (
              <StateBox
                title="No activity history yet"
                body="When you submit reports or interact with places, they will appear here."
              />
            ) : (
              <div className="space-y-2">
                {reports.data.map((r) => (
                  <Link
                    key={r.id}
                    to="/facility/$id"
                    params={{ id: r.facility_id }}
                    className="group flex items-center justify-between rounded-xl border border-border/70 bg-card p-3 shadow-2xs hover:border-primary/50 transition active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {r.facilities?.name ?? "Place"}
                        </span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-primary shrink-0">
                          {REPORT_LABELS[r.report_type as ReportType] ?? r.report_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo(r.created_at)}</span>
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  </Link>
                ))}
              </div>
            )
          ) : (
            <StateBox
              title="Sign in to view history"
              body="Activity records appear when you are signed in."
            />
          )}
        </section>

        {/* 3. Start Over */}
        <section className="pt-2">
          <button
            type="button"
            disabled={isRestarting}
            onClick={handleStartOver}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-secondary/80 text-xs font-bold text-primary hover:bg-secondary active:scale-[0.99] transition shadow-2xs disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{isRestarting ? "Restarting…" : t("start_over_title")}</span>
          </button>
        </section>
      </div>
    </AppShell>
  );
}
