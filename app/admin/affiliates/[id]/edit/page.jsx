"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAffiliatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

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

  // Affiliate Daten laden
  useEffect(() => {
    const loadAffiliate = async () => {
      try {
        const res = await fetch(`/api/affiliates?id=${id}`);
        const data = await res.json();

        if (!data || data.error) {
          setError("Partner nicht gefunden.");
          return;
        }

        setForm({
          title: data.title || "",
          category: data.category || "",
          imageUrl: data.imageUrl || "",
          link: data.link || "",
          description: data.description || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Fehler beim Laden.");
      }
    };

    loadAffiliate();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(`/api/affiliates/${id}`, {
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
      return;
    }

    router.push("/admin/affiliates");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Lädt Partnerdaten...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 shadow-xl rounded-3xl">
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            required
          />
        </div>

        {/* Kategorie dynamisch */}
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold w-full"
        >
          {saving ? "Speichere..." : "Änderungen speichern"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/admin/affiliates")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Zurück zur Übersicht
        </button>
      </div>
    </div>
  );
}