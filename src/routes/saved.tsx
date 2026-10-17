import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, FacilityCard, Spinner, StateBox, primaryBtn } from "@/components/aera";
import { facilitiesQuery, friendlyError, savedIdsQuery } from "@/lib/facilities";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Places — AERA" },
      { name: "description", content: "Your saved water, shade and rest spots." },
      { property: "og:title", content: "Saved Places — AERA" },
      { property: "og:description", content: "Your saved water, shade and rest spots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const saved = useQuery(savedIdsQuery(user?.id));
  const all = useQuery({ ...facilitiesQuery, enabled: !!user });

  if (loading) {
    return (
      <AppShell title={t("nav_saved")}>
        <Spinner />
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell title={t("nav_saved")}>
        <StateBox
          title="Sign in to save places"
          body="Save your go-to water and shade spots to easily find them anytime."
          action={
            <Link to="/auth" className={primaryBtn}>
              {t("sign_in_title")}
            </Link>
          }
        />
      </AppShell>
    );
  }

  const isLoading = saved.isLoading || all.isLoading;
  const err = saved.error || all.error;
  const items = (saved.data ?? []).map((id) => all.data?.find((f) => f.id === id)).filter(Boolean);

  return (
    <AppShell title={t("nav_saved")} subtitle="Your saved water points and shaded spots">
      <div className="space-y-3">
        {isLoading ? (
          <Spinner />
        ) : err ? (
          <StateBox title="Couldn't load saved places" body={friendlyError(err)} />
        ) : items.length === 0 ? (
          <StateBox
            title="Nothing saved yet"
            body="Tap the bookmark button on any place to keep it here."
            action={
              <Link to="/" className="font-semibold text-primary">
                Explore places
              </Link>
            }
          />
        ) : (
          items.map((f) => <FacilityCard key={f!.id} f={f!} />)
        )}
      </div>
    </AppShell>
  );
}
