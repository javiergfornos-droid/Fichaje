"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { dictionaries, type TranslationKey } from "@/lib/i18n/dictionaries";

export type Locale = "es" | "en";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
  isHydrated: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "fichaje.locale.v1";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "es" || stored === "en") {
        setLocaleState(stored);
      } else if (typeof navigator !== "undefined") {
        // Infer from browser language on first visit
        const nav = navigator.language?.toLowerCase() ?? "";
        if (nav.startsWith("en")) setLocaleState("en");
      }
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  useEffect(() => {
    if (isHydrated && typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale, isHydrated]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>) => {
      const dict = dictionaries[locale];
      let out = dict[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        }
      }
      return out;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, isHydrated }),
    [locale, setLocale, t, isHydrated]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
