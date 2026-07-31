"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { useI18n } from "../../../components/i18n/LanguageProvider";

const STR = {
  de: {
    title: "Familienbudget-Rechner",
    subtitle: "Die einfache 50-30-20-Methode: Gib dein monatliches Netto-Einkommen ein und sieh sofort, wie viel für was bleibt.",
    incomeLabel: "Monatliches Netto-Einkommen der Familie",
    buckets: [
      { label: "Notwendiges", hint: "Miete, Strom, Lebensmittel, Versicherungen, Mobilität" },
      { label: "Wünsche", hint: "Freizeit, Hobbys, Restaurant, Streaming, Urlaub" },
      { label: "Sparen & Schulden", hint: "Rücklage, Notgroschen, Sparpläne, Tilgung" },
    ],
    note: "Richtwerte zur Orientierung. In teuren Regionen sind die Fixkosten oft höher – dann ist die Aufteilung ein Ziel, kein starres Gesetz.",
    link1t: "Ratgeber lesen →", link1d: "So funktioniert die 50-30-20-Methode im Detail.",
    link2t: "Notgroschen aufbauen →", link2d: "Wie viel Rücklage deine Familie wirklich braucht.",
    back: "← Alle Familien-Tools", locale: "de-DE",
  },
  en: {
    title: "Family Budget Calculator",
    subtitle: "The simple 50-30-20 method: enter your monthly net income and instantly see how much is left for what.",
    incomeLabel: "Family's monthly net income",
    buckets: [
      { label: "Needs", hint: "Rent, energy, groceries, insurance, transport" },
      { label: "Wants", hint: "Leisure, hobbies, dining out, streaming, holidays" },
      { label: "Saving & debt", hint: "Reserve, emergency fund, savings plans, repayment" },
    ],
    note: "Guide values for orientation. In expensive regions fixed costs are often higher – then the split is a goal, not a rigid rule.",
    link1t: "Read the guide →", link1d: "How the 50-30-20 method works in detail.",
    link2t: "Build an emergency fund →", link2d: "How much reserve your family really needs.",
    back: "← All family tools", locale: "en-US",
  },
  fr: {
    title: "Calculateur de budget familial",
    subtitle: "La méthode simple 50-30-20 : saisissez votre revenu net mensuel et voyez aussitôt ce qui reste pour quoi.",
    incomeLabel: "Revenu net mensuel de la famille",
    buckets: [
      { label: "Besoins", hint: "Loyer, énergie, courses, assurances, transport" },
      { label: "Envies", hint: "Loisirs, hobbies, restaurant, streaming, vacances" },
      { label: "Épargne & dettes", hint: "Réserve, fonds d'urgence, plans d'épargne, remboursement" },
    ],
    note: "Valeurs indicatives. Dans les régions chères, les charges fixes sont souvent plus élevées – la répartition est alors un objectif, pas une règle rigide.",
    link1t: "Lire le guide →", link1d: "Le fonctionnement détaillé de la méthode 50-30-20.",
    link2t: "Constituer un fonds d'urgence →", link2d: "Quelle réserve votre famille a vraiment besoin.",
    back: "← Tous les outils famille", locale: "fr-FR",
  },
};

const PCT = [50, 30, 20];
const COLORS = ["bg-blue-600", "bg-emerald-500", "bg-amber-500"];

export default function FamilienbudgetTool() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [income, setIncome] = useState(3000);
  const val = Number(income) || 0;
  const eur = (n) => n.toLocaleString(s.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">{s.incomeLabel}</label>
          <div className="flex items-center gap-3">
            <input type="range" min="500" max="10000" step="50" value={val} onChange={(e) => setIncome(e.target.value)} className="flex-1 accent-blue-600" />
            <div className="relative">
              <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="ml-1 text-gray-500">€</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {s.buckets.map((b, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-[#0F1C3F]">{b.label} <span className="text-gray-400 font-normal">· {PCT[i]}%</span></span>
                  <span className="text-lg font-bold text-[#0F1C3F] tabular-nums">{eur((val * PCT[i]) / 100)}</span>
                </div>
                <div className="mt-1 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full ${COLORS[i]} rounded-full`} style={{ width: `${PCT[i]}%` }} />
                </div>
                <p className="mt-1 text-xs text-gray-500">{b.hint}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-400">{s.note}</p>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/blog/haushaltsbudget-50-30-20-methode" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">{s.link1t}</span>
            <p className="mt-1 text-sm text-gray-600">{s.link1d}</p>
          </Link>
          <Link href="/blog/notgroschen-aufbauen-familie" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">{s.link2t}</span>
            <p className="mt-1 text-sm text-gray-600">{s.link2d}</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">{s.back}</Link>
        </div>
      </section>
    </div>
  );
}
