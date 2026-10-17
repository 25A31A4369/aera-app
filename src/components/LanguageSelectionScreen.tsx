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
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2 overscroll-contain">
        {/* Header Branding */}
        <header className="pt-2 pb-5 text-center">
          <AeraLogo size="xl" variant="badge" className="mx-auto shadow-xs" />

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
            {t("choose_language_title")}
          </h1>
          <p className="mt-0.5 font-display text-xs font-semibold text-primary">{t("tagline")}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed px-4">
            {t("choose_language_subtitle")}
          </p>
        </header>

        {/* Exactly 5 Language Options */}
        <div className="space-y-2.5 pb-3" role="radiogroup" aria-label="Language selection">
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
                  "relative flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary shadow-soft"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                )}
              >
                <div className="flex-1 pr-3">
                  <span className="text-base font-semibold text-foreground">{option.label}</span>
                </div>

                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 bg-card",
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar with Continue Button */}
      <div className="sticky bottom-0 z-20 w-full shrink-0 border-t border-border/50 bg-background/95 px-5 pt-3 pb-6 shadow-soft backdrop-blur-md">
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition active:scale-[0.99] hover:bg-primary/95"
        >
          <span>{isSettingsView ? "Save Language" : t("continue_button")}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
