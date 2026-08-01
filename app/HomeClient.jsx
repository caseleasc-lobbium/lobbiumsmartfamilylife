"use client";

import { useEffect, useState } from "react";
import SectionHero from "../components/SectionHero";
import { useI18n } from "../components/i18n/LanguageProvider";

export default function HomeClient() {
  const { t } = useI18n();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");

  const categories = [
    { key: "all" },
    { key: "finanzen-spartipps" },
    { key: "familienleben" },
    { key: "kinder-bildung" },
    { key: "lifestyle" },
  ];

  // DB-Slug → Übersetzungs-Key
  const catLabel = (key) => {
    if (key === "all") return t("home", "filterAll");
    const map = {
      "finanzen-spartipps": "finanzen",
      familienleben: "familie",
      "kinder-bildung": "bildung",
      lifestyle: "lifestyle",
    };
    return t("nav", map[key] || key);
  };

  const loadPartners = async (cat) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/affiliates?category=${cat}&limit=40`);
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : []);
    } catch {
      setPartners([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartners(category);
  }, [category]);

  const handleClick = async (p) => {
    window.open(`/api/affiliates/${p.id}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center w-full">

      <SectionHero
        title={t("home", "title")}
        subtitle={t("home", "subtitle")}
      />

      {/* FILTER */}
      <nav className="flex flex-wrap justify-center gap-3 mb-14 px-4">
        {categories.map((cat) => {
          const isActive = cat.key === category;
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {catLabel(cat.key)}
            </button>
          );
        })}
      </nav>

      {/* HEADER */}
      <section className="w-full max-w-4xl text-center mb-10 px-4">
        <h2 className="text-2xl font-semibold text-[#0F1C3F]">
          {t("home", "partnerTitle")}
        </h2>
        <p className="text-gray-600">
          {t("home", "partnerSubtitle")}
        </p>
      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-20">
        {loading &&
          [...Array(12)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))}

        {!loading && partners.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            {t("home", "empty")}
          </p>
        )}

        {!loading &&
          partners.map((p) => (
            <button
              key={p.id}
              onClick={() => handleClick(p)}
              className="p-6 bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all flex flex-col items-center text-center"
            >
              <img
                src={
                  p.image_url
                    ? p.image_url.startsWith("http")
                      ? p.image_url
                      : `/${p.image_url}`
                    : "/partner-placeholder.svg"
                }
                alt={p.title}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  if (!e.currentTarget.dataset.f) {
                    e.currentTarget.dataset.f = "1";
                    e.currentTarget.src = "/partner-placeholder.svg";
                  }
                }}
                className="w-32 h-32 rounded-xl object-contain shadow mb-3 bg-white"
              />

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