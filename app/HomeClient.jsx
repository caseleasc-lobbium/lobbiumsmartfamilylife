"use client";

import { useEffect, useState } from "react";
import SectionHero from "../components/SectionHero";

export default function HomeClient() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Home lädt IMMER "all" → Vitrine
  const category = "all";

  // Partner laden
  const loadPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliates?category=${category}&limit=9`);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      setPartners([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartners();
  }, []);

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
    } catch {}
    window.open(partner.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-center w-full">

      {/* ------------------------------------------------------ */}
      {/* 🔵 HERO – Einheitlich, luxuriös, Apple-Style */}
      {/* ------------------------------------------------------ */}
      <SectionHero
        title="Smart Family Life by Lobbium"
        subtitle="Clever sparen, den Alltag organisieren und Kinder spielerisch fördern — kompakt, modern & täglich aktualisiert."
      />

      {/* ------------------------------------------------------ */}
      {/* PARTNER DES TAGES */}
      {/* ------------------------------------------------------ */}
      <section className="w-full max-w-4xl text-center mb-12 px-4">
        <h2 className="text-2xl font-semibold mb-2 text-[#0F1C3F]">
          🌟 Partner des Tages – Empfehlungen für dich
        </h2>
        <p className="text-gray-600">
          Jeden Tag neu ausgewählt — beliebte Marken, clevere Spartipps und familienfreundliche Inspirationen.
        </p>
      </section>

      {/* ------------------------------------------------------ */}
      {/* KACHELGRID */}
      {/* ------------------------------------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-20">

        {/* Loading */}
        {loading &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))}

        {!loading && partners.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Noch keine Partner verfügbar.
          </p>
        )}

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
                {p.description || "Empfehlungen für deinen Alltag und deine Familie."}
              </p>
            </button>
          ))}
      </section>
    </div>
  );
}