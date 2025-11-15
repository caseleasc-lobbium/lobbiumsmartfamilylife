"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAffiliatePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    image_url: "",
    affiliate_url: "",
    description: "",
  });

  // Daten laden
  useEffect(() => {
    const loadAffiliate = async () => {
      const res = await fetch(`/api/affiliates?id=${id}`);
      const data = await res.json();

      if (!data || data.error) {
        setError("Partner nicht gefunden");
        setLoading(false);
        return;
      }

      setForm({
        title: data.title || "",
        category: data.category || "",
        image_url: data.image_url || "",
        affiliate_url: data.affiliate_url || "",
        description: data.description || "",
      });

      setLoading(false);
    };

    loadAffiliate();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Speichern
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/affiliates?id=${id}`, {
      method: "PUT",
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
    } else {
      router.push("/admin/affiliates");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">Lade Daten...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-10 rounded-3xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">✏️ Partner bearbeiten</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSave} className="space-y-5">

        {/* Titel */}
        <div>
          <label className="block mb-1 font-semibold">Titel *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />
        </div>

        {/* Kategorie */}
        <div>
          <label className="block mb-1 font-semibold">Kategorie *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
          >
            <option value="">Kategorie wählen</option>
            <option value="finanzen">Finanzen & Spartipps</option>
            <option value="familie">Familienleben</option>
            <option value="bildung">Kinder & Bildung</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>

        {/* Bild-URL */}
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
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
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
          ></textarea>
        </div>

        {/* Speichern */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          {saving ? "Speichert..." : "Änderungen speichern"}
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