"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewAffiliatePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    imageUrl: "",
    link: "",
    description: "",
  });

  // Kategorien laden
  useEffect(() => {
    fetch("/api/affiliates/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d || []));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/affiliates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "lobbiumAdminAuth:true",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    router.push("/admin/affiliates");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
      <h1 className="text-2xl font-bold mb-6">➕ Neuer Partner</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Titel */}
        <div>
          <label className="block mb-1 font-semibold">Titel *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            required
          />
        </div>

        {/* Kategorie */}
        <div>
          <label className="block mb-1 font-semibold">Kategorie *</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
            required
          >
            <option value="">Kategorie wählen</option>

            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bild URL */}
        <div>
          <label className="block mb-1 font-semibold">Bild URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block mb-1 font-semibold">Partner-Link *</label>
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            required
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block mb-1 font-semibold">Beschreibung</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white w-full px-6 py-3 rounded-xl font-semibold"
        >
          {saving ? "Speichere..." : "Partner speichern"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/admin/affiliates")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Zurück
        </button>
      </div>
    </div>
  );
}