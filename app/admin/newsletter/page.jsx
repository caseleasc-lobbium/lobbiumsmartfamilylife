"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [sending, setSending] = useState(false);

  const sendTest = async () => {
    const to = prompt("Test-Ausgabe an welche E-Mail senden?");
    if (!to) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/newsletter/send-weekly?test=${encodeURIComponent(to)}`, { method: "POST" });
      const d = await res.json();
      alert(d.ok ? `✅ Test gesendet an ${to}\nDeals: ${d.issue?.deals} · Tool: ${d.issue?.tool}` : `Fehler: ${d.error || "unbekannt"}`);
    } catch (e) { alert("Fehler: " + e.message); }
    setSending(false);
  };

  const sendAll = async () => {
    if (!confirm("Familien-Spar-Brief JETZT an ALLE bestätigten Abonnenten senden?")) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/newsletter/send-weekly`, { method: "POST" });
      const d = await res.json();
      alert(d.ok ? `✅ Gesendet: ${d.sent}/${d.recipients} (Fehler: ${d.failed})` : `Hinweis: ${d.skipped || d.error || "—"}`);
    } catch (e) { alert("Fehler: " + e.message); }
    setSending(false);
  };

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

  // 📨 Newsletter-Daten laden (aus Supabase API)
  useEffect(() => {
    const loadSubscribers = async () => {
      try {
        const res = await fetch("/api/subscribers");
        const data = await res.json();

        if (data.error) {
          console.error("Fehler:", data.error);
          setSubscribers([]);
        } else {
          setSubscribers(data || []);
        }
      } catch (err) {
        console.error("Fetch Fehler:", err);
        setSubscribers([]);
      }
    };

    loadSubscribers();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Newsletter-Abonnenten...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📬 Newsletter-Abonnenten</h1>

      <p className="text-gray-600 mb-6">
        Übersicht aller Abonnenten der Plattform.
      </p>

      {/* Familien-Spar-Brief – Versand */}
      <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-bold text-[#0F1C3F]">📬 Familien-Spar-Brief</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Wird sonntags automatisch gesendet (Top-Deals + Spartipp + Tool). Hier manuell testen oder sofort senden.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={sendTest} disabled={sending}
              className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 disabled:opacity-50 font-semibold px-4 py-2.5 rounded-xl text-sm">
              {sending ? "…" : "Test an mich"}
            </button>
            <button onClick={sendAll} disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">
              {sending ? "Sende…" : "Jetzt an alle senden"}
            </button>
          </div>
        </div>
      </div>

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
                <td className="p-4">{s.consent ? "✅ Ja" : "❌ Nein"}</td>
                <td className="p-4 text-gray-500">
                  {new Date(s.created_at).toLocaleDateString("de-DE")}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}