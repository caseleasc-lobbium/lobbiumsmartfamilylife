"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AffiliateCategoryStats() {
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [affiliates, setAffiliates] = useState([]);

  // API laden
  const loadData = async () => {
    const res1 = await fetch("/api/affiliates/category-stats");
    const res2 = await fetch("/api/affiliates");

    const s = await res1.json();
    const a = await res2.json();

    setStats(s);
    setAffiliates(a);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!stats) {
    return (
      <div className="text-center p-10 text-gray-500">
        Lade Kategorie-Daten…
      </div>
    );
  }

  const categories = {
    finanzen: "Finanzen & Spartipps",
    familie: "Familienleben",
    bildung: "Kinder & Bildung",
    lifestyle: "Lifestyle",
  };

  return (
    <div className="max-w-6xl mx-auto p-10 bg-white rounded-3xl shadow-xl">
      <h1 className="text-2xl font-bold mb-8">📂 Kategorie Performance</h1>

      {Object.keys(categories).map((catKey) => {
        const cat = stats[catKey];
        if (!cat) return null;

        return (
          <div key={catKey} className="mb-12 border-b pb-10">
            {/* Titel */}
            <h2 className="text-xl font-bold mb-4">
              {categories[catKey]}
            </h2>

            {/* Kacheln */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-6 bg-blue-100 rounded-2xl shadow text-center">
                <h2 className="text-xl font-bold text-blue-700">Heute</h2>
                <p className="text-3xl font-bold">{cat.today}</p>
              </div>

              <div className="p-6 bg-yellow-100 rounded-2xl shadow text-center">
                <h2 className="text-xl font-bold text-yellow-700">Gestern</h2>
                <p className="text-3xl font-bold">{cat.yesterday}</p>
              </div>

              <div className="p-6 bg-green-100 rounded-2xl shadow text-center">
                <h2 className="text-xl font-bold text-green-700">Gesamt</h2>
                <p className="text-3xl font-bold">{cat.total}</p>
              </div>
            </div>

            {/* Bester Partner */}
            {cat.topPartner ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-semibold mb-2">🏆 Bester Partner</h3>

                <p className="text-gray-700 mb-1">
                  Partner-ID: <b>#{cat.topPartner.partner_id}</b>
                </p>

                <p className="text-gray-700 mb-3">
                  Klicks: <b>{cat.topPartner.clicks}</b>
                </p>

                <button
                  onClick={() =>
                    router.push(`/admin/affiliates/${cat.topPartner.partner_id}/edit`)
                  }
                  className="text-blue-600 underline"
                >
                  Partner bearbeiten →
                </button>
              </div>
            ) : (
              <p className="text-gray-500 mb-6">Keine Daten vorhanden.</p>
            )}

            {/* Tabelle aller Partner dieser Kategorie */}
            <h3 className="font-semibold mb-3">
              📋 Partner dieser Kategorie
            </h3>

            <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Partner</th>
                  <th className="p-3 text-left">Klicks</th>
                  <th className="p-3 text-left">Aktion</th>
                </tr>
              </thead>

              <tbody>
                {affiliates
                  .filter((a) => a.category === catKey)
                  .map((a) => {
                    const ranking = cat.ranking || {};
                    const clicks = ranking[a.id] || 0;

                    return (
                      <tr
                        key={a.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{a.title}</td>
                        <td className="p-3 font-bold">{clicks}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/affiliates/${a.id}/edit`)
                            }
                            className="text-blue-600 underline"
                          >
                            Bearbeiten
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}