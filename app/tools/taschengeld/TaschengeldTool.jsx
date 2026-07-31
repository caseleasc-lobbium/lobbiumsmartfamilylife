"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { useI18n } from "../../../components/i18n/LanguageProvider";

// max-Alter + Betrag + Zyklus-Index (0 = Woche, 1 = Monat)
const TABLE = [
  { max: 5, amount: "0,50 – 1 €", cyc: 0 },
  { max: 7, amount: "1,50 – 2 €", cyc: 0 },
  { max: 9, amount: "2 – 3 €", cyc: 0 },
  { max: 11, amount: "14 – 18 €", cyc: 1 },
  { max: 13, amount: "20 – 25 €", cyc: 1 },
  { max: 15, amount: "25 – 35 €", cyc: 1 },
  { max: 17, amount: "35 – 60 €", cyc: 1 },
];

const STR = {
  de: {
    title: "Taschengeld-Rechner",
    subtitle: "Wie viel Taschengeld passt zum Alter deines Kindes? Wähle das Alter und erhalte sofort eine Orientierungs-Empfehlung.",
    ageLabel: "Alter des Kindes", years: "Jahre",
    recFor: (a) => `Empfehlung für ${a}-Jährige`, cycles: ["pro Woche", "pro Monat"],
    tips: ["✅ Regelmäßig & verlässlich zahlen – am besten ein fester Tag.", "✅ Nicht an Noten oder Hausarbeit koppeln – Taschengeld ist kein Lohn.", "✅ Eigene Fehler zulassen – genau daraus lernen Kinder Einteilung."],
    note: "Richtwerte zur Orientierung, keine feste Regel – jede Familie entscheidet nach eigenem Budget.",
    linkt: "Ganze Taschengeld-Tabelle & Tipps →", linkd: "Warum Regelmäßigkeit wichtiger ist als die Höhe.",
    back: "← Alle Familien-Tools", amount: (a) => a,
  },
  en: {
    title: "Pocket Money Calculator",
    subtitle: "How much pocket money suits your child's age? Pick the age and instantly get an orientation recommendation.",
    ageLabel: "Child's age", years: "years",
    recFor: (a) => `Recommendation for ${a}-year-olds`, cycles: ["per week", "per month"],
    tips: ["✅ Pay regularly and reliably – best on a fixed day.", "✅ Don't tie it to grades or chores – pocket money isn't wages.", "✅ Allow mistakes – that's exactly how children learn to budget."],
    note: "Guide values for orientation, not a fixed rule – every family decides by its own budget.",
    linkt: "Full pocket money chart & tips →", linkd: "Why regularity matters more than the amount.",
    back: "← All family tools", amount: (a) => a.replace("€", "€").replace(",", "."),
  },
  fr: {
    title: "Calculateur d'argent de poche",
    subtitle: "Quel montant convient à l'âge de votre enfant ? Choisissez l'âge et obtenez aussitôt une recommandation indicative.",
    ageLabel: "Âge de l'enfant", years: "ans",
    recFor: (a) => `Recommandation pour ${a} ans`, cycles: ["par semaine", "par mois"],
    tips: ["✅ Payer régulièrement et de façon fiable – de préférence un jour fixe.", "✅ Ne pas le lier aux notes ou aux tâches – ce n'est pas un salaire.", "✅ Autoriser les erreurs – c'est ainsi que l'enfant apprend à gérer."],
    note: "Valeurs indicatives, pas une règle fixe – chaque famille décide selon son budget.",
    linkt: "Tableau complet & conseils →", linkd: "Pourquoi la régularité compte plus que le montant.",
    back: "← Tous les outils famille", amount: (a) => a.replace(",", "."),
  },
};

export default function TaschengeldTool() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [age, setAge] = useState(8);
  const rec = useMemo(() => TABLE.find((r) => Number(age) <= r.max) || TABLE[TABLE.length - 1], [age]);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="w-full max-w-2xl px-6 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
          <label className="block text-sm font-semibold text-[#0F1C3F] mb-2">{s.ageLabel}</label>
          <div className="flex items-center gap-3">
            <input type="range" min="4" max="17" value={age} onChange={(e) => setAge(e.target.value)} className="flex-1 accent-blue-600" />
            <span className="w-16 text-right font-semibold tabular-nums">{age} {s.years}</span>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-100 p-6 text-center">
            <p className="text-sm text-blue-700">{s.recFor(age)}</p>
            <p className="mt-1 text-4xl font-extrabold text-[#0F1C3F]">{s.amount(rec.amount)}</p>
            <p className="mt-1 text-blue-700 font-medium">{s.cycles[rec.cyc]}</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-gray-600">
            {s.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <p className="mt-5 text-xs text-gray-400">{s.note}</p>
        </div>

        <div className="mt-6">
          <Link href="/blog/taschengeld-tabelle-nach-alter" className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">{s.linkt}</span>
            <p className="mt-1 text-sm text-gray-600">{s.linkd}</p>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">{s.back}</Link>
        </div>
      </section>
    </div>
  );
}
