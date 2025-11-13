"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Dummy-Daten – später ersetzen durch echte DB-Verbindung
  const [emails, setEmails] = useState([
    "beispiel1@mail.com",
    "beispiel2@mail.com",
    "familie@test.de",
  ]);

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // Kein gültiges Login → redirect
    if (auth !== "true") {
      router.push("/admin/login");
      return;
    }

    // Session timeout (30 Min)
    const now = Date.now();
    const diff = now - parseInt(loginTime);

    if (diff > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte neu einloggen.");
      router.push("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Newsletter-Daten...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
        📬 Newsletter Verwaltung
      </h1>

      <p className="text-gray-600 text-center mb-6">
        Hier kannst du alle eingetragenen Newsletter-E-Mails einsehen.
      </p>

      {/* Liste */}
      <div className="space-y-3">
        {emails.length === 0 ? (
          <p className="text-center text-gray-500">Keine Einträge vorhanden.</p>
        ) : (
          emails.map((email, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border shadow-sm"
            >
              <span>{email}</span>
              <button
                onClick={() =>
                  setEmails((prev) => prev.filter((e) => e !== email))
                }
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Löschen
              </button>
            </div>
          ))
        )}
      </div>

      {/* CSV EXPORT – später aktivieren */}
      <div className="text-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow">
          CSV Export (bald verfügbar)
        </button>
      </div>
    </div>
  );
}