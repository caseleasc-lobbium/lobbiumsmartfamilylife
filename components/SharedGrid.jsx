"use client";

import { useEffect, useState } from "react";

export default function SharedGrid({ category }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliates?category=${category}&limit=12`);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch {
      setPartners([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [category]);

  // API liefert Felder snake_case (image_url/affiliate_url); ältere Daten evtl. camelCase.
  const linkOf = (p) => p.affiliate_url || p.link || null;
  const imageOf = (p) => {
    const src = p.image_url || p.imageUrl;
    if (!src) return null;
    return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
  };

  const clickPartner = async (p) => {
    const target = linkOf(p);
    if (!target) return;
    try {
      await fetch("/api/affiliates/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId: p.id, targetUrl: target }),
      });
    } catch {}
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-6 pb-20">
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
            onClick={() => clickPartner(p)}
            className="p-6 bg-white rounded-3xl shadow hover:shadow-xl transition-all border border-gray-100 flex flex-col items-center text-center"
          >
            {imageOf(p) ? (
              <img
                src={imageOf(p)}
                alt={p.title || "Partner"}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-xl object-contain bg-white mb-3"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-xl mb-3" />
            )}

            <h3 className="mt-1 font-semibold text-lg text-gray-800">{p.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{p.description}</p>
          </button>
        ))}
    </section>
  );
}