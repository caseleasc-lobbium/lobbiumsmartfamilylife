"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("lobbium_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("lobbium_consent", "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("lobbium-consent-updated"));
  };

  const decline = () => {
    localStorage.setItem("lobbium_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 
      bg-white shadow-xl border border-gray-200 rounded-2xl p-5 
      w-[90%] max-w-lg z-[9999] text-center">

      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Cookies & Datenschutz
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Wir verwenden Cookies, um Inhalte zu personalisieren, Affiliate-Links 
        korrekt zu tracken und unser Angebot zu verbessern. 
        Du kannst selbst entscheiden.
      </p>

      <div className="flex justify-center gap-3 mt-2">
        <button
          onClick={decline}
          className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-sm"
        >
          Ablehnen
        </button>

        <button
          onClick={accept}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm shadow-md"
        >
          Akzeptieren
        </button>
      </div>
    </div>
  );
}