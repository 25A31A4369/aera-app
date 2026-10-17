import { ArrowRight, Droplets, Sun, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { AeraLogo } from "@/components/AeraLogo";
import welcomeImage from "@/assets/aera-welcome.jpg";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-between bg-background px-5 py-6 text-foreground">
      {/* Top Header Branding */}
      <header className="flex flex-col items-center pt-2 text-center">
        <AeraLogo size="xl" variant="badge" className="shadow-xs" />
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-primary">
          AERA
        </h1>
        <p className="mt-1 font-display text-sm font-semibold tracking-wide text-foreground/90">
          {t("tagline")}
        </p>
      </header>

      {/* Hero Content Section */}
      <div className="my-auto space-y-4 py-4">
        {/* Welcome Illustration Image */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 shadow-soft bg-muted/40 aspect-[16/10]">
          <img
            src={welcomeImage}
            alt="Outdoor workers finding shade and drinking water"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-white/90">
              For outdoor workers across India
            </p>
          </div>
        </div>

        {/* Short, clear introduction */}
        <div className="text-center px-1">
          <h2 className="text-lg font-bold text-foreground">{t("welcome_title")}</h2>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t("welcome_desc")}</p>
        </div>

        {/* 3 Simple Value Points */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Droplets className="h-4 w-4" />
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-foreground">Drinking Water</span>
              <p className="text-[11px] text-muted-foreground">
                Nearby clean public water points & kiosks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sun className="h-4 w-4" />
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-foreground">Shade & Rest Areas</span>
              <p className="text-[11px] text-muted-foreground">
                Trees, covered shelters, and rest benches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-2xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-foreground">Honest Freshness</span>
              <p className="text-[11px] text-muted-foreground">
                See how recently each spot was confirmed by workers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <footer className="pt-3">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition active:scale-[0.99] hover:bg-primary/95"
        >
          <span>{t("get_started")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}
