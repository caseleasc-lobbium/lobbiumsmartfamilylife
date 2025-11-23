"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Zufällige Reihenfolge erzeugen
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function AffiliateGrid({ category = "all", limit = 9 }) {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        const res = await fetch(
          category === "all"
            ? `/api/affiliates?limit=${limit}`
            : `/api/affiliates?category=${category}&limit=${limit}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("API Fehler");

        const data = await res.json();
        setAffiliates(Array.isArray(data) ? shuffleArray(data) : []);
      } catch (error) {
        console.error("AffiliateGrid Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, [category, limit]);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500 animate-pulse">Lade Partner...</p>
      </div>
    );

  if (!affiliates.length)
    return (
      <div className="text-center text-gray-500 py-10">
        Noch keine Partner in dieser Kategorie verfügbar.
      </div>
    );

  // Bild-Resolver (manuelle Fallbacks)
  const resolveImage = (a) => {
    const t = a.title?.toLowerCase() || "";
    if (t.includes("auras")) return "/affiliates/AURAS.png";
    if (t.includes("ekta")) return "/affiliates/EKTA.png";

    if (a.image_url?.startsWith("http")) return a.image_url;
    if (a.image_url?.startsWith("/")) return a.image_url;

    return "/images/default-partner.jpg";
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
      {affiliates.map((a) => (
        <div
          key={a.id}
          className="group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 duration-300"
        >
          {/* IMAGE – perfekter Logo-Frame */}
          <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-t-xl p-6">
            <img
              src={resolveImage(a)}
              alt={a.title}
              className="
                max-h-20       /* maximale Höhe → immer gleich */
                max-w-[70%]    /* NIE breiter als Box */
                object-contain /* NIE verzerren */
                mx-auto
              "
            />
          </div>

          {/* TEXT */}
          <div className="p-5 text-center">
            <h3 className="text-lg font-semibold text-[#1c3d6c] mb-2">
              {a.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {a.description}
            </p>

            {/* Sicherheit: Click über ID */}
            <Link
              href={`/api/affiliates/${a.id}`}
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