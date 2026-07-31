"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  translations,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from "@/lib/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  // Gespeicherte Sprache laden (nach Mount → keine Hydration-Mismatch)
  useEffect(() => {
    try {
      const cookieMatch = document.cookie.match(/(?:^|; )lobbium_locale=([^;]+)/);
      const fromCookie = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
      const saved = fromCookie || localStorage.getItem("lobbium_locale");
      if (saved && SUPPORTED_LOCALES.includes(saved)) setLocaleState(saved);
    } catch {}
  }, []);

  // <html lang> aktuell halten
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = (l) => {
    if (!SUPPORTED_LOCALES.includes(l)) return;
    setLocaleState(l);
    try {
      localStorage.setItem("lobbium_locale", l);
      // Cookie, damit Server-Komponenten (Blog) die Sprache kennen
      document.cookie = `lobbium_locale=${l}; path=/; max-age=31536000; samesite=lax`;
    } catch {}
  };

  const t = (section, key) => {
    const active = translations[locale] || translations[DEFAULT_LOCALE];
    return (
      active?.[section]?.[key] ??
      translations[DEFAULT_LOCALE]?.[section]?.[key] ??
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Defensiver Hook: funktioniert auch ohne Provider (Fallback auf Default-Sprache)
export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (ctx) return ctx;
  return {
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    t: (section, key) =>
      translations[DEFAULT_LOCALE]?.[section]?.[key] ?? key,
  };
}
