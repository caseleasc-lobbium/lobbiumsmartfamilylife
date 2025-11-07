"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 text-center text-sm shadow-md z-[9999]">
      <p className="mb-2 text-gray-700">
        Wir verwenden Cookies, um die Website zu optimieren.{" "}
        <a href="/datenschutz" className="text-[#2b6cb0] underline">
          Mehr erfahren
        </a>
      </p>
      <button
        onClick={acceptCookies}
        className="bg-[#2b6cb0] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#1c3d6c]"
      >
        Akzeptieren
      </button>
    </div>
  );
}