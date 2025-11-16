"use client";

import { useEffect, useState } from "react";

export default function HomeClient() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kategorie-Filter
  const [category, setCategory] = useState("all");

  // Navigation Rubriken
  const categories = [
    { key: "all", label: "Home" },
    { key: "finanzen", label: "Finanzen & Spartipps" },
    { key: "familie", label: "Familienleben" },
    { key: "bildung", label: "Kinder & Bildung" },
    { key: "lifestyle", label: "Lifestyle" },
  ];

  // Partner laden
  const loadPartners = async (cat) => {
    setLoading(true);
    try {
      const url = `/api/affiliates?category=${cat}&limit=9`;
      const res = await fetch(url);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setPartners([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartners(category);
  }, [category]);

  // Klick-Handler
  const handlePartnerClick = async (partner) => {
    try {
      await fetch("/api/affiliates/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId: partner.id,
          targetUrl: partner.link,
        }),
      });
    } catch (err) {
      console.warn("Click-Tracking Fehler:", err);
    }

    if (partner.link) {
      window.open(
        partner.link,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* ------------------------------------------------------ */}
      {/* HERO SECTION – APPLE STYLE */}
      {/* ------------------------------------------------------ */}
      <section className="w-full flex flex-col items-center text-center pt-20 pb-12 px-4">

        <h1 className="text-4xl md:text-5xl font-bold text-[#0F1C3F] tracking-tight">
          Smart Family Life by Lobbium
        </h1>

        <p className="text-gray-600 mt-5 text-lg max-w-2xl leading-relaxed">
          Clever sparen, den Alltag organisieren und Kinder spielerisch fördern — 
          kompakt, praxiserprobt und schön aufbereitet.
        </p>

        {/* Apple-Style Highlight Box */}
        <div className="
          mt-8 px-6 py-4 rounded-2xl
          bg-white/60 backdrop-blur-md
          border border-gray-200 shadow-sm
        ">
          <p className="text-gray-700 text-sm">
            🌟 Jeden Tag neue Empfehlungen – für Familien, Alltag & Sparen
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ */}
      {/* RUBRIKEN – Apple Style Clean Tabs */}
      {/* ------------------------------------------------------ */}
      <nav className="flex flex-wrap justify-center gap-3 mb-14 px-4">

        {categories.map((cat) => {
          const isActive = category === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`
                px-6 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}

      </nav>

      {/* ------------------------------------------------------ */}
      {/* PARTNER DES TAGES */}
      {/* ------------------------------------------------------ */}
      <section className="w-full max-w-4xl text-center mb-12 px-4">
        <h2 className="text-2xl font-semibold mb-2 text-[#0F1C3F]">
          🌟 Partner des Tages – Empfehlungen für dich
        </h2>
        <p className="text-gray-600">
          Jeden Tag neu ausgewählt — beliebte Marken, clevere Spartipps und
          familienfreundliche Inspirationen aus allen Rubriken.
        </p>
      </section>

      {/* ------------------------------------------------------ */}
      {/* KACHELN */}
      {/* ------------------------------------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-20">

        {/* Loading Skeleton */}
        {loading &&
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 animate-pulse rounded-3xl"
            />
          ))}

        {/* Keine Partner */}
        {!loading && partners.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Noch keine Partner verfügbar.
          </p>
        )}

        {/* Partnerkarten */}
        {!loading &&
          partners.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePartnerClick(p)}
              className="
                p-6 bg-white rounded-3xl border border-gray-100
                shadow hover:shadow-xl transition-all
                flex flex-col items-center text-center
              "
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  className="w-20 h-20 rounded-xl object-cover shadow mb-3"
                  alt={p.title}
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl mb-3" />
              )}

              <h3 className="mt-1 font-semibold text-lg text-gray-800">
                {p.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                {p.description ||
                  "Empfehlungen für deinen Alltag und deine Familie."}
              </p>
            </button>
          ))}
      </section>
    </div>
  );
}