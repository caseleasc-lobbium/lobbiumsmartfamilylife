"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";

const eur = (n) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export default function FamilienbudgetTool() {
  const [income, setIncome] = useState(3000);
  const val = Number(income) || 0;
  const buckets = [
    { key: "need", label: "Notwendiges", pct: 50, color: "bg-blue-600", hint: "Miete, Strom, Lebensmittel, Versicherungen, Mobilität" },
    { key: "want", label: "Wünsche", pct: 30, color: "bg-emerald-500", hint: "Freizeit, Hobbys, Restaurant, Streaming, Urlaub" },
    { key: "save", label: "Sparen & Schulden", pct: 20, color: "bg-amber-500", hint: "Rücklage, Notgroschen, Sparpläne, Tilgung" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Familienbudget-Rechner"
        subtitle="Die einfache 50-30-20-Methode: Gib dein monatliches Netto-Einkommen ein und sieh sofort, wie viel für was bleibt."
      />

      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">
            Monatliches Netto-Einkommen der Familie
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="500"
              max="10000"
              step="50"
              value={val}
              onChange={(e) => setIncome(e.target.value)}
              className="flex-1 accent-blue-600"
            />
            <div className="relative">
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-1 text-gray-500">€</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {buckets.map((b) => (
              <div key={b.key}>
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-[#0F1C3F]">
                    {b.label} <span className="text-gray-400 font-normal">· {b.pct}%</span>
                  </span>
                  <span className="text-lg font-bold text-[#0F1C3F] tabular-nums">
                    {eur((val * b.pct) / 100)}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{b.hint}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Richtwerte zur Orientierung. In teuren Regionen sind die Fixkosten oft höher – dann ist die
            Aufteilung ein Ziel, kein starres Gesetz.
          </p>
        </div>

        {/* Weiterführend (intern + Partner) */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link
            href="/blog/haushaltsbudget-50-30-20-methode"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5"
          >
            <span className="text-blue-600 text-sm font-semibold">Ratgeber lesen →</span>
            <p className="mt-1 text-sm text-gray-600">So funktioniert die 50-30-20-Methode im Detail.</p>
          </Link>
          <Link
            href="/blog/notgroschen-aufbauen-familie"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5"
          >
            <span className="text-blue-600 text-sm font-semibold">Notgroschen aufbauen →</span>
            <p className="mt-1 text-sm text-gray-600">Wie viel Rücklage deine Familie wirklich braucht.</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">
            ← Alle Familien-Tools
          </Link>
        </div>
      </section>
    </div>
  );
}
