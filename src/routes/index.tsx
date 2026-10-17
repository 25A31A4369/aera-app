import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LocateFixed, Search, List, Map as MapIcon } from "lucide-react";
import { AppShell, FacilityCard, Spinner, StateBox, inputCls } from "@/components/aera";
import { facilitiesQuery, friendlyError } from "@/lib/facilities";
import { haversineKm } from "@/lib/trust";
import { useLanguage } from "@/lib/language";
import { useAuth } from "@/lib/auth";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { LanguageSelectionScreen } from "@/components/LanguageSelectionScreen";
import { ExploreMap } from "@/components/ExploreMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AERA — Find Shade. Find Relief." },
      {
        name: "description",
        content:
          "Find drinking water, shade and rest spots, with clear information on how recently each was confirmed.",
      },
      { property: "og:title", content: "AERA — Find Shade. Find Relief." },
      {
        property: "og:description",
        content:
          "Drinking water, shade and rest spots for outdoor workers, with honest freshness labels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IndexPage,
});

type LocState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; lat: number; lng: number }
  | { kind: "error"; msg: string };

function IndexPage() {
  const { hasCompletedWelcome, completeWelcome, hasSelectedLanguage, completeLanguageSelection } =
    useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // 1. Welcome Screen
  if (!hasCompletedWelcome) {
    return <WelcomeScreen onContinue={() => completeWelcome()} />;
  }

  // 2. Language Selection Screen
  if (!hasSelectedLanguage) {
    return (
      <LanguageSelectionScreen
        onContinue={(chosenLang) => {
          completeLanguageSelection(chosenLang);
          // Always navigate to Sign In page after language selection
          navigate({ to: "/auth" });
        }}
      />
    );
  }

  // 3. Authentication check: User must be signed in to access Explore
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/auth", replace: true });
    return null;
  }

  // 4. Explore / Home Screen
  return <Explore />;
}

function Explore() {
  const { t } = useLanguage();
  const q = useQuery(facilitiesQuery);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "water" | "shade">("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("map");
  const [loc, setLoc] = useState<LocState>({ kind: "idle" });

  // Exactly three simple filters: All Places, Drinking Water, Shade
  const filterTabs = [
    { key: "all" as const, label: t("filter_all") },
    { key: "water" as const, label: t("filter_water") },
    { key: "shade" as const, label: t("filter_shade") },
  ];

  const askLocation = () => {
    if (!("geolocation" in navigator))
      return setLoc({
        kind: "error",
        msg: "Location is not supported on this device.",
      });
    setLoc({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      (p) =>
        setLoc({
          kind: "ok",
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        }),
      (e) =>
        setLoc({
          kind: "error",
          msg:
            e.code === 1
              ? "Location permission denied. You can still browse the list."
              : "Could not get your location.",
        }),
      { timeout: 10000 },
    );
  };

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    const rows = (q.data ?? [])
      .filter((f) => {
        if (filter === "water") return f.category === "water";
        if (filter === "shade") return f.category === "shade" || f.category === "rest";
        return true;
      })
      .filter(
        (f) => !s || [f.name, f.address, f.description].some((v) => v?.toLowerCase().includes(s)),
      )
      .map((f) => ({
        f,
        d:
          loc.kind === "ok" && f.latitude != null && f.longitude != null
            ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: f.latitude, lng: f.longitude })
            : null,
      }));
    return rows.sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity));
  }, [q.data, search, filter, loc]);

  return (
    <AppShell title={t("tagline")} subtitle={t("hero_subtitle")}>
      {/* Search Bar near the top */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_placeholder")}
          className={cn(inputCls, "pl-10 text-sm shadow-2xs")}
        />
      </div>

      {/* Exactly Three Simple Filters & Map/List Toggle */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-0.5">
          {filterTabs.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-all active:scale-95",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "border-border/90 bg-card text-foreground/80 hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Easy Map / List View Toggle */}
        <div className="flex shrink-0 items-center rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition",
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title={t("view_list")}
            aria-label={t("view_list")}
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">{t("view_list")}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition",
              viewMode === "map"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            title={t("view_map")}
            aria-label={t("view_map")}
          >
            <MapIcon className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">{t("view_map")}</span>
          </button>
        </div>
      </div>

      {/* Location Bar */}
      <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
        {loc.kind === "ok" ? (
          <span className="text-muted-foreground">{t("loc_sorted")}</span>
        ) : loc.kind === "error" ? (
          <span className="text-caution">{loc.msg}</span>
        ) : (
          <span className="text-muted-foreground">{t("loc_prompt")}</span>
        )}
        {loc.kind !== "ok" && (
          <button
            type="button"
            onClick={askLocation}
            disabled={loc.kind === "loading"}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary disabled:opacity-60 hover:underline"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            <span>{loc.kind === "loading" ? t("loc_locating") : t("loc_use_location")}</span>
          </button>
        )}
      </div>

      {/* Main View Area: Map or List */}
      <section className="mt-3.5 space-y-2.5">
        {q.isLoading ? (
          <Spinner />
        ) : q.isError ? (
          <StateBox
            title="Couldn't load places"
            body={friendlyError(q.error)}
            action={
              <button
                type="button"
                onClick={() => q.refetch()}
                className="font-semibold text-primary"
              >
                Try again
              </button>
            }
          />
        ) : viewMode === "map" ? (
          <ExploreMap
            facilities={list.map(({ f }) => f)}
            userLocation={loc.kind === "ok" ? { lat: loc.lat, lng: loc.lng } : null}
            onLocate={askLocation}
            locState={loc}
          />
        ) : list.length === 0 ? (
          <StateBox title="No places match" body="Try a different search or filter." />
        ) : (
          list.map(({ f, d }) => <FacilityCard key={f.id} f={f} distanceKm={d} />)
        )}
      </section>
    </AppShell>
  );
}
