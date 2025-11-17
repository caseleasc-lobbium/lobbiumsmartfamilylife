"use client";

import { useState } from "react";
import SectionHero from "../../components/SectionHero";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Bitte E-Mail-Adresse eingeben.");
      return;
    }
    if (!consent) {
      setMessage("Bitte stimme der Datenschutzerklärung zu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          locale: "de",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
      } else {
        setMessage("Danke! Bitte bestätige deine Anmeldung in deiner E-Mail.");
        setEmail("");
        setName("");
        setConsent(false);
      }
    } catch {
      setMessage("Netzwerkfehler. Bitte später erneut versuchen.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* HERO – Einheitlich wie alle Rubrik-Seiten */}
      <SectionHero
        title="Newsletter"
        subtitle="Erhalte täglich moderne Tipps & Empfehlungen für Finanzen, Familienleben, Kinder & Lifestyle – direkt in dein Postfach."
      />

      {/* FORMULAR – Apple Style Clean */}
      <section className="w-full max-w-xl px-6 pb-24">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
        >
          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Name (optional)
            </label>
            <input
              type="text"
              placeholder="Wie dürfen wir dich ansprechen?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DSGVO Checkbox */}
          <div className="flex items-start gap-3 mb-5">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-xs text-gray-600 leading-relaxed">
              Ich stimme zu, dass meine Daten für den Versand des Newsletters
              verarbeitet werden. Mehr dazu in der{" "}
              <a href="/datenschutz" className="text-blue-600 underline">
                Datenschutzerklärung
              </a>.
            </label>
          </div>

          {/* Nachricht */}
          {message && (
            <p className="text-sm text-gray-700 mb-4">{message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Wird gesendet..." : "Jetzt kostenlos anmelden"}
          </button>
        </form>
      </section>
    </div>
  );
}