import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Globe, LogIn, LogOut, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { friendlyError, myReportsQuery } from "@/lib/facilities";
import { timeAgo } from "@/lib/trust";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/i18n";
import { signOutUser } from "@/lib/auth-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — AERA" },
      {
        name: "description",
        content: "Manage language settings and your AERA account.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading } = useAuth();
  const { language, setLanguage, currentOption, resetLanguageSelection, t } = useLanguage();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const reports = useQuery(myReportsQuery(user?.id));

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await signOutUser();
    navigate({ to: "/auth", replace: true });
  };

  const handleRestart = async (shouldSignOut: boolean) => {
    setIsRestarting(true);
    try {
      if (shouldSignOut && user) {
        await qc.cancelQueries();
        qc.clear();
        await signOutUser();
      }

      // Clear temporary search, filters, form drafts, temporary selections
      if (typeof window !== "undefined") {
        try {
          sessionStorage.clear();
          localStorage.removeItem("aera_explore_search");
          localStorage.removeItem("aera_explore_filter");
          localStorage.removeItem("aera_report_draft");
          localStorage.removeItem("aera_selected_facility");
        } catch {
          // ignore
        }
      }

      // Reset language selection so user restarts at first screen
      resetLanguageSelection();
      setShowRestartModal(false);

      toast.success("App restarted from Language Selection");

      // Reset navigation history so Back does not reopen previous screens
      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
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
        {/* Account / Guest Status Card */}
        {user ? (
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-bold text-foreground break-all text-base">{user.email}</p>
            {user.user_metadata?.display_name && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {String(user.user_metadata.display_name)}
              </p>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 font-semibold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("sign_out_button")}</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-soft">
            <h2 className="font-bold text-foreground text-base">{t("profile_guest_title")}</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {t("profile_guest_body")}
            </p>
            <div className="mt-4">
              <Link to="/auth" className={primaryBtn}>
                <LogIn className="h-4 w-4 mr-1.5" />
                <span>{t("sign_in_title")}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Language Settings Card */}
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Globe className="h-4 w-4" />
              <h3 className="text-sm text-foreground">{t("current_language_label")}</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsChangingLang(!isChangingLang)}
              className="text-xs font-semibold text-primary underline"
            >
              {isChangingLang ? "Close" : t("change_language")}
            </button>
          </div>

          <p className="mt-2 text-sm font-semibold text-primary">{currentOption.label}</p>
          <p className="text-xs text-muted-foreground">{currentOption.description}</p>

          {/* Expanded Language Picker */}
          {isChangingLang && (
            <div className="mt-4 space-y-2 pt-3 border-t">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.code as SupportedLanguage);
                      setIsChangingLang(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all text-xs",
                      isSelected
                        ? "border-primary bg-primary/10 font-bold text-primary"
                        : "border-border hover:bg-muted/40 text-foreground",
                    )}
                  >
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-[11px] text-muted-foreground">"{opt.samplePhrase}"</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Reports Submitted */}
        {user && (
          <div>
            <h3 className="font-bold text-sm text-foreground">Your Community Reports</h3>
            <div className="mt-3 space-y-2">
              {reports.isLoading ? (
                <Spinner />
              ) : reports.isError ? (
                <StateBox title="Couldn't load reports" body={friendlyError(reports.error)} />
              ) : !reports.data?.length ? (
                <StateBox
                  title="No reports yet"
                  body="Reports you submit will appear here."
                  action={
                    <Link to="/report" className="font-semibold text-primary text-xs">
                      Submit a report
                    </Link>
                  }
                />
              ) : (
                reports.data.map((r) => (
                  <Link
                    key={r.id}
                    to="/facility/$id"
                    params={{ id: r.facility_id }}
                    className="block rounded-xl border bg-card p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{r.facilities?.name ?? "Place"}</span>
                      <span className="text-muted-foreground">{timeAgo(r.created_at)}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Start Over / Restart Option Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <RotateCcw className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold">{t("start_over_title")}</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{t("start_over_desc")}</p>

          <button
            type="button"
            onClick={() => setShowRestartModal(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 text-xs font-bold text-primary hover:bg-primary/10 active:scale-[0.99] transition shadow-xs"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t("start_over_title")}</span>
          </button>
        </div>
      </div>

      {/* Start Over Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border bg-card p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-primary">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {t("start_over_confirm_title")}
                </h3>
                <p className="text-[11px] text-muted-foreground">Reset onboarding journey</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("start_over_confirm_body")}
            </p>

            {user ? (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-semibold text-foreground">
                  Choose how to handle your session:
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={isRestarting}
                    onClick={() => handleRestart(true)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 text-xs font-bold text-destructive hover:bg-destructive/20 transition disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t("restart_signout")}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isRestarting}
                    onClick={() => handleRestart(false)}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-xs disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{t("restart_keep_signed_in")}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <button
                  type="button"
                  disabled={isRestarting}
                  onClick={() => handleRestart(false)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-xs disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Confirm Restart</span>
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={isRestarting}
              onClick={() => setShowRestartModal(false)}
              className="inline-flex h-10 w-full items-center justify-center text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
