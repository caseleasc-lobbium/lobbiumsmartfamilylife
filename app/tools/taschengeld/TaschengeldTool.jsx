"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";

// Orientierungswerte (siehe Ratgeber). Betrag + Rhythmus je Alter.
const TABLE = [
  { max: 5, amount: "0,50 – 1 €", cycle: "pro Woche" },
  { max: 7, amount: "1,50 – 2 €", cycle: "pro Woche" },
  { max: 9, amount: "2 – 3 €", cycle: "pro Woche" },
  { max: 11, amount: "14 – 18 €", cycle: "pro Monat" },
  { max: 13, amount: "20 – 25 €", cycle: "pro Monat" },
  { max: 15, amount: "25 – 35 €", cycle: "pro Monat" },
  { max: 17, amount: "35 – 60 €", cycle: "pro Monat" },
];

export default function TaschengeldTool() {
  const [age, setAge] = useState(8);
  const rec = useMemo(() => TABLE.find((r) => Number(age) <= r.max) || TABLE[TABLE.length - 1], [age]);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Taschengeld-Rechner"
        subtitle="Wie viel Taschengeld passt zum Alter deines Kindes? Wähle das Alter und erhalte sofort eine Orientierungs-Empfehlung."
      />

      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">Alter des Kindes</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min="4" max="17" value={age}
              onChange={(e) => setAge(e.target.value)}
              className="flex-1 accent-blue-600"
            />
            <span className="w-16 text-right font-semibold tabular-nums">{age} Jahre</span>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-6 text-center">
            <p className="text-sm text-blue-700">Empfehlung für {age}-Jährige</p>
            <p className="mt-1 text-4xl font-extrabold text-[#0F1C3F]">{rec.amount}</p>
            <p className="mt-1 text-blue-700 font-medium">{rec.cycle}</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            <li>✅ Regelmäßig &amp; verlässlich zahlen – am besten ein fester Tag.</li>
            <li>✅ Nicht an Noten oder Hausarbeit koppeln – Taschengeld ist kein Lohn.</li>
            <li>✅ Eigene Fehler zulassen – genau daraus lernen Kinder Einteilung.</li>
          </ul>

          <p className="mt-5 text-xs text-gray-400">
            Richtwerte zur Orientierung, keine feste Regel – jede Familie entscheidet nach eigenem Budget.
          </p>
        </div>

        <div className="mt-6">
          <Link href="/blog/taschengeld-tabelle-nach-alter" className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">Ganze Taschengeld-Tabelle &amp; Tipps →</span>
            <p className="mt-1 text-sm text-gray-600">Warum Regelmäßigkeit wichtiger ist als die Höhe.</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">← Alle Familien-Tools</Link>
        </div>
      </section>
    </div>
  );
}
