"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CAT = { "finanzen-spartipps": "💰", familienleben: "🌳", "kinder-bildung": "🎓", lifestyle: "✨" };

export default function AdminDealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/deals");
      const d = await res.json();
      setDeals(Array.isArray(d) ? d : []);
    } catch { setDeals([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id, title) => {
    if (!confirm(`Deal „${title}" wirklich löschen?`)) return;
    const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
    if (res.ok) load(); else alert("Löschen fehlgeschlagen.");
  };

  if (loading) return <div className="p-10 text-center text-gray-500">🔄 Lade Deals…</div>;

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-white p-6 sm:p-8 rounded-3xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎯 Deal-Radar <span className="text-gray-400 text-lg">({deals.length})</span></h1>
        <button onClick={() => router.push("/admin/deals/new")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold">+ Neuer Deal</button>
      </div>

      {deals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Noch keine Deals.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 pr-3">Titel</th><th className="py-2 px-2">Rubrik</th><th className="py-2 px-2">Hook</th><th className="py-2 px-2">Gültig bis</th><th className="py-2 px-2">Status</th><th className="py-2 pl-2 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-3 font-medium text-gray-800">{d.title}</td>
                  <td className="py-3 px-2">{CAT[d.category] || ""}</td>
                  <td className="py-3 px-2 text-gray-500">{d.hook || "—"}</td>
                  <td className="py-3 px-2 text-gray-500">{d.valid_until || "—"}</td>
                  <td className="py-3 px-2">{d.published ? <span className="text-emerald-600 font-semibold">● Live</span> : <span className="text-amber-600 font-semibold">○ Entwurf</span>}</td>
                  <td className="py-3 pl-2 text-right whitespace-nowrap">
                    <button onClick={() => router.push(`/admin/deals/${d.id}/edit`)} className="text-blue-600 hover:text-blue-800 font-semibold mr-3">bearbeiten</button>
                    <button onClick={() => del(d.id, d.title)} className="text-red-500 hover:text-red-700">löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
