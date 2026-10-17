import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LocateFixed, Search, List, Map as MapIcon } from "lucide-react";
import { AppShell, FacilityCard, Spinner, StateBox, inputCls } from "@/components/aera";
import { facilitiesQuery, friendlyError } from "@/lib/facilities";
import { haversineKm } from "@/lib/trust";
import { useLanguage } from "@/lib/language";
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
  const { hasSelectedLanguage, completeLanguageSelection } = useLanguage();
  const navigate = useNavigate();

  // First User Journey: LANGUAGE SELECTION is the first screen
  if (!hasSelectedLanguage) {
    return (
      <LanguageSelectionScreen
        onContinue={(chosenLang) => {
          completeLanguageSelection(chosenLang);
          // Transition to next journey step: AUTHENTICATION
          navigate({ to: "/auth" });
        }}
      />
    );
  }

  return <Explore />;
}

function Explore() {
  const { t } = useLanguage();
  const q = useQuery(facilitiesQuery);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "water" | "shade" | "rest">("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loc, setLoc] = useState<LocState>({ kind: "idle" });

  const filterTabs = [
    { key: "all" as const, label: t("filter_all") },
    { key: "water" as const, label: t("filter_water") },
    { key: "shade" as const, label: t("filter_shade") },
    { key: "rest" as const, label: t("filter_rest") },
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
      .filter((f) => filter === "all" || f.category === filter)
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
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_placeholder")}
          className={cn(inputCls, "pl-11 text-sm")}
        />
      </div>

      {/* Filter Tabs & Map/List Toggle */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="-mx-5 flex flex-1 gap-2 overflow-x-auto px-5 pb-1">
          {filterTabs.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-10 shrink-0 rounded-full border px-4 text-xs font-semibold transition-all",
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:bg-muted/60",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex shrink-0 items-center rounded-xl border border-border/80 bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition",
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-xs"
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
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition",
              viewMode === "map"
                ? "bg-primary text-primary-foreground shadow-xs"
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

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
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
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary disabled:opacity-60"
          >
            <LocateFixed className="h-3.5 w-3.5" />
            <span>{loc.kind === "loading" ? t("loc_locating") : t("loc_use_location")}</span>
          </button>
        )}
      </div>

      {/* Main View Area: Map or List */}
      <section className="mt-4 space-y-3">
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
