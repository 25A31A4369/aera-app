import { useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { LANGUAGE_OPTIONS, type SupportedLanguage, type LanguageOption } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";
import { AeraLogo } from "@/components/AeraLogo";
import { cn } from "@/lib/utils";

interface LanguageSelectionScreenProps {
  onContinue?: (language: SupportedLanguage) => void;
  isSettingsView?: boolean;
}

export function LanguageSelectionScreen({
  onContinue,
  isSettingsView = false,
}: LanguageSelectionScreenProps) {
  const { language, setLanguage, completeLanguageSelection, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);

  const handleSelect = (code: SupportedLanguage) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleContinue = () => {
    completeLanguageSelection(selectedLang);
    onContinue?.(selectedLang);
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-background text-foreground">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-2 overscroll-contain">
        {/* Header Branding */}
        <header className="pt-2 pb-3 text-center">
          <AeraLogo size="xl" variant="badge" className="mx-auto shadow-xs" />

          <h1 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-primary">
            AERA
          </h1>
          <p className="mt-0.5 font-display text-xs font-medium text-foreground/85">
            {t("tagline")}
          </p>

          <div className="mt-3 rounded-xl border border-primary/20 bg-card p-3 text-left shadow-soft">
            <div className="flex items-center gap-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <h2 className="text-xs font-bold text-foreground">{t("choose_language_title")}</h2>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
              {t("choose_language_subtitle")}
            </p>
          </div>
        </header>

        {/* All 5 Language Options */}
        <div className="space-y-2 pb-2" role="radiogroup" aria-label="Language selection">
          {LANGUAGE_OPTIONS.map((option: LanguageOption) => {
            const isSelected = selectedLang === option.code;
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelect(option.code)}
                role="radio"
                aria-checked={isSelected}
                className={cn(
                  "relative flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary shadow-soft"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div className="flex-1 pr-2.5">
                  <span className="text-sm font-bold text-foreground">{option.label}</span>
                  <p className="mt-0.5 text-xs font-medium text-primary/85">
                    "{option.samplePhrase}"
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{option.description}</p>
                </div>

                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-card",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar — Always visible and usable on all mobile viewports */}
      <div className="sticky bottom-0 z-20 w-full shrink-0 border-t border-border/50 bg-background/95 px-5 pt-3 pb-5 shadow-soft backdrop-blur-md">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition active:scale-[0.99] hover:bg-primary/95"
        >
          <span>{isSettingsView ? "Save Language" : t("continue_button")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        {!isSettingsView && (
          <button
            type="button"
            onClick={() => {
              completeLanguageSelection(selectedLang);
              if (onContinue) onContinue(selectedLang);
            }}
            className="mt-1.5 block w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground py-1"
          >
            {t("skip_to_explore")}
          </button>
        )}
      </div>
    </div>
  );
}
