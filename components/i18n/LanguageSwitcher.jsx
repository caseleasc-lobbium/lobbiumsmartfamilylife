"use client";

import { useI18n } from "./LanguageProvider";
import { SUPPORTED_LOCALES } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1" aria-label="Sprache wählen">
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 text-xs rounded-md uppercase font-semibold transition ${
            locale === l
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
