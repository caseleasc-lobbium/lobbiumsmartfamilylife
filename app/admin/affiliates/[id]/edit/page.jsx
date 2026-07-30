"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditAffiliatePage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");

  // 🔄 Laden des Partners (aus der Listen-API, da /api/affiliates/[id] eine
  // Klick-Redirect-Route ist und kein JSON liefert)
  const loadAffiliate = async () => {
    try {
      const res = await fetch(`/api/affiliates?category=all`);
      const list = await res.json();
      const data = Array.isArray(list)
        ? list.find((a) => String(a.id) === String(id))
        : null;

      if (!data) {
        alert("Partner nicht gefunden");
        router.push("/admin/affiliates");
        return;
      }

      setAffiliate(data);

      setTitle(data.title || "");
      setCategory((data.category || "").trim());
      setImageUrl(data.image_url || "");
      setLink(data.affiliate_url || "");
      setDescription(data.description || "");
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAffiliate();
  }, []);

  // 💾 Speichern (PUT Request)
  const handleSave = async () => {
    const res = await fetch(`/api/affiliates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "lobbiumAdminAuth:true",
      },
      body: JSON.stringify({
        title,
        category,
        imageUrl,
        link,
        description,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Fehler: " + data.error);
      return;
    }

    alert("Änderungen gespeichert!");
    router.push("/admin/affiliates");
  };

  if (loading || !affiliate) {
    return <div className="p-10 text-center text-gray-500">Lade Daten...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">
        ✏️ Partner bearbeiten – ID #{id}
      </h1>

      {/* Titel */}
      <div className="mb-4">
        <label className="font-semibold">Titel</label>
        <input
          type="text"
          className="w-full border p-3 rounded-xl mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Kategorie */}
      <div className="mb-4">
        <label className="font-semibold">Kategorie</label>
        <select
          className="w-full border p-3 rounded-xl mt-1"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Kategorie wählen</option>
          <option value="finanzen-spartipps">Finanzen & Spartipps</option>
          <option value="familienleben">Familienleben</option>
          <option value="kinder-bildung">Kinder & Bildung</option>
          <option value="lifestyle">Lifestyle</option>
        </select>
      </div>

      {/* Bild */}
      <div className="mb-4">
        <label className="font-semibold">Bild-URL</label>
        <input
          type="text"
          className="w-full border p-3 rounded-xl mt-1"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageUrl && (
          <img
            src={imageUrl}
            className="w-32 h-32 mt-3 rounded-xl object-cover shadow"
          />
        )}
      </div>

      {/* Link */}
      <div className="mb-4">
        <label className="font-semibold">Affiliate Link</label>
        <input
          type="text"
          className="w-full border p-3 rounded-xl mt-1"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {/* Beschreibung */}
      <div className="mb-6">
        <label className="font-semibold">Beschreibung</label>
        <textarea
          className="w-full border p-3 rounded-xl mt-1 h-28"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          💾 Speichern
        </button>

        <button
          onClick={() => router.push("/admin/affiliates")}
          className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}