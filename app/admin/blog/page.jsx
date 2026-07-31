"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CAT_LABEL = {
  "finanzen-spartipps": "💰 Finanzen",
  familienleben: "🌳 Familie",
  "kinder-bildung": "🎓 Kinder",
  lifestyle: "✨ Lifestyle",
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const d = await res.json();
      setPosts(Array.isArray(d) ? d : []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const del = async (id, title) => {
    if (!confirm(`Artikel „${title}" wirklich löschen?`)) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Löschen fehlgeschlagen.");
  };

  if (loading) return <div className="p-10 text-center text-gray-500">🔄 Lade Artikel…</div>;

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-white p-6 sm:p-8 rounded-3xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Blog / Ratgeber <span className="text-gray-400 text-lg">({posts.length})</span></h1>
        <button onClick={() => router.push("/admin/blog/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold">
          + Neuer Artikel
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Noch keine Artikel.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="py-2 pr-3">Titel</th>
                <th className="py-2 px-2">Rubrik</th>
                <th className="py-2 px-2">Sprache</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 pl-2 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-3 font-medium text-gray-800">{p.title}</td>
                  <td className="py-3 px-2 whitespace-nowrap">{CAT_LABEL[p.category] || p.category}</td>
                  <td className="py-3 px-2 uppercase text-gray-500">{p.locale}</td>
                  <td className="py-3 px-2">
                    {p.published
                      ? <span className="text-emerald-600 font-semibold">● Live</span>
                      : <span className="text-amber-600 font-semibold">○ Entwurf</span>}
                  </td>
                  <td className="py-3 pl-2 text-right whitespace-nowrap">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 mr-3">ansehen</a>
                    <button onClick={() => router.push(`/admin/blog/${p.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold mr-3">bearbeiten</button>
                    <button onClick={() => del(p.id, p.title)}
                      className="text-red-500 hover:text-red-700">löschen</button>
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
