import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, FacilityCard, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { facilitiesQuery, friendlyError, savedIdsQuery } from "@/lib/facilities";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved places — AERA" },
      { name: "description", content: "Your saved water, shade and rest spots." },
      { property: "og:title", content: "Saved places — AERA" },
      { property: "og:description", content: "Your saved water, shade and rest spots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { user, loading } = useAuth();
  const saved = useQuery(savedIdsQuery(user?.id));
  const all = useQuery({ ...facilitiesQuery, enabled: !!user });

  if (loading) return <AppShell title="Saved"><Spinner /></AppShell>;
  if (!user)
    return (
      <AppShell title="Saved">
        <StateBox title="Sign in to save places" body="Keep your go-to spots one tap away." action={<Link to="/auth" className={primaryBtn}>Sign in</Link>} />
      </AppShell>
    );

  const isLoading = saved.isLoading || all.isLoading;
  const err = saved.error || all.error;
  const items = (saved.data ?? []).map((id) => all.data?.find((f) => f.id === id)).filter(Boolean);

  return (
    <AppShell title="Saved">
      <div className="space-y-3">
        {isLoading ? <Spinner /> : err ? <StateBox title="Couldn't load saved places" body={friendlyError(err)} /> :
          items.length === 0 ? <StateBox title="Nothing saved yet" body="Tap Save on any place to keep it here." action={<Link to="/" className="font-semibold text-primary">Explore places</Link>} /> :
          items.map((f) => <FacilityCard key={f!.id} f={f!} />)}
      </div>
    </AppShell>
  );
}
