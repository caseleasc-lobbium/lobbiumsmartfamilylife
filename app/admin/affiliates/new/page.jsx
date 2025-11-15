"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAffiliatePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    image_url: "",
    affiliate_url: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
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

    // Erfolgreich → zurück zur Übersicht
    router.push("/admin/affiliates");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 shadow-xl rounded-3xl">
      <h1 className="text-2xl font-bold mb-6">➕ Neuer Affiliate Partner</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="space-y-5">

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
            <option value="finanzen">Finanzen & Spartipps</option>
            <option value="familie">Familienleben</option>
            <option value="bildung">Kinder & Bildung</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>

        {/* Bild URL */}
        <div>
          <label className="block mb-1 font-semibold">Bild URL</label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="https://..."
          />
        </div>

        {/* Affiliate-Link */}
        <div>
          <label className="block mb-1 font-semibold">Affiliate-Link *</label>
          <input
            type="text"
            name="affiliate_url"
            value={form.affiliate_url}
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            rows="3"
          ></textarea>
        </div>

        {/* Speichern */}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
        >
          {saving ? "Speichere..." : "Partner hinzufügen"}
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