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
    <div className="max-w-7xl mx-auto mt-10 px-6 pb-20">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Affiliate-Statistiken
      </h1>
      <p className="text-gray-600 mb-10">
        Übersicht über Partner-Performance, Klicks und aktuelle Aktivitäten.
      </p>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Partner insgesamt</p>
          <h2 className="text-3xl font-semibold mt-2 text-blue-700">
            {totalPartners}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Klicks insgesamt</p>
          <h2 className="text-3xl font-semibold mt-2 text-blue-700">
            {totalClicks}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Meistgeklickter Partner</p>
          <h2 className="text-lg font-semibold mt-2 text-blue-700">
            {stats.length > 0 ? stats[0]?.title : "–"}
          </h2>
        </div>

      </div>

      {/* TABLE – KLICKS PRO PARTNER */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Klicks pro Partner
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
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
      </div>

      {/* TABLE – LETZTE 50 KLICKS */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Letzte 50 Klicks
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Partner-ID</th>
                <th className="p-3 text-left">IP-Adresse</th>
                <th className="ptext-left">User-Agent</th>
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

    </div>
  );
}