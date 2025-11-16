"use client";

import { useEffect, useState } from "react";
import SectionHero from "../../components/SectionHero";
import Link from "next/link";

export default function FinanzenSpartippsClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/affiliates?category=finanzen&limit=12");
      const data = await res.json();
      setItems(data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">

      <SectionHero
        title="Finanzen & Spartipps"
        subtitle="Täglich neue Wege Geld zu sparen, clever zu investieren und den Alltag günstiger zu gestalten."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-20">

        {loading &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))}

        {!loading && items.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Noch keine Partner verfügbar.
          </p>
        )}

        {!loading &&
          items.map((item) => (
            <Link
              key={item.id}
              href={`/api/affiliates/click?partnerId=${item.id}&targetUrl=${encodeURIComponent(item.link)}`}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all flex flex-col text-center"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 rounded-2xl object-cover mb-4"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-2xl mb-4" />
              )}

              <h2 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h2>

              <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                {item.description || "Keine Beschreibung verfügbar."}
              </p>
            </Link>
          ))}
      </section>
    </div>
  );
}