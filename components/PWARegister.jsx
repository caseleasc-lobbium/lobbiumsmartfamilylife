"use client";

import { useEffect, useState } from "react";
import Lobbi from "./Lobbi";
import { useI18n } from "./i18n/LanguageProvider";

const STR = {
  de: { title: "Lobbium als App", text: "Füg Lobbium zum Startbildschirm hinzu – Tools & Ratgeber immer griffbereit.", install: "Installieren", later: "Später" },
  en: { title: "Lobbium as an app", text: "Add Lobbium to your home screen – tools & guides always at hand.", install: "Install", later: "Later" },
  fr: { title: "Lobbium en appli", text: "Ajoutez Lobbium à l'écran d'accueil – outils & guides toujours à portée.", install: "Installer", later: "Plus tard" },
};

export default function PWARegister() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [deferred, setDeferred] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Service Worker registrieren
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    // theme-color + apple-touch-icon injizieren (falls nicht vorhanden)
    const ensure = (sel, create) => {
      if (!document.head.querySelector(sel)) document.head.appendChild(create());
    };
    ensure('meta[name="theme-color"]', () => {
      const m = document.createElement("meta");
      m.name = "theme-color"; m.content = "#2b6cb0"; return m;
    });
    ensure('link[rel="apple-touch-icon"]', () => {
      const l = document.createElement("link");
      l.rel = "apple-touch-icon"; l.href = "/icon.svg"; return l;
    });

    // Install-Prompt abfangen
    const onPrompt = (e) => {
      e.preventDefault();
      if (localStorage.getItem("lobbium_a2hs_dismissed") === "1") return;
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try { await deferred.userChoice; } catch {}
    setShow(false);
    setDeferred(null);
  };
  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem("lobbium_a2hs_dismissed", "1"); } catch {}
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 flex gap-3 items-center">
      <Lobbi size={56} className="shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-[#0F1C3F] text-sm">{s.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{s.text}</p>
        <div className="mt-2 flex gap-2">
          <button onClick={install} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg">{s.install}</button>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 text-sm px-2">{s.later}</button>
        </div>
      </div>
    </div>
  );
}
