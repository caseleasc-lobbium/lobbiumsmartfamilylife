"use client";
import { useState } from "react";

export default function NewsletterPage({ params }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const locale = params.locale;

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    if (res.ok) setSent(true);
  }

  if (sent)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          ✅ Bitte prüfe deine E-Mails
        </h1>
        <p className="text-gray-700 text-center max-w-md">
          Wir haben dir eine Bestätigungs-E-Mail geschickt.  
          Bitte klicke auf den Link, um deine Anmeldung abzuschließen.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Newsletter</h1>
        <p className="text-gray-600 mb-4 text-center">
          Erhalte regelmäßig Tipps, News & Updates von Lobbium Smart Family Life.
        </p>
        <input
          type="email"
          required
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}