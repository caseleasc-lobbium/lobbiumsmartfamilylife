"use client";

import { useEffect, useState } from "react";

export default function ConsentManager() {
  const [consent, setConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem("lobbium_consent");
    if (saved) setConsent(JSON.parse(saved));
  }, []);

  const save = () => {
    localStorage.setItem("lobbium_consent", JSON.stringify(consent));
    alert("Einstellungen gespeichert.");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6 text-[#0F1C3F]">Cookie-Einstellungen</h1>

      <div className="flex flex-col gap-6">

        {/* Necessary */}
        <label className="flex justify-between items-center">
          <span className="text-gray-700">Notwendige Cookies</span>
          <input type="checkbox" checked disabled />
        </label>

        {/* Analytics */}
        <label className="flex justify-between items-center">
          <span className="text-gray-700">Analyse / Statistiken</span>
          <input
            type="checkbox"
            checked={consent.analytics}
            onChange={() =>
              setConsent({ ...consent, analytics: !consent.analytics })
            }
          />
        </label>

        {/* Marketing */}
        <label className="flex justify-between items-center">
          <span className="text-gray-700">Marketing</span>
          <input
            type="checkbox"
            checked={consent.marketing}
            onChange={() =>
              setConsent({ ...consent, marketing: !consent.marketing })
            }
          />
        </label>

      </div>

      <button
        onClick={save}
        className="mt-10 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
      >
        Speichern
      </button>
    </div>
  );
}