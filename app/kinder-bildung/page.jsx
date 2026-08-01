"use client";

import { useEffect, useState } from "react";
import SectionHero from "../../components/SectionHero";
import Link from "next/link";
import { useI18n } from "../../components/i18n/LanguageProvider";

export default function KinderBildungClient() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/affiliates?category=kinder-bildung&limit=12");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Kinder API Fehler:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title={t("bildung", "title")}
        subtitle={t("bildung", "subtitle")}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
        gap-6 w-full max-w-6xl px-6 pb-20">

        {/* Loading Placeholder */}
        {loading &&
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))}

        {/* Keine Partner */}
        {!loading && items.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            {t("common", "empty")}
          </p>
        )}

        {/* Cards */}
        {!loading &&
          items.map((item) => (
            <Link
              key={item.id}
              href={`/api/affiliates/${item.id}`} // 🔥 NEUE SICHERE CLICK-ROUTE
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all flex flex-col text-center"
            >
              {item.image_url ? (
                <img
                  src={
                    item.image_url.startsWith("http")
                      ? item.image_url
                      : `/${item.image_url}`
                  }
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { if (!e.currentTarget.dataset.f) { e.currentTarget.dataset.f = "1"; e.currentTarget.src = "/partner-placeholder.svg"; } }}
                  className="w-full h-40 rounded-2xl object-contain bg-white p-4 mb-4"
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