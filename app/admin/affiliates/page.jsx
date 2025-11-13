"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AffiliatesAdminPage() {
  const router = useRouter();

  // -----------------------------
  // 🔐 Login- & Session-Schutz
  // -----------------------------
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const now = Date.now();
    if (!loginTime || now - parseInt(loginTime) > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // -----------------------------
  // 📦 Daten & Formular
  // -----------------------------
  const [affiliates, setAffiliates] = useState([]);
  const [newAffiliate, setNewAffiliate] = useState({
    title: "",
    category: "",
    imageUrl: "",
    link: "",
    description: "",
  });

  // 🟦 Daten laden
  const loadAffiliates = async () => {
    try {
      const res = await fetch("/api/affiliates", { cache: "no-store" });
      const data = await res.json();
      setAffiliates(data || []);
    } catch {
      setAffiliates([]);
    }
  };

  useEffect(() => {
    loadAffiliates();
  }, []);

  // -----------------------------
  // 💾 Speichern
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/affiliates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "lobbiumAdminAuth:true",
      },
      body: JSON.stringify(newAffiliate),
    });

    if (res.ok) {
      alert("Affiliate gespeichert ✅");
      setNewAffiliate({
        title: "",
        category: "",
        imageUrl: "",
        link: "",
        description: "",
      });
      loadAffiliates();
    } else {
      alert("❌ Fehler beim Speichern");
    }
  };

  // -----------------------------
  // ❌ Löschen
  // -----------------------------
  const handleDelete = async (id) => {
    if (!confirm("Diesen Partner löschen?")) return;

    const res = await fetch(`/api/affiliates/${id}`, {
      method: "DELETE",
      headers: { authorization: "lobbiumAdminAuth:true" },
    });

    if (res.ok) {
      alert("Gelöscht");
      loadAffiliates();
    } else {
      alert("❌ Fehler beim Löschen");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Admin...</p>
      </div>
    );
  }

  // -----------------------------
  // 🎨 UI
  // -----------------------------
  return (
    <div className="p-8">

      <h1 className="text-2xl font-semibold mb-6">
        🔗 Affiliate Verwaltung
      </h1>

      {/* Formular */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-200"
      >
        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Titel"
            className="border rounded-xl p-2"
            value={newAffiliate.title}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Kategorie (finanzen, familie, lifestyle...)"
            className="border rounded-xl p-2"
            value={newAffiliate.category}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, category: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Bild URL"
            className="border rounded-xl p-2 col-span-2"
            value={newAffiliate.imageUrl}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, imageUrl: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Affiliate Link"
            className="border rounded-xl p-2 col-span-2"
            value={newAffiliate.link}
            onChange={(e) =>
              setNewAffiliate({ ...newAffiliate, link: e.target.value })
            }
          />
        </div>

        <textarea
          placeholder="Beschreibung"
          rows={3}
          className="border rounded-xl p-2 w-full mt-4"
          value={newAffiliate.description}
          onChange={(e) =>
            setNewAffiliate({ ...newAffiliate, description: e.target.value })
          }
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
        >
          Speichern
        </button>
      </form>

      {/* Liste */}
      <h2 className="text-xl font-semibold mb-3">Aktive Partner</h2>

      <div className="space-y-3">
        {affiliates.map((a) => (
          <div
            key={a.id}
            className="p-4 border rounded-xl bg-gray-50 flex justify-between items-center shadow-sm"
          >
            <div>
              <strong>{a.title}</strong> –{" "}
              {a.category || <em className="text-gray-400">keine Kategorie</em>}
            </div>

            <button
              onClick={() => handleDelete(a.id)}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Löschen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}