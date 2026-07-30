"use client";

import { useState } from "react";
import SectionHero from "../../components/SectionHero";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!email) {
      setMessage("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    if (!consent) {
      setMessage("Bitte setze das Häkchen zur Datenschutzerklärung, um fortzufahren.");
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
        setSuccess(true);
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

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-green-700 mb-2">Fast geschafft!</h2>
            <p className="text-gray-700 leading-relaxed">
              Danke für deine Anmeldung. Wir haben dir eine{" "}
              <b>Bestätigungs-E-Mail</b> geschickt — bitte klicke darin auf
              „Jetzt bestätigen", um deine Anmeldung abzuschließen.
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Keine Mail erhalten? Bitte schau auch im <b>Spam-Ordner</b> nach.
            </p>
          </div>
        ) : (
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

          {/* Fehler-/Hinweismeldung – deutlich sichtbar */}
          {message && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
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
        )}
      </section>
    </div>
  );
}