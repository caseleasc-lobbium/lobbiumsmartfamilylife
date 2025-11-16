"use client";

import { useState } from "react";
import SectionHero from "../../components/SectionHero";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const subscribe = async () => {
    if (!email) return;

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">

      <SectionHero
        title="Newsletter"
        subtitle="Erhalte täglich hochwertige Familien-, Spar- und Lifestyle-Empfehlungen — kompakt, modern & werbefrei."
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow p-8 border border-gray-200 mt-6">
        <label className="text-gray-700 text-sm font-medium">E-Mail Adresse</label>

        <input
          type="email"
          className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="deine@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={subscribe}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Jetzt abonnieren
        </button>

        {status === "success" && (
          <p className="text-green-600 text-sm mt-3">
            🎉 Erfolgreich eingetragen! Bitte bestätige deine E-Mail.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 text-sm mt-3">
            ❌ Ein Fehler ist aufgetreten. Bitte erneut versuchen.
          </p>
        )}

        <p className="text-gray-500 text-xs mt-4">
          DSGVO-konform · Kein Spam · Jederzeit kündbar.
        </p>
      </div>

      <div className="pb-24" />
    </div>
  );
}