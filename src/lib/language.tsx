import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  LANGUAGE_OPTIONS,
  t as translate,
  type LanguageOption,
  type SupportedLanguage,
  type TranslationKey,
} from "./i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  hasCompletedWelcome: boolean;
  completeWelcome: () => void;
  hasSelectedLanguage: boolean;
  completeLanguageSelection: (lang?: SupportedLanguage) => void;
  resetLanguageSelection: () => void;
  resetOnboarding: () => void;
  currentOption: LanguageOption;
  t: (key: TranslationKey) => string;
}

const STORAGE_KEY_LANG = "aera_user_language";
const STORAGE_KEY_WELCOME = "aera_welcome_completed";
const STORAGE_KEY_SELECTED = "aera_language_selected";

const defaultOption = LANGUAGE_OPTIONS[0] ?? {
  code: "en" as const,
  label: "English",
  nativeName: "English",
  englishName: "English",
  description: "Standard English interface",
  samplePhrase: "Find drinking water & shaded rest spots",
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  hasCompletedWelcome: false,
  completeWelcome: () => {},
  hasSelectedLanguage: false,
  completeLanguageSelection: () => {},
  resetLanguageSelection: () => {},
  resetOnboarding: () => {},
  currentOption: defaultOption,
  t: (key: TranslationKey) => translate(key, "en"),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState<boolean>(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLang = localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage | null;
        const storedWelcome = localStorage.getItem(STORAGE_KEY_WELCOME) === "true";
        const storedSelected = localStorage.getItem(STORAGE_KEY_SELECTED) === "true";

        if (
          storedLang &&
          (storedLang === "en" ||
            storedLang === "te" ||
            storedLang === "te-en" ||
            storedLang === "hi" ||
            storedLang === "hi-en")
        ) {
          setLanguageState(storedLang);
        }
        setHasCompletedWelcome(storedWelcome);
        setHasSelectedLanguage(storedSelected);
      } catch {
        // LocalStorage access may fail in restricted iframes
      } finally {
        setIsHydrated(true);
      }
    } else {
      setIsHydrated(true);
    }
  }, []);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_LANG, newLang);
      } catch {
        // ignore
      }
    }
  }, []);

  const completeWelcome = useCallback(() => {
    setHasCompletedWelcome(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_WELCOME, "true");
      } catch {
        // ignore
      }
    }
  }, []);

  const completeLanguageSelection = useCallback(
    (chosenLang?: SupportedLanguage) => {
      const finalLang = chosenLang || language;
      if (chosenLang) {
        setLanguageState(chosenLang);
      }
      setHasSelectedLanguage(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY_LANG, finalLang);
          localStorage.setItem(STORAGE_KEY_SELECTED, "true");
        } catch {
          // ignore
        }
      }
    },
    [language],
  );

  const resetLanguageSelection = useCallback(() => {
    setHasSelectedLanguage(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_SELECTED);
      } catch {
        // ignore
      }
    }
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedWelcome(false);
    setHasSelectedLanguage(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY_WELCOME);
        localStorage.removeItem(STORAGE_KEY_SELECTED);
        localStorage.removeItem("aera_demo_mode_active");
        localStorage.removeItem("aera_explore_search");
        localStorage.removeItem("aera_explore_filter");
        localStorage.removeItem("aera_report_draft");
        localStorage.removeItem("aera_selected_facility");
      } catch {
        // ignore
      }
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translate(key, language);
    },
    [language],
  );

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) ?? defaultOption;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        hasCompletedWelcome,
        completeWelcome,
        hasSelectedLanguage,
        completeLanguageSelection,
        resetLanguageSelection,
        resetOnboarding,
        currentOption,
        t,
      }}
    >
      {/* Set document lang attribute */}
      <div
        lang={language.startsWith("te") ? "te" : language.startsWith("hi") ? "hi" : "en"}
        data-hydrated={isHydrated ? "true" : "false"}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
