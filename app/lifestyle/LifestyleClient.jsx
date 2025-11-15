"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// 👉 Navigation import HIER (ganz oben)
import CategoryNav from "../components/CategoryNav";

export default function LifestyleClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Daten laden (Kategorie = lifestyle)
  const loadData = async () => {
    try {
      const res = await fetch("/api/affiliates?category=lifestyle&limit=9");
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error("❌ Fehler beim Laden von Lifestyle:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        🔄 Inhalte werden geladen…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10">

      {/* 👉 Kategorie Navigation HIER einfügen */}
      <CategoryNav />

      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">
        ✨ Lifestyle
      </h1>

      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Täglich neue Empfehlungen aus Mode, Reisen, Beauty, Gesundheit, 
        Fitness, Ernährung, Smarthome, Trends und modernen Tools im Alltag.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {items.map((item) => (
          <Link
            key={item.id}
            href={`/api/affiliates/click?partnerId=${item.id}&targetUrl=${encodeURIComponent(item.link)}`}
            className="block bg-white border border-gray-200 rounded-3xl shadow
                       hover:shadow-xl transition p-5"
          >
            {/* Bild */}
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 rounded-2xl object-cover mb-4"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-2xl mb-4" />
            )}

            {/* Titel */}
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              {item.title}
            </h2>

            {/* Beschreibung */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {item.description || "Keine Beschreibung verfügbar."}
            </p>
          </Link>
        ))}

      </div>
    </div>
  );
}