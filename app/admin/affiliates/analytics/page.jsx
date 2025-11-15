"use client";

import { useEffect, useState } from "react";

export default function AffiliateAnalyticsPage() {
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await fetch("/api/affiliates/analytics");
    const d = await res.json();
    setData(d);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return (
      <div className="text-center p-10 text-gray-500">
        Lade Statistiken…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white rounded-3xl shadow-lg">

      <h1 className="text-2xl font-bold mb-8">📊 Affiliate Analytics</h1>

      {/* Kacheln */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        <div className="p-6 bg-blue-100 rounded-2xl shadow text-center">
          <h2 className="text-xl font-bold text-blue-700">Heute</h2>
          <p className="text-3xl font-bold">{data.today}</p>
        </div>

        <div className="p-6 bg-yellow-100 rounded-2xl shadow text-center">
          <h2 className="text-xl font-bold text-yellow-700">Gestern</h2>
          <p className="text-3xl font-bold">{data.yesterday}</p>
        </div>

        <div className="p-6 bg-green-100 rounded-2xl shadow text-center">
          <h2 className="text-xl font-bold text-green-700">Gesamt</h2>
          <p className="text-3xl font-bold">{data.total}</p>
        </div>

      </div>

      {/* Ranking Tabelle */}
      <h2 className="text-xl font-semibold mb-4">🏆 Partner Ranking</h2>

      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Partner-ID</th>
            <th className="p-3 text-left">Klicks</th>
          </tr>
        </thead>

        <tbody>
          {data.ranking.length === 0 ? (
            <tr>
              <td className="p-3 text-center text-gray-500" colSpan="2">
                Keine Daten vorhanden.
              </td>
            </tr>
          ) : (
            data.ranking.map((r) => (
              <tr
                key={r.partner_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">#{r.partner_id}</td>
                <td className="p-3 font-bold">{r.count}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}