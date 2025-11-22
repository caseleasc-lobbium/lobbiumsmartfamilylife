"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Einfaches Shuffle
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function AffiliateGrid({ category = "all", limit = 9 }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        const res = await fetch("/api/affiliates", { cache: "no-store" });
        if (!res.ok) throw new Error(`Fehler beim Laden: ${res.status}`);

        const data = await res.json();

        // Kategorie-Filter
        let filtered =
          category === "all"
            ? data
            : data.filter(
                (a) =>
                  a.category &&
                  a.category.toLowerCase().trim() === category.toLowerCase().trim()
              );

        // Stabiler Shuffle pro Tag
        const seed = new Date().toISOString().slice(0, 10);
        const stableShuffle = [...filtered].sort(
          (a, b) => (a.id * seed.length) % 7 - (b.id * seed.length) % 7
        );

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

  // Loading
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500 animate-pulse">Lade Partner...</p>
      </div>
    );

  // Keine Partner
  if (!affiliates.length)
    return (
      <div className="text-center text-gray-500 py-10">
        Noch keine Partner in dieser Kategorie verfügbar.
      </div>
    );

  // 🔽 KORREKTES Logo-Mapping
  const resolveImage = (affiliate) => {
    const title = affiliate.title?.toLowerCase() || "";

    if (title.includes("auras")) return "/affiliates/AURAS.png";
    if (title.includes("ekta")) return "/affiliates/EKTA.png";

    // Falls Supabase-Bild existiert
    if (affiliate.image_url?.startsWith("http")) return affiliate.image_url;

    // Fallback
    return "/images/default-partner.jpg";
  };

  // 🔽 Tracking-Link absolut korrekt
  const resolveTracking = (affiliate) => {
    if (!affiliate.affiliate_url) return "#";

    return `/api/affiliates/click?partnerId=${affiliate.id}&targetUrl=${encodeURIComponent(
      affiliate.affiliate_url
    )}`;
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
      {affiliates.map((affiliate) => (
        <div
          key={affiliate.id}
          className="group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-300"
        >
          {/* Bild */}
          <div className="relative w-full h-52 flex items-center justify-center overflow-hidden rounded-t-xl bg-gray-100">
            <Image
              src={resolveImage(affiliate)}
              alt={affiliate.title}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Inhalt */}
          <div className="p-5 text-center">
            <h3 className="text-lg font-semibold text-[#1c3d6c] mb-2">
              {affiliate.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {affiliate.description || ""}
            </p>

            <Link
              href={resolveTracking(affiliate)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              Jetzt ansehen →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}