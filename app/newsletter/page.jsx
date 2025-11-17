"use client";

import { useState } from "react";

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
        console.error("Newsletter Fehler:", data.error);
        setMessage("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
      } else {
        setMessage(
          "Danke! Bitte bestätige deine Anmeldung über den Link in deiner E-Mail."
        );
        setEmail("");
        setName("");
        setConsent(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Netzwerkfehler. Bitte später erneut versuchen.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Hero-Bereich */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-28 md:py-32 px-6 mt-20 border-b border-[#e1e5ee]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          📬 Lobbium Newsletter
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Erhalte jeden Tag kompakte Tipps & Empfehlungen für{" "}
          <strong>Finanzen, Familienleben, Kinder & Lifestyle</strong> – direkt
          in dein Postfach.
        </p>
      </section>

      {/* Inhalt + Formular */}
      <section className="max-w-xl mx-auto px-6 py-16 text-gray-700">
        <p className="mb-8 text-sm text-gray-600">
          Keine Werbung. Kein Spam. Du erhältst nur ausgewählte Empfehlungen und
          Inhalte aus dem Lobbium-Universum. Du kannst dich jederzeit mit einem
          Klick abmelden.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-3xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Name (optional)
            </label>
            <input
              type="text"
              placeholder="Wie dürfen wir dich ansprechen?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* DSGVO Checkbox */}
          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-xs text-gray-600">
              Ich bin damit einverstanden, dass meine Daten zum Versand des
              Newsletters verarbeitet werden. Hinweise zur Verarbeitung meiner
              Daten finde ich in der{" "}
              <a
                href="/datenschutz"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Datenschutzerklärung
              </a>
              .
            </label>
          </div>

          {message && (
            <p className="text-sm mt-2 text-gray-700">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 inline-flex justify-center px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Wird gesendet..." : "Jetzt kostenlos anmelden"}
          </button>
        </form>
      </section>
    </>
  );
}