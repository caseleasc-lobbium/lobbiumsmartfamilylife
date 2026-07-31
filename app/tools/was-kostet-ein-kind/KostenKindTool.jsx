"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { useI18n } from "../../../components/i18n/LanguageProvider";

const BANDS = [
  { from: 0, to: 5, monthly: 590 },
  { from: 6, to: 11, monthly: 680 },
  { from: 12, to: 17, monthly: 790 },
];

const STR = {
  de: {
    title: "Was kostet ein Kind?",
    subtitle: "Eine ehrliche Schätzung bis zum 18. Geburtstag – auf Basis von Durchschnittswerten. Pro Monat, Jahr und gesamt.",
    ageLabel: "Aktuelles Alter des Kindes", yrs: "J.", kidsLabel: "Anzahl Kinder", standard: "Lebensstandard",
    levels: ["Sparsam", "Mittel", "Großzügig"],
    resultTitle: "Geschätzte Gesamtkosten bis 18 Jahre", perYear: "pro Jahr", perMonth: "pro Monat",
    note: "Grobe Schätzung auf Basis von Durchschnittswerten (Ernährung, Kleidung, Wohnen, Betreuung, Freizeit). Deine tatsächlichen Kosten können deutlich abweichen. Kindergeld und staatliche Leistungen sind nicht gegengerechnet.",
    link1t: "Budget planen →", link1d: "Mit dem 50-30-20-Rechner den Alltag im Griff behalten.",
    link2t: "Spartipps für Familien →", link2d: "Clever sparen, ohne auf Lebensqualität zu verzichten.",
    back: "← Alle Familien-Tools", locale: "de-DE",
  },
  en: {
    title: "What does a child cost?",
    subtitle: "An honest estimate until the 18th birthday – based on average values. Per month, year and total.",
    ageLabel: "Child's current age", yrs: "yrs", kidsLabel: "Number of children", standard: "Lifestyle",
    levels: ["Thrifty", "Medium", "Generous"],
    resultTitle: "Estimated total costs until age 18", perYear: "per year", perMonth: "per month",
    note: "Rough estimate based on average values (food, clothing, housing, childcare, leisure). Your actual costs may differ significantly. Child benefit and state support are not deducted.",
    link1t: "Plan a budget →", link1d: "Stay in control of daily life with the 50-30-20 calculator.",
    link2t: "Saving tips for families →", link2d: "Save smartly without giving up quality of life.",
    back: "← All family tools", locale: "en-US",
  },
  fr: {
    title: "Combien coûte un enfant ?",
    subtitle: "Une estimation honnête jusqu'aux 18 ans – basée sur des valeurs moyennes. Par mois, par an et au total.",
    ageLabel: "Âge actuel de l'enfant", yrs: "ans", kidsLabel: "Nombre d'enfants", standard: "Niveau de vie",
    levels: ["Économe", "Moyen", "Généreux"],
    resultTitle: "Coût total estimé jusqu'à 18 ans", perYear: "par an", perMonth: "par mois",
    note: "Estimation approximative basée sur des valeurs moyennes (alimentation, vêtements, logement, garde, loisirs). Vos coûts réels peuvent nettement varier. Les allocations et aides de l'État ne sont pas déduites.",
    link1t: "Planifier un budget →", link1d: "Gardez le contrôle avec le calculateur 50-30-20.",
    link2t: "Astuces d'économie famille →", link2d: "Économiser malin sans sacrifier la qualité de vie.",
    back: "← Tous les outils famille", locale: "fr-FR",
  },
};

const FACTORS = [0.75, 1.0, 1.35];

export default function KostenKindTool() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [startAge, setStartAge] = useState(0);
  const [levelIdx, setLevelIdx] = useState(1);
  const [kids, setKids] = useState(1);
  const eur = (n) => Math.round(n).toLocaleString(s.locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const result = useMemo(() => {
    const factor = FACTORS[levelIdx];
    let total = 0;
    for (let age = Number(startAge); age <= 17; age++) {
      const band = BANDS.find((b) => age >= b.from && age <= b.to) || BANDS[BANDS.length - 1];
      total += band.monthly * factor * 12;
    }
    const years = Math.max(1, 18 - Number(startAge));
    const perYear = total / years;
    return { total: total * Number(kids), perYear: perYear * Number(kids), perMonth: (perYear / 12) * Number(kids) };
  }, [startAge, levelIdx, kids]);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">{s.ageLabel}</label>
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="17" value={startAge} onChange={(e) => setStartAge(e.target.value)} className="flex-1 accent-blue-600" />
                <span className="w-16 text-right font-semibold tabular-nums">{startAge} {s.yrs}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">{s.kidsLabel}</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="5" value={kids} onChange={(e) => setKids(e.target.value)} className="flex-1 accent-blue-600" />
                <span className="w-14 text-right font-semibold tabular-nums">{kids}</span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <span className="block text-sm font-semibold text-[#0F1C3F] mb-2">{s.standard}</span>
            <div className="flex gap-2">
              {s.levels.map((label, i) => (
                <button key={i} onClick={() => setLevelIdx(i)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${levelIdx === i ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-[#0F1C3F] text-white p-6 text-center">
            <p className="text-sm text-blue-200">{s.resultTitle}</p>
            <p className="mt-1 text-4xl font-extrabold tabular-nums">{eur(result.total)}</p>
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div><p className="text-blue-200">{s.perYear}</p><p className="font-bold tabular-nums">{eur(result.perYear)}</p></div>
              <div><p className="text-blue-200">{s.perMonth}</p><p className="font-bold tabular-nums">{eur(result.perMonth)}</p></div>
            </div>
          </div>
          <p className="mt-5 text-xs text-gray-400">{s.note}</p>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/tools/familienbudget" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">{s.link1t}</span>
            <p className="mt-1 text-sm text-gray-600">{s.link1d}</p>
          </Link>
          <Link href="/blog/spartipps-fuer-familien-2026" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
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
