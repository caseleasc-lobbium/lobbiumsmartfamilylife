"use client";

import { useState, useEffect } from "react";

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState([]);
  const [newAffiliate, setNewAffiliate] = useState({
    title: "",
    category: "",
    imageUrl: "",
    link: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Daten laden
  const loadAffiliates = async () => {
    const res = await fetch("/api/affiliates");
    const data = await res.json();
    setAffiliates(data);
  };

  useEffect(() => {
    loadAffiliates();
  }, []);

  // ✅ Partner speichern
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/affiliates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "lobbiumAdminAuth:true",
      },
      body: JSON.stringify(newAffiliate),
    });
    setLoading(false);

    if (res.ok) {
      const saved = await res.json();
      setAffiliates((prev) => [...prev, saved]);
      setNewAffiliate({
        title: "",
        category: "",
        imageUrl: "",
        link: "",
        description: "",
      });
      alert("Partner erfolgreich gespeichert ✅");
    } else {
      alert("❌ Fehler beim Speichern");
    }
  };

  // ✅ Partner löschen
  const handleDelete = async (id) => {
    if (!confirm("Willst du diesen Partner wirklich löschen?")) return;
    const res = await fetch(`/api/affiliates/${id}`, {
      method: "DELETE",
      headers: { authorization: "Bearer lobbium_secure_key_2025_V6.1" },
    });

    if (res.ok) {
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert("❌ Fehler beim Löschen");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800 flex items-center gap-2">
        🔗 Affiliate Verwaltung
      </h1>

      {/* FORMULAR */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto border border-gray-100 relative overflow-hidden"
      >
        {/* zarter Verlauf am Rand */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white opacity-60 pointer-events-none rounded-2xl"></div>

        <div className="relative grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Titel"
            value={newAffiliate.title}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, title: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Kategorie"
            value={newAffiliate.category}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, category: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Bild URL"
            value={newAffiliate.imageUrl}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, imageUrl: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Partner-Link"
            value={newAffiliate.link}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, link: e.target.value })
            }
            className="border border-gray-300 rounded-xl p-3 col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <textarea
          placeholder="Beschreibung"
          value={newAffiliate.description}
          onChange={(e) =>
            setNewAffiliate({ ...newAffiliate, description: e.target.value })
          }
          className="border border-gray-300 rounded-xl p-3 w-full mt-4 focus:ring-2 focus:ring-blue-500 outline-none"
          rows="3"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Speichert..." : "Speichern"}
        </button>
      </form>

      {/* Visuelle Trennung */}
      <div className="my-10 border-t border-gray-200 w-full max-w-3xl mx-auto"></div>

      {/* LISTE */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Aktive Partner</h2>
      {affiliates.length === 0 ? (
        <p className="text-gray-500 italic">Keine Partner gespeichert.</p>
      ) : (
        <ul className="space-y-3 w-full max-w-3xl mx-auto">
          {affiliates.map((a) => (
            <li
              key={a.id}
              className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-all shadow-sm hover:shadow-md"
            >
              <div>
                <strong className="text-gray-800">{a.title}</strong>{" "}
                <span className="text-gray-500">– {a.category}</span>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-600 hover:text-red-800 font-semibold transition-all"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}