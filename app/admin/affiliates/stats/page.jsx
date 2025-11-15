"use client";

import { useEffect, useState } from "react";

export default function AffiliateStatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [latestClicks, setLatestClicks] = useState([]);
  const [totalPartners, setTotalPartners] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/affiliates/stats");
        const data = await res.json();

        if (!data.error) {
          setStats(data.stats || []);
          setLatestClicks(data.latestClicks || []);
          setTotalPartners(data.totalPartners || 0);
          setTotalClicks(data.totalClicks || 0);
        }
      } catch (err) {
        console.error("Stats load error:", err);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Lade Affiliate-Statistiken...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-10 rounded-3xl shadow-lg">

      {/* Kopfzeile */}
      <h1 className="text-2xl font-bold mb-6">📊 Affiliate-Statistiken</h1>

      {/* Gesamtübersicht */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-bold text-blue-700">{totalPartners}</h2>
          <p className="text-gray-600">Partner insgesamt</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-bold text-blue-700">{totalClicks}</h2>
          <p className="text-gray-600">Klicks insgesamt</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h2 className="text-xl font-bold text-blue-700">
            {stats.length > 0 ? stats[0]?.title : "-"}
          </h2>
          <p className="text-gray-600">Meistgeklickter Partner</p>
        </div>

      </div>

      {/* Klicks pro Partner */}
      <h2 className="text-xl font-bold mb-4">📌 Klicks pro Partner</h2>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Partner</th>
              <th className="p-3 text-left">Klicks</th>
              <th className="p-3 text-left">Letzter Klick</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.title}</td>
                <td className="p-3">{s.totalClicks}</td>
                <td className="p-3">
                  {s.lastClick
                    ? new Date(s.lastClick).toLocaleString("de-DE")
                    : "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Letzten 50 Klicks */}
      <h2 className="text-xl font-bold mb-4">🕒 Letzte 50 Klicks</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Partner-ID</th>
              <th className="p-3 text-left">IP-Adresse</th>
              <th className="p-3 text-left">User-Agent</th>
              <th className="p-3 text-left">Datum</th>
            </tr>
          </thead>
          <tbody>
            {latestClicks.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.partner_id}</td>
                <td className="p-3">{c.ip_address}</td>
                <td className="p-3">{c.user_agent}</td>
                <td className="p-3">
                  {new Date(c.clicked_at).toLocaleString("de-DE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}