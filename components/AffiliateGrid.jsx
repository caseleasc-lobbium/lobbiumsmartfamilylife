"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Zufällige Reihenfolge erzeugen (einfaches Shuffle)
 */
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function AffiliateGrid({ category = "all", limit = 9 }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        // 🔗 Hole Affiliate-Daten von der API
        const res = await fetch("/api/affiliates", { cache: "no-store" });
        if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);

        const data = await res.json();

        // 🧩 Filtere nach Kategorie (wenn angegeben)
        let filtered =
          category === "all"
            ? data
            : data.filter(
                (a) =>
                  a.category &&
                  a.category.toLowerCase().trim() === category.toLowerCase().trim()
              );

        // 🔄 Shuffle stabil pro Tag (Seed = Datum)
        const seed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const stableShuffle = [...filtered].sort(
          (a, b) => (a.id * seed.length) % 7 - (b.id * seed.length) % 7
        );

        // 📦 Begrenze auf gewünschte Anzahl
        const limited = shuffleArray(stableShuffle).slice(0, limit);

        setAffiliates(limited);
      } catch (error) {
        console.error("❌ AffiliateGrid Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, [category, limit]);

  // 🌀 Ladeanzeige
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500 animate-pulse">Lade Partner...</p>
      </div>
    );

  // 🧩 Kein Ergebnis
  if (!affiliates.length)
    return (
      <div className="text-center text-gray-500 py-10">
        Noch keine Partner in dieser Kategorie verfügbar.
      </div>
    );

  // ✅ Ausgabe des Partner-Grids
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
      {affiliates.map((affiliate, index) => (
        <div
          key={affiliate.id || index}
          className="group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-300"
        >
          {/* 🔹 Bildbereich */}
          <div className="relative w-full h-52 overflow-hidden rounded-t-xl bg-gray-100">
            {affiliate.imageUrl && affiliate.imageUrl.trim() !== "" ? (
              <Image
                src={
                  affiliate.imageUrl.startsWith("http") ||
                  affiliate.imageUrl.startsWith("/")
                    ? affiliate.imageUrl
                    : "/images/default-partner.jpg"
                }
                alt={affiliate.title || "Affiliate Partner"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Kein Bild verfügbar
              </div>
            )}
          </div>

          {/* 🔸 Textinhalt */}
          <div className="p-5 text-center">
            <h3 className="text-lg font-semibold text-[#1c3d6c] mb-2">
              {affiliate.title || "Partner"}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {affiliate.description || "Top Angebot für Familien & Lifestyle."}
            </p>

            {affiliate.link && (
              <Link
                href={affiliate.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Jetzt ansehen →
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}