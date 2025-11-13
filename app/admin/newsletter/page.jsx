"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);

  // 🔐 Admin-Schutz (Login + Timeout)
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const now = Date.now();
    const diff = now - parseInt(loginTime);

    if (!loginTime || diff > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // 📨 Newsletter-Daten laden
  useEffect(() => {
    fetch("/api/subscribers")
      .then((res) => res.json())
      .then((data) => setSubscribers(data || []))
      .catch(() => setSubscribers([]));
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Newsletter-Abonnenten...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">📬 Newsletter-Abonnenten</h1>

      <p className="text-gray-600 mb-6">
        Hier siehst du aktuell alle Abonnenten der Plattform.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Name</th>
              <th className="text-left p-4 font-semibold text-gray-700">E-Mail</th>
              <th className="text-left p-4 font-semibold text-gray-700">Einwilligung</th>
              <th className="text-left p-4 font-semibold text-gray-700">Erstellt am</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Keine Abonnenten vorhanden.
                </td>
              </tr>
            )}

            {subscribers.map((s) => (
              <tr
                key={s.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4">{s.name}</td>
                <td className="p-4 text-gray-600">{s.email}</td>
                <td className="p-4">
                  {s.consent ? "✅ Ja" : "❌ Nein"}
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}