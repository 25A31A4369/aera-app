import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck, Compass, Droplets, Flag, Loader2, Sun, Tent, User } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { computeTrust, timeAgo, type TrustStatus } from "@/lib/trust";
import { CATEGORY_LABELS, friendlyError, savedIdsQuery, type FacilityWithReports } from "@/lib/facilities";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col">
      <header className="px-5 pt-6 pb-3">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-primary">
          AERA
        </Link>
        {title && <h1 className="mt-4 font-display text-3xl font-medium leading-tight">{title}</h1>}
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <main className="flex-1 px-5 pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  const items = [
    { to: "/", label: "Explore", icon: Compass },
    { to: "/saved", label: "Saved", icon: Bookmark },
    { to: "/report", label: "Report", icon: Flag },
    { to: "/profile", label: "Profile", icon: User },
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
              {label}
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
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", trustStyles[status])}>
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

export function FacilityCard({ f, distanceKm }: { f: FacilityWithReports; distanceKm?: number | null }) {
  const trust = computeTrust(f.last_confirmed_at, f.facility_reports);
  return (
    <Link
      to="/facility/$id"
      params={{ id: f.id }}
      className="block rounded-2xl border bg-card p-4 shadow-soft transition-colors hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <CategoryIcon category={f.category} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold leading-snug">{f.name}</h3>
            {f.is_demo && <DemoBadge />}
          </div>
          <p className="text-sm text-muted-foreground">
            {CATEGORY_LABELS[f.category]}
            {distanceKm != null && ` · ${distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}`}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TrustBadge status={trust.status} label={trust.label} />
        <span className="text-xs text-muted-foreground">Confirmed {timeAgo(f.last_confirmed_at)}</span>
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
  const qc = useQueryClient();
  const navigate = useNavigate();
  const saved = useQuery(savedIdsQuery(user?.id));
  const isSaved = saved.data?.includes(facilityId) ?? false;

  const mut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      if (isSaved) {
        const { error } = await supabase.from("saved_facilities").delete().eq("facility_id", facilityId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("saved_facilities").insert({ facility_id: facilityId, user_id: user.id });
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
      <button onClick={() => navigate({ to: "/auth" })} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border bg-card font-semibold">
        <Bookmark className="h-4 w-4" /> Sign in to save
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
      {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}

export function StateBox({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
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
