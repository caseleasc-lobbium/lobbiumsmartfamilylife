"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAffiliatesPage() {
  const router = useRouter();
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Daten laden aus Supabase API
  const loadData = async () => {
    try {
      const res = await fetch("/api/affiliates");
      const data = await res.json();
      setAffiliates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fehler beim Laden:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🗑 Löschen neu über Supabase-API
  const handleDelete = async (id) => {
    if (!confirm("Willst du diesen Partner wirklich löschen?")) return;

    const res = await fetch(`/api/affiliates?id=${id}`, {
      method: "DELETE",
      headers: {
        authorization: "lobbiumAdminAuth:true",
      },
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Reload
    loadData();
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        🔄 Lade Partner…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-10 rounded-3xl shadow-lg">

      {/* Kopf */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🤝 Affiliate Partner</h1>

        <button
          onClick={() => router.push("/admin/affiliates/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          + Neuer Partner
        </button>
      </div>

      {/* Tabelle */}
      {affiliates.length === 0 ? (
        <p className="text-gray-500 text-center">Keine Partner vorhanden.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Titel</th>
              <th className="p-3 text-left">Kategorie</th>
              <th className="p-3 text-left">Bild</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-left">Aktion</th>
            </tr>
          </thead>

          <tbody>
            {affiliates.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{a.title}</td>

                <td className="p-3 capitalize">{a.category}</td>

                <td className="p-3">
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt="preview"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">Kein Bild</span>
                  )}
                </td>

                <td className="p-3">
                  <a
                    href={a.link}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    öffnen
                  </a>
                </td>

                <td className="p-3 flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/admin/affiliates/${a.id}/edit`)
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Bearbeiten
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Löschen
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}