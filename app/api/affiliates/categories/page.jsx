"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const res = await fetch("/api/affiliates/categories");
    const data = await res.json();
    setCategories(data || []);
  };

  const createCategory = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/affiliates/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    setName("");
    load();
  };

  const removeCategory = async (id) => {
    if (!confirm("Kategorie löschen?")) return;

    await fetch(`/api/affiliates/categories?id=${id}`, {
      method: "DELETE"
    });

    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-lg">

      <h1 className="text-2xl font-bold mb-6">📂 Affiliate Kategorien</h1>

      {/* Neue Kategorie */}
      <form onSubmit={createCategory} className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Kategorie hinzufügen..."
          className="flex-1 border px-4 py-2 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl">
          Hinzufügen
        </button>
      </form>

      {/* Liste */}
      <table className="min-w-full border border-gray-200 rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3">Aktion</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-gray-500">{c.slug}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => removeCategory(c.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}