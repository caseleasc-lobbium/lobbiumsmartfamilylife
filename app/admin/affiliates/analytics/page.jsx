"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AffiliateAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // 🔐 Login Check
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const time = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const now = Date.now();
    if (!time || now - parseInt(time) > 30 * 60 * 1000) {
      localStorage.clear();
      alert("⏳ Session expired");
      router.replace("/admin/login");
      return;
    }

    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await fetch("/api/affiliates/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Analytics error:", err);
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="p-10 text-gray-500 text-center">
        ⏳ Lade Analytics...
      </div>
    );
  }

  return (
    <div className="p-10 bg-white shadow-xl rounded-3xl w-full">

      <h1 className="text-3xl font-bold mb-8">📊 Affiliate Analytics</h1>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        <div className="p-6 bg-blue-50 rounded-3xl shadow">
          <h2 className="text-lg font-semibold text-blue-700">Total Partner</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalPartners}</p>
        </div>

        <div className="p-6 bg-green-50 rounded-3xl shadow">
          <h2 className="text-lg font-semibold text-green-700">Total Klicks</h2>
          <p className="text-4xl font-bold mt-2">{stats.totalClicks}</p>
        </div>

        <div className="p-6 bg-purple-50 rounded-3xl shadow">
          <h2 className="text-lg font-semibold text-purple-700">Top Partner</h2>
          <p className="text-2xl font-bold mt-2">
            {stats.stats[0]?.title || "Keine Daten"}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* --- TOP PARTNER TABLE --- */}
        <div className="p-6 bg-gray-50 rounded-3xl shadow">
          <h2 className="text-xl font-bold mb-4">🏆 Top Partner Ranking</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-2">Partner</th>
                <th className="p-2">Klicks</th>
                <th className="p-2">Letzter Klick</th>
              </tr>
            </thead>

            <tbody>
              {stats.stats.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{p.title}</td>
                  <td className="p-2 font-bold">{p.totalClicks}</td>
                  <td className="p-2 text-gray-500">
                    {p.lastClick
                      ? new Date(p.lastClick).toLocaleString()
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- LAST CLICKS --- */}
        <div className="p-6 bg-gray-50 rounded-3xl shadow">
          <h2 className="text-xl font-bold mb-4">🕒 Letzte 50 Klicks</h2>

          <div className="max-h-[400px] overflow-y-auto pr-2">
            {stats.latestClicks.map((c) => (
              <div
                key={c.id}
                className="mb-3 bg-white p-3 rounded-xl shadow flex justify-between"
              >
                <span>
                  Partner #{c.partner_id}  
                  <br />
                  <span className="text-gray-500 text-sm">{c.ip_address}</span>
                </span>

                <span className="text-gray-600 text-sm">
                  {new Date(c.clicked_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}