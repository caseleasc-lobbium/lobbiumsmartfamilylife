"use client";

import { useEffect, useState } from "react";
import ChartCard from "../../../../components/ChartCard";

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
        🔄 Affiliate-Statistiken werden geladen…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white p-10 rounded-3xl shadow-lg">

      {/* HEADLINE */}
      <h1 className="text-3xl font-bold mb-10 text-[#0F1C3F]">
        📊 Affiliate-Analysen & Klick-Statistik
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

        <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl shadow-sm text-center">
          <h2 className="text-4xl font-bold text-blue-700">{totalPartners}</h2>
          <p className="text-gray-600 text-sm mt-1">Partner insgesamt</p>
        </div>

        <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl shadow-sm text-center">
          <h2 className="text-4xl font-bold text-blue-700">{totalClicks}</h2>
          <p className="text-gray-600 text-sm mt-1">Klicks insgesamt</p>
        </div>

        <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl shadow-sm text-center">
          <h2 className="text-xl font-semibold text-blue-700">
            {stats.length > 0 ? stats[0]?.title : "–"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">Meistgeklickter Partner</p>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

        <ChartCard
          title="Klicks der letzten 7 Tage"
          labels={stats.map((s) => s.day || "")}
          data={stats.map((s) => s.totalClicks || 0)}
        />

        <ChartCard
          title="Klicks pro Kategorie"
          labels={["Finanzen", "Familie", "Bildung", "Lifestyle"]}
          data={[
            stats.filter(s => s.category === "finanzen").reduce((a,b)=>a+b.totalClicks,0),
            stats.filter(s => s.category === "familie").reduce((a,b)=>a+b.totalClicks,0),
            stats.filter(s => s.category === "bildung").reduce((a,b)=>a+b.totalClicks,0),
            stats.filter(s => s.category === "lifestyle").reduce((a,b)=>a+b.totalClicks,0),
          ]}
        />

      </div>

      {/* TABLE: CLICK PER PARTNER */}
      <h2 className="text-2xl font-bold mb-5 text-[#0F1C3F]">📌 Klicks pro Partner</h2>

      <div className="overflow-x-auto mb-16">
        <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <thead className="bg-gray-100 text-sm">
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
                  {s.lastClick ? new Date(s.lastClick).toLocaleString("de-DE") : "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLE: LAST 50 CLICKS */}
      <h2 className="text-2xl font-bold mb-5 text-[#0F1C3F]">🕒 Letzte 50 Klicks</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <thead className="bg-gray-100 text-sm">
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
                <td className="p-3 text-xs">{c.user_agent}</td>
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