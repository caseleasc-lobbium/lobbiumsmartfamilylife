"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageProvider";
import { SUPPORTED_LOCALES } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const router = useRouter();

  const choose = (l) => {
    setLocale(l);
    // Server-Komponenten (Blog-Liste/Artikel) mit neuer Sprache neu rendern
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1" aria-label="Sprache wählen">
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => choose(l)}
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
