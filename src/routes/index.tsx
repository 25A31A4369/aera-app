import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LocateFixed, Search } from "lucide-react";
import { AppShell, FacilityCard, Spinner, StateBox, inputCls } from "@/components/aera";
import { facilitiesQuery, friendlyError } from "@/lib/facilities";
import { haversineKm } from "@/lib/trust";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AERA — Find Shade. Find Relief." },
      { name: "description", content: "Find drinking water, shade and rest spots, with clear information on how recently each was confirmed." },
      { property: "og:title", content: "AERA — Find Shade. Find Relief." },
      { property: "og:description", content: "Drinking water, shade and rest spots for outdoor workers, with honest freshness labels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Explore,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "water", label: "Drinking Water" },
  { key: "shade", label: "Shade" },
  { key: "rest", label: "Rest Areas" },
] as const;

type LocState = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; lat: number; lng: number } | { kind: "error"; msg: string };

function Explore() {
  const q = useQuery(facilitiesQuery);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [loc, setLoc] = useState<LocState>({ kind: "idle" });

  const askLocation = () => {
    if (!("geolocation" in navigator)) return setLoc({ kind: "error", msg: "Location is not supported on this device." });
    setLoc({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc({ kind: "ok", lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setLoc({ kind: "error", msg: e.code === 1 ? "Location permission was denied. You can still browse the list." : "Could not get your location." }),
      { timeout: 10000 },
    );
  };

  const list = useMemo(() => {
    const s = search.trim().toLowerCase();
    const rows = (q.data ?? [])
      .filter((f) => filter === "all" || f.category === filter)
      .filter((f) => !s || [f.name, f.address, f.description].some((v) => v?.toLowerCase().includes(s)))
      .map((f) => ({
        f,
        d: loc.kind === "ok" && f.latitude != null && f.longitude != null ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: f.latitude, lng: f.longitude }) : null,
      }));
    return rows.sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity));
  }, [q.data, search, filter, loc]);

  return (
    <AppShell title="Find Shade. Find Relief." subtitle="Water, shade and rest spots — with honest freshness labels.">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search places" aria-label="Search places" className={cn(inputCls, "pl-11")} />
      </div>

      <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "h-10 shrink-0 rounded-full border px-4 text-sm font-medium",
              filter === f.key ? "border-primary bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        {loc.kind === "ok" ? (
          <span className="text-muted-foreground">Sorted by distance where location is known.</span>
        ) : loc.kind === "error" ? (
          <span className="text-caution">{loc.msg}</span>
        ) : (
          <span className="text-muted-foreground">Distances shown only if you share location.</span>
        )}
        {loc.kind !== "ok" && (
          <button onClick={askLocation} disabled={loc.kind === "loading"} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary disabled:opacity-60">
            <LocateFixed className="h-4 w-4" /> {loc.kind === "loading" ? "Locating…" : "Use location"}
          </button>
        )}
      </div>

      <section className="mt-4 space-y-3">
        {q.isLoading ? (
          <Spinner />
        ) : q.isError ? (
          <StateBox title="Couldn't load places" body={friendlyError(q.error)} action={<button onClick={() => q.refetch()} className="font-semibold text-primary">Try again</button>} />
        ) : list.length === 0 ? (
          <StateBox title="No places match" body="Try a different search or filter." />
        ) : (
          list.map(({ f, d }) => <FacilityCard key={f.id} f={f} distanceKm={d} />)
        )}
      </section>
    </AppShell>
  );
}
