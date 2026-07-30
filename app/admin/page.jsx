"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // Dashboard-Daten
  const [newsletterToday, setNewsletterToday] = useState(0);
  const [clicksToday, setClicksToday] = useState(0);
  const [contactsToday, setContactsToday] = useState(0);

  // Tabellen
  const [recentNewsletter, setRecentNewsletter] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  // LOGIN CHECK
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const now = Date.now();
    if (!loginTime || now - parseInt(loginTime) > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, []);

  // Daten laden
  useEffect(() => {
    fetch("/api/newsletter?filter=today")
      .then((r) => r.json())
      .then((d) => setNewsletterToday(d.length || 0))
      .catch((err) => console.error("Newsletter Error:", err));

    // ✅ FIXED: Korrekter Endpoint für Affiliate Klicks
    fetch("/api/affiliates/stats")
      .then((r) => r.json())
      .then((d) => setClicksToday(d.today || 0))
      .catch((err) => console.error("Clicks Error:", err));

    fetch("/api/contact?filter=today")
      .then((r) => r.json())
      .then((d) => setContactsToday(d.length || 0))
      .catch((err) => console.error("Contact Error:", err));

    fetch("/api/newsletter?filter=recent")
      .then((r) => r.json())
      .then((d) => setRecentNewsletter(d))
      .catch((err) => console.error("Newsletter Recent Error:", err));

    fetch("/api/contact?filter=recent")
      .then((r) => r.json())
      .then((d) => setRecentContacts(d))
      .catch((err) => console.error("Contact Recent Error:", err));
  }, []);

  const logout = async () => {
    localStorage.removeItem("lobbiumAdminAuth");
    localStorage.removeItem("lobbiumLoginTime");
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        Dashboard wird geladen...
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[95%] max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛡 Admin Dashboard</h1>
      <p className="text-gray-600 mb-10">
        Willkommen im Administrationsbereich von{" "}
        <b>Lobbium Smart Family Life</b>.
      </p>

      {/* -------------------- KACHELN -------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 text-center">
          <div className="text-4xl mb-3">📩</div>
          <h3 className="text-xl font-semibold text-[#1c3d6c]">Newsletter heute</h3>
          <p className="text-3xl font-bold mt-2">{newsletterToday}</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 text-center">
          <div className="text-4xl mb-3">👣</div>
          <h3 className="text-xl font-semibold text-[#1c3d6c]">Klicks heute</h3>
          <p className="text-3xl font-bold mt-2">{clicksToday}</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-100 text-center">
          <div className="text-4xl mb-3">📬</div>
          <h3 className="text-xl font-semibold text-[#1c3d6c]">Kontakte heute</h3>
          <p className="text-3xl font-bold mt-2">{contactsToday}</p>
        </div>
      </div>

      {/* -------------------- LETZTE NEWSLETTER -------------------- */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-[#1c3d6c] mb-4">
          📩 Letzte Newsletter-Anmeldungen
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#e1e5ee] bg-white rounded-xl overflow-hidden">
            <thead className="bg-[#f0f4ff] text-[#1c3d6c]">
              <tr>
                <th className="p-3 text-left">E-Mail (verschlüsselt)</th>
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Sprache</th>
              </tr>
            </thead>
            <tbody>
              {recentNewsletter.map((n, index) => (
                <tr key={index} className="border-t hover:bg-[#f9faff]">
                  <td className="p-3">{n.email}</td>
                  <td className="p-3">
                    {new Date(n.createdAt).toLocaleString("de-DE")}
                  </td>
                  <td className="p-3">{n.locale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- LETZTE KONTAKTE -------------------- */}
      <div>
        <h2 className="text-xl font-bold text-[#1c3d6c] mb-4">
          📬 Letzte Kontaktanfragen
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#e1e5ee] bg-white rounded-xl overflow-hidden">
            <thead className="bg-[#f0f4ff] text-[#1c3d6c]">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">E-Mail</th>
                <th className="p-3 text-left">Nachricht</th>
                <th className="p-3 text-left">Datum</th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((c, index) => (
                <tr key={index} className="border-t hover:bg-[#f9faff]">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.message}</td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleString("de-DE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}