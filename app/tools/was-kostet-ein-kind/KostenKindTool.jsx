"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";

const eur = (n) =>
  Math.round(n).toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// Monatliche Durchschnittskosten nach Altersband (Orientierung, Level "mittel")
const BANDS = [
  { from: 0, to: 5, monthly: 590 },
  { from: 6, to: 11, monthly: 680 },
  { from: 12, to: 17, monthly: 790 },
];
const LEVELS = {
  sparsam: { label: "Sparsam", factor: 0.75 },
  mittel: { label: "Mittel", factor: 1.0 },
  grosszuegig: { label: "Großzügig", factor: 1.35 },
};

export default function KostenKindTool() {
  const [startAge, setStartAge] = useState(0);
  const [level, setLevel] = useState("mittel");
  const [kids, setKids] = useState(1);

  const result = useMemo(() => {
    const factor = LEVELS[level].factor;
    let total = 0;
    for (let age = Number(startAge); age <= 17; age++) {
      const band = BANDS.find((b) => age >= b.from && age <= b.to) || BANDS[BANDS.length - 1];
      total += band.monthly * factor * 12;
    }
    const years = Math.max(1, 18 - Number(startAge));
    const perYear = total / years;
    const perMonth = perYear / 12;
    return {
      total: total * Number(kids),
      perYear: perYear * Number(kids),
      perMonth: perMonth * Number(kids),
      years,
    };
  }, [startAge, level, kids]);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Was kostet ein Kind?"
        subtitle="Eine ehrliche Schätzung bis zum 18. Geburtstag – auf Basis von Durchschnittswerten. Pro Monat, Jahr und gesamt."
      />

      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">
                Aktuelles Alter des Kindes
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min="0" max="17" value={startAge}
                  onChange={(e) => setStartAge(e.target.value)}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-14 text-right font-semibold tabular-nums">{startAge} J.</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">Anzahl Kinder</label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min="1" max="5" value={kids}
                  onChange={(e) => setKids(e.target.value)}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-14 text-right font-semibold tabular-nums">{kids}</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="block text-sm font-semibold text-[#0F1C3F] mb-2">Lebensstandard</span>
            <div className="flex gap-2">
              {Object.entries(LEVELS).map(([key, l]) => (
                <button
                  key={key}
                  onClick={() => setLevel(key)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    level === key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#0F1C3F] text-white p-6 text-center">
            <p className="text-sm text-blue-200">Geschätzte Gesamtkosten bis 18 Jahre</p>
            <p className="mt-1 text-4xl font-extrabold tabular-nums">{eur(result.total)}</p>
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div>
                <p className="text-blue-200">pro Jahr</p>
                <p className="font-bold tabular-nums">{eur(result.perYear)}</p>
              </div>
              <div>
                <p className="text-blue-200">pro Monat</p>
                <p className="font-bold tabular-nums">{eur(result.perMonth)}</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Grobe Schätzung auf Basis von Durchschnittswerten (Ernährung, Kleidung, Wohnen, Betreuung,
            Freizeit). Deine tatsächlichen Kosten können deutlich abweichen. Kindergeld und staatliche
            Leistungen sind nicht gegengerechnet.
          </p>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/tools/familienbudget" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">Budget planen →</span>
            <p className="mt-1 text-sm text-gray-600">Mit dem 50-30-20-Rechner den Alltag im Griff behalten.</p>
          </Link>
          <Link href="/blog/spartipps-fuer-familien-2026" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">Spartipps für Familien →</span>
            <p className="mt-1 text-sm text-gray-600">Clever sparen, ohne auf Lebensqualität zu verzichten.</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">← Alle Familien-Tools</Link>
        </div>
      </section>
    </div>
  );
}
