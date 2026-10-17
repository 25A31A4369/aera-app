import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Compass,
  Droplets,
  Flag,
  Globe,
  Loader2,
  Sun,
  Tent,
  User,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { computeTrust, timeAgo, type TrustStatus } from "@/lib/trust";
import {
  CATEGORY_LABELS,
  friendlyError,
  savedIdsQuery,
  type FacilityWithReports,
} from "@/lib/facilities";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/i18n";
import { AeraLogo } from "@/components/AeraLogo";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({
  children,
  title,
  subtitle,
  hideHeaderLang = false,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  hideHeaderLang?: boolean;
}) {
  const { currentOption, language, setLanguage, t } = useLanguage();
  const [showLangModal, setShowLangModal] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col">
      <header className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 transition active:scale-[0.98]">
            <AeraLogo size="md" variant="badge" />
            <span className="font-display text-2xl font-black tracking-tight text-primary">
              AERA
            </span>
          </Link>

          {!hideHeaderLang && (
            <button
              type="button"
              onClick={() => setShowLangModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
              title={t("change_language")}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{currentOption.nativeName}</span>
            </button>
          )}
        </div>

        {title && <h1 className="mt-4 font-display text-3xl font-medium leading-tight">{title}</h1>}
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>

      <main className="flex-1 px-5 pb-28">{children}</main>
      <BottomNav />

      {/* Language Quick-Switch Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Globe className="h-4 w-4" />
                <span className="text-foreground text-sm">{t("choose_language_title")}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLangModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.code as SupportedLanguage);
                      setShowLangModal(false);
                      toast.success(`Language set to ${opt.label}`);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 font-bold text-primary"
                        : "border-border hover:bg-muted/50 text-foreground",
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-[11px] text-muted-foreground">{opt.description}</p>
                    </div>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomNav() {
  const { t } = useLanguage();

  const items = [
    { to: "/", label: t("nav_explore"), icon: Compass },
    { to: "/saved", label: t("nav_saved"), icon: Bookmark },
    { to: "/report", label: t("nav_report"), icon: Flag },
    { to: "/profile", label: t("nav_profile"), icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 backdrop-blur">
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const trustStyles: Record<TrustStatus, string> = {
  recent: "bg-success-soft text-success",
  stale: "bg-warning-soft text-warning",
  uncertain: "bg-caution-soft text-caution",
};

export function TrustBadge({ status, label }: { status: TrustStatus; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        trustStyles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="rounded-md bg-demo px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-demo-foreground">
      Demo data
    </span>
  );
}

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = category === "water" ? Droplets : category === "shade" ? Sun : Tent;
  return <Icon className={className} />;
}

export function knownText(v: boolean | null, yes = "Yes", no = "No") {
  return v === null ? "Not confirmed" : v ? yes : no;
}

export function FacilityCard({
  f,
  distanceKm,
}: {
  f: FacilityWithReports;
  distanceKm?: number | null;
}) {
  const trust = computeTrust(f.last_confirmed_at, f.facility_reports);
  const { t } = useLanguage();

  const trustLabel =
    trust.status === "recent"
      ? t("trust_recent")
      : trust.status === "stale"
        ? t("trust_stale")
        : t("trust_uncertain");

  return (
    <Link
      to="/facility/$id"
      params={{ id: f.id }}
      className="group block rounded-2xl border bg-card p-4 shadow-soft transition-all hover:border-primary/60 hover:shadow-md active:scale-[0.99] cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <CategoryIcon category={f.category} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">
                {f.name}
              </h3>
              {f.is_demo && <DemoBadge />}
            </div>
            <p className="text-sm text-muted-foreground">
              {CATEGORY_LABELS[f.category] ?? f.category}
              {distanceKm != null &&
                ` · ${distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}`}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TrustBadge status={trust.status} label={trustLabel} />
        <span className="text-xs text-muted-foreground">
          Confirmed {timeAgo(f.last_confirmed_at)}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Hours</dt>
        <dd>{f.opening_hours ?? "Not confirmed"}</dd>
        <dt className="text-muted-foreground">Public access</dt>
        <dd>{knownText(f.public_access)}</dd>
        <dt className="text-muted-foreground">Free</dt>
        <dd>{knownText(f.is_free)}</dd>
      </dl>
    </Link>
  );
}

export function SaveButton({ facilityId }: { facilityId: string }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const saved = useQuery(savedIdsQuery(user?.id));
  const isSaved = saved.data?.includes(facilityId) ?? false;

  const mut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      if (isSaved) {
        const { error } = await supabase
          .from("saved_facilities")
          .delete()
          .eq("facility_id", facilityId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_facilities")
          .insert({ facility_id: facilityId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isSaved ? "Removed from saved" : "Saved");
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  if (!user) {
    return (
      <button
        onClick={() => navigate({ to: "/auth" })}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border bg-card font-semibold"
      >
        <Bookmark className="h-4 w-4" /> <span>{t("sign_in_title")}</span>
      </button>
    );
  }
  return (
    <button
      onClick={() => mut.mutate()}
      disabled={mut.isPending || saved.isLoading}
      className={cn(
        "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border font-semibold disabled:opacity-60",
        isSaved ? "border-primary bg-secondary text-primary" : "bg-card",
      )}
    >
      {mut.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      <span>{isSaved ? t("saved_button") : t("save_button")}</span>
    </button>
  );
}

export function StateBox({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 p-6 text-center">
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-10 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export const primaryBtn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60";
export const inputCls =
  "h-12 w-full rounded-xl border bg-card px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/20";
