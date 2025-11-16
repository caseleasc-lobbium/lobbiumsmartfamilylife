"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHero from "../../components/SectionHero";

export default function FamilienlebenClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Premium Tabs – global identisch
  const categories = [
    { key: "all", label: "Home", url: "/" },
    { key: "finanzen", label: "Finanzen & Spartipps", url: "/finanzen-spartipps" },
    { key: "familie", label: "Familienleben", url: "/familienleben" },
    { key: "bildung", label: "Kinder & Bildung", url: "/kinder-bildung" },
    { key: "lifestyle", label: "Lifestyle", url: "/lifestyle" },
  ];

  const loadData = async () => {
    try {
      const res = await fetch("/api/affiliates?category=familie&limit=12");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fehler beim Laden von Familienleben:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">

      {/* ------------------------------------------------------ */}
      {/* HERO – Einheitlich & luxuriös */}
      {/* ------------------------------------------------------ */}
      <SectionHero
        title="Familienleben"
        subtitle="Neue Inspirationen, Tools und Empfehlungen für ein modernes, glückliches und harmonisches Familienleben."
      />

      {/* ------------------------------------------------------ */}
      {/* NAVIGATION – Premium Tabs */}
      {/* ------------------------------------------------------ */}
      <nav className="flex flex-wrap justify-center gap-3 mb-14 px-4">
        {categories.map((cat) => {
          const isActive = cat.key === "familie";
          return (
            <Link
              key={cat.key}
              href={cat.url}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </nav>

      {/* ------------------------------------------------------ */}
      {/* GRID – Premium Apple-Style Cards */}
      {/* ------------------------------------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                          gap-6 w-full max-w-6xl px-6 pb-20">

        {/* Loading Skeleton */}
        {loading &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))}

        {/* Keine Ergebnisse */}
        {!loading && items.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Noch keine Empfehlungen verfügbar.
          </p>
        )}

        {/* Partner Karten */}
        {!loading &&
          items.map((item) => (
            <Link
              key={item.id}
              href={`/api/affiliates/click?partnerId=${item.id}&targetUrl=${encodeURIComponent(
                item.link
              )}`}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow
                         hover:shadow-xl transition-all flex flex-col text-center"
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
              <h2 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h2>

              {/* Beschreibung */}
              <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                {item.description || "Keine Beschreibung verfügbar."}
              </p>
            </Link>
          ))}
      </section>
    </div>
  );
}