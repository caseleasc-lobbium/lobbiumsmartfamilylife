"use client";

import { useState } from "react";

// Wiederverwendbares Vergleichs-Widget: responsive Tabelle (Desktop) / Karten (Mobil),
// optional sortierbar über eine numerische Spalte (sortKey).
// data = { columns:[{key,label}], rows:[{name, badge?, highlight?, values:{key:text}, cta:{label,url}, score?}] }
export default function ComparisonWidget({ columns = [], rows = [], sortKey = null, ctaFallback = "Zum Anbieter →" }) {
  const [desc, setDesc] = useState(true);
  const sorted =
    sortKey && rows.every((r) => typeof r.score === "number")
      ? [...rows].sort((a, b) => (desc ? b.score - a.score : a.score - b.score))
      : rows;

  return (
    <div className="w-full">
      {sortKey && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setDesc((d) => !d)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Sortierung: {desc ? "beste zuerst ↓" : "unterste zuerst ↑"}
          </button>
        </div>
      )}

      {/* Desktop-Tabelle */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4 font-bold text-[#0F1C3F]">Option</th>
              {columns.map((c) => (
                <th key={c.key} className="py-3 px-4 font-semibold text-gray-600">{c.label}</th>
              ))}
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={i} className={`border-t border-gray-100 ${r.highlight ? "bg-blue-50/60" : ""}`}>
                <td className="py-3 px-4 align-top">
                  <div className="font-bold text-[#0F1C3F]">{r.name}</div>
                  {r.badge && (
                    <span className="inline-block mt-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{r.badge}</span>
                  )}
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="py-3 px-4 align-top text-gray-600">{r.values?.[c.key]}</td>
                ))}
                <td className="py-3 px-4 align-top whitespace-nowrap">
                  {r.cta?.url && (
                    <a href={r.cta.url} target="_blank" rel="noopener noreferrer sponsored"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                      {r.cta.label || ctaFallback}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobil-Karten */}
      <div className="md:hidden space-y-4">
        {sorted.map((r, i) => (
          <div key={i} className={`rounded-2xl border p-5 ${r.highlight ? "border-blue-200 bg-blue-50/60" : "border-gray-100 bg-white"} shadow-sm`}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-[#0F1C3F]">{r.name}</h3>
              {r.badge && <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{r.badge}</span>}
            </div>
            <dl className="mt-3 space-y-1.5">
              {columns.map((c) => (
                <div key={c.key} className="flex gap-2 text-sm">
                  <dt className="text-gray-400 w-32 shrink-0">{c.label}</dt>
                  <dd className="text-gray-700">{r.values?.[c.key]}</dd>
                </div>
              ))}
            </dl>
            {r.cta?.url && (
              <a href={r.cta.url} target="_blank" rel="noopener noreferrer sponsored"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
                {r.cta.label || ctaFallback}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
