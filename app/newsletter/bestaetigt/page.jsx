"use client";

import { useEffect, useState } from "react";

const TEXTS = {
  de: {
    title: "✅ Newsletter erfolgreich bestätigt!",
    message:
      "Vielen Dank! Deine E-Mail wurde erfolgreich bestätigt. Ab sofort erhältst du die neuesten Tipps und Inhalte von Lobbium Smart Family Life.",
    button: "Zur Startseite",
  },
  fr: {
    title: "✅ Confirmation réussie !",
    message:
      "Merci ! Ton adresse e-mail a bien été confirmée. Tu recevras désormais les meilleurs conseils et contenus de Lobbium Smart Family Life.",
    button: "Retour à l’accueil",
  },
  en: {
    title: "✅ Newsletter confirmed!",
    message:
      "Thank you! Your email has been successfully confirmed. You will now receive the latest tips and content from Lobbium Smart Family Life.",
    button: "Back to homepage",
  },
};

export default function NewsletterBestaetigt() {
  // Sprache aus ?lang=… (vom Confirm-Redirect gesetzt); Fallback Deutsch.
  const [locale, setLocale] = useState("de");
  useEffect(() => {
    const lang = new URLSearchParams(window.location.search).get("lang");
    if (lang && TEXTS[lang]) setLocale(lang);
  }, []);

  const t = TEXTS[locale] || TEXTS.de;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">{t.title}</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">{t.message}</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          {t.button}
        </a>
      </div>
    </div>
  );
}
