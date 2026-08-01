"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { useI18n } from "../../../components/i18n/LanguageProvider";

// Offizielle Quellen (Familienportal des Bundes)
const LINK = {
  kindergeld: "https://www.familienportal.de/familienportal/familienleistungen/kindergeld",
  elterngeld: "https://www.familienportal.de/familienportal/familienleistungen/elterngeld",
  kinderzuschlag: "https://www.familienportal.de/familienportal/familienleistungen/kinderzuschlag",
  wohngeld: "https://www.familienportal.de/familienportal/familienleistungen/wohngeld",
  but: "https://www.familienportal.de/familienportal/familienleistungen/bildung-und-teilhabe",
  unterhalt: "https://www.familienportal.de/familienportal/familienleistungen/unterhaltsvorschuss",
  mutterschaft: "https://www.familienportal.de/familienportal/familienleistungen/mutterschaftsleistungen",
};

// Anspruchslogik je Leistung (s = Antwort-State)
const RULES = {
  kindergeld: (s) => s.kids === "yes" || s.kids === "expecting",
  elterngeld: (s) => (s.kids === "expecting" || s.baby) && s.reduceWork,
  mutterschaft: (s) => s.kids === "expecting" && s.employed,
  kinderzuschlag: (s) => s.kids === "yes" && s.income === "low" && s.employed,
  wohngeld: (s) => (s.income === "low" || s.income === "mid"),
  but: (s) => s.kids === "yes" && s.income === "low",
  unterhalt: (s) => s.kids === "yes" && s.single,
};

const STR = {
  de: {
    title: "Kindergeld & Familienleistungen-Checker",
    subtitle: "Welche Leistungen könnten deiner Familie zustehen? Beantworte 5 kurze Fragen – in unter einer Minute.",
    qKids: "Hast du Kinder oder erwartest du eins?",
    kidsOpts: [["yes", "Ja, ich habe Kinder"], ["expecting", "Ich erwarte ein Kind"], ["no", "Nein"]],
    qBaby: "Ist ein Kind unter 1 Jahr alt?",
    qSingle: "Bist du alleinerziehend?",
    qEmployed: "Bist oder warst du erwerbstätig?",
    qReduce: "Reduzierst du wegen eines Babys gerade deine Arbeitszeit?",
    qIncome: "Wie ist euer Haushaltseinkommen ungefähr?",
    incomeOpts: [["low", "Eher niedrig"], ["mid", "Mittel"], ["high", "Höher"]],
    yes: "Ja", no: "Nein",
    resultTitle: "Das könnte für deine Familie infrage kommen",
    none: "Für die gemachten Angaben ist keine der geprüften Leistungen typischerweise vorgesehen. Kindergeld gibt es aber grundsätzlich für alle Kinder – prüfe das im Zweifel trotzdem.",
    noKids: "Dieser Checker ist für Familien mit Kindern (oder Schwangerschaft) gedacht.",
    amount: "Richtwert", official: "Zum offiziellen Antrag →", back: "← Alle Familien-Tools",
    disclaimer: "Wichtig: unverbindliche Orientierung, keine Rechts- oder Sozialberatung. Beträge sind gerundete Richtwerte (Stand 2025/2026) und können sich ändern. Ob und wie viel dir zusteht, entscheidet die zuständige Stelle. Nutze die Links zur offiziellen Prüfung & Antragstellung.",
    ben: {
      kindergeld: { n: "Kindergeld", a: "ca. 255 €/Monat pro Kind", d: "Monatliche Zahlung für jedes Kind – unabhängig vom Einkommen.", note: "Antrag bei der Familienkasse." },
      elterngeld: { n: "Elterngeld", a: "ca. 300 – 1.800 €/Monat", d: "Ersetzt einen Teil des wegfallenden Einkommens nach der Geburt (bis 12–14 Monate).", note: "Antrag bei der Elterngeldstelle." },
      mutterschaft: { n: "Mutterschaftsgeld", a: "individuell", d: "Leistung rund um die Geburt während der Schutzfristen.", note: "Über Krankenkasse/Arbeitgeber." },
      kinderzuschlag: { n: "Kinderzuschlag", a: "bis ca. 297 €/Monat pro Kind", d: "Zusätzlich zum Kindergeld für Familien mit kleinem Einkommen.", note: "Antrag bei der Familienkasse." },
      wohngeld: { n: "Wohngeld", a: "je nach Miete & Einkommen", d: "Zuschuss zu den Wohnkosten für Haushalte mit niedrigem/mittlerem Einkommen.", note: "Antrag bei der Wohngeldstelle." },
      but: { n: "Bildung & Teilhabe", a: "Sachleistungen", d: "Schulbedarf, Mittagessen, Ausflüge, Vereins-/Musikbeitrag für Kinder.", note: "Über Jobcenter/Kommune." },
      unterhalt: { n: "Unterhaltsvorschuss", a: "ca. 230 – 355 €/Monat", d: "Wenn der andere Elternteil keinen/zu wenig Unterhalt zahlt (Alleinerziehende).", note: "Antrag beim Jugendamt." },
    },
    order: ["kindergeld", "elterngeld", "mutterschaft", "kinderzuschlag", "wohngeld", "but", "unterhalt"],
  },
  en: {
    title: "German Family Benefits Checker",
    subtitle: "Which German family benefits might your family be entitled to? Answer 5 short questions – in under a minute.",
    qKids: "Do you have children or are you expecting one?",
    kidsOpts: [["yes", "Yes, I have children"], ["expecting", "I'm expecting a child"], ["no", "No"]],
    qBaby: "Is a child under 1 year old?",
    qSingle: "Are you a single parent?",
    qEmployed: "Are or were you employed?",
    qReduce: "Are you currently reducing your working hours because of a baby?",
    qIncome: "Roughly, what is your household income?",
    incomeOpts: [["low", "Rather low"], ["mid", "Medium"], ["high", "Higher"]],
    yes: "Yes", no: "No",
    resultTitle: "These might apply to your family",
    none: "For your answers, none of the checked benefits typically apply. But child benefit (Kindergeld) exists for every child – check that anyway if in doubt.",
    noKids: "This checker is for families with children (or pregnancy).",
    amount: "Guide value", official: "To the official application →", back: "← All family tools",
    disclaimer: "Important: non-binding orientation, not legal or social advice. Amounts are rounded guide values (as of 2025/2026) and may change. Whether and how much you receive is decided by the responsible authority. Use the links for official checking & application.",
    ben: {
      kindergeld: { n: "Kindergeld (child benefit)", a: "approx. €255/month per child", d: "Monthly payment for each child – regardless of income.", note: "Apply at the Familienkasse." },
      elterngeld: { n: "Elterngeld (parental allowance)", a: "approx. €300–1,800/month", d: "Replaces part of lost income after birth (up to 12–14 months).", note: "Apply at the Elterngeldstelle." },
      mutterschaft: { n: "Mutterschaftsgeld (maternity)", a: "individual", d: "Benefit around birth during the protection periods.", note: "Via health insurer/employer." },
      kinderzuschlag: { n: "Kinderzuschlag (child supplement)", a: "up to approx. €297/month per child", d: "In addition to Kindergeld for families with a low income.", note: "Apply at the Familienkasse." },
      wohngeld: { n: "Wohngeld (housing benefit)", a: "depends on rent & income", d: "Subsidy for housing costs for low/medium-income households.", note: "Apply at the Wohngeldstelle." },
      but: { n: "Education & Participation", a: "benefits in kind", d: "School supplies, lunch, trips, club/music fees for children.", note: "Via Jobcenter/municipality." },
      unterhalt: { n: "Unterhaltsvorschuss (advance)", a: "approx. €230–355/month", d: "If the other parent pays no/too little child support (single parents).", note: "Apply at the Jugendamt." },
    },
    order: ["kindergeld", "elterngeld", "mutterschaft", "kinderzuschlag", "wohngeld", "but", "unterhalt"],
  },
  fr: {
    title: "Aides familiales allemandes – vérificateur",
    subtitle: "À quelles aides familiales allemandes votre famille pourrait-elle avoir droit ? 5 questions courtes – en moins d'une minute.",
    qKids: "Avez-vous des enfants ou en attendez-vous un ?",
    kidsOpts: [["yes", "Oui, j'ai des enfants"], ["expecting", "J'attends un enfant"], ["no", "Non"]],
    qBaby: "Un enfant a-t-il moins d'1 an ?",
    qSingle: "Êtes-vous parent isolé ?",
    qEmployed: "Êtes-vous ou étiez-vous salarié(e) ?",
    qReduce: "Réduisez-vous actuellement votre temps de travail pour un bébé ?",
    qIncome: "Quel est à peu près le revenu de votre foyer ?",
    incomeOpts: [["low", "Plutôt faible"], ["mid", "Moyen"], ["high", "Plus élevé"]],
    yes: "Oui", no: "Non",
    resultTitle: "Ceci pourrait concerner votre famille",
    none: "Pour vos réponses, aucune des aides vérifiées ne s'applique en général. Mais les allocations familiales (Kindergeld) existent pour chaque enfant – vérifiez-le en cas de doute.",
    noKids: "Ce vérificateur s'adresse aux familles avec enfants (ou grossesse).",
    amount: "Valeur indicative", official: "Vers la demande officielle →", back: "← Tous les outils famille",
    disclaimer: "Important : orientation sans engagement, pas un conseil juridique ou social. Les montants sont des valeurs indicatives arrondies (2025/2026) et peuvent changer. C'est l'administration compétente qui décide. Utilisez les liens pour la vérification et la demande officielles.",
    ben: {
      kindergeld: { n: "Kindergeld (allocations)", a: "env. 255 €/mois par enfant", d: "Versement mensuel pour chaque enfant – indépendant du revenu.", note: "Demande auprès de la Familienkasse." },
      elterngeld: { n: "Elterngeld (congé parental)", a: "env. 300 à 1 800 €/mois", d: "Remplace une partie du revenu perdu après la naissance (jusqu'à 12–14 mois).", note: "Demande à l'Elterngeldstelle." },
      mutterschaft: { n: "Mutterschaftsgeld (maternité)", a: "individuel", d: "Prestation autour de la naissance pendant les périodes de protection.", note: "Via caisse d'assurance/employeur." },
      kinderzuschlag: { n: "Kinderzuschlag (supplément)", a: "jusqu'à env. 297 €/mois par enfant", d: "En plus du Kindergeld pour les familles à faible revenu.", note: "Demande auprès de la Familienkasse." },
      wohngeld: { n: "Wohngeld (aide au logement)", a: "selon loyer & revenu", d: "Aide aux coûts de logement pour les foyers à revenu faible/moyen.", note: "Demande à la Wohngeldstelle." },
      but: { n: "Éducation & Participation", a: "prestations en nature", d: "Fournitures, cantine, sorties, cotisations club/musique pour enfants.", note: "Via Jobcenter/commune." },
      unterhalt: { n: "Unterhaltsvorschuss (avance)", a: "env. 230 à 355 €/mois", d: "Si l'autre parent ne paie pas/trop peu de pension (parents isolés).", note: "Demande au Jugendamt." },
    },
    order: ["kindergeld", "elterngeld", "mutterschaft", "kinderzuschlag", "wohngeld", "but", "unterhalt"],
  },
};

function Toggle({ label, value, onChange, s }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-2 shrink-0">
        {[[true, s.yes], [false, s.no]].map(([v, lbl]) => (
          <button key={String(v)} onClick={() => onChange(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${value === v ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KindergeldTool() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [st, setSt] = useState({ kids: "yes", baby: false, single: false, employed: true, reduceWork: false, income: "mid" });
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v }));

  const eligible = useMemo(() => {
    if (st.kids === "no") return null;
    return s.order.filter((id) => RULES[id](st));
  }, [st, s.order]);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="w-full max-w-2xl px-6 pb-24">
        {/* Fragen */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow p-7 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#0F1C3F] mb-2">{s.qKids}</p>
            <div className="flex flex-wrap gap-2">
              {s.kidsOpts.map(([v, lbl]) => (
                <button key={v} onClick={() => set("kids", v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${st.kids === v ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {st.kids !== "no" && (
            <div className="divide-y divide-gray-100">
              {st.kids === "yes" && <Toggle label={s.qBaby} value={st.baby} onChange={(v) => set("baby", v)} s={s} />}
              <Toggle label={s.qSingle} value={st.single} onChange={(v) => set("single", v)} s={s} />
              <Toggle label={s.qEmployed} value={st.employed} onChange={(v) => set("employed", v)} s={s} />
              {(st.baby || st.kids === "expecting") && <Toggle label={s.qReduce} value={st.reduceWork} onChange={(v) => set("reduceWork", v)} s={s} />}
              <div className="pt-3">
                <p className="text-sm font-semibold text-[#0F1C3F] mb-2">{s.qIncome}</p>
                <div className="flex gap-2">
                  {s.incomeOpts.map(([v, lbl]) => (
                    <button key={v} onClick={() => set("income", v)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold transition ${st.income === v ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ergebnis */}
        <div className="mt-6">
          {eligible === null ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-500">{s.noKids}</div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#0F1C3F] mb-3">{s.resultTitle}</h2>
              {eligible.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-sm text-gray-600">{s.none}</div>
              )}
              <div className="space-y-3">
                {eligible.map((id) => {
                  const b = s.ben[id];
                  return (
                    <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <h3 className="font-bold text-[#0F1C3F]">{b.n}</h3>
                        <span className="text-sm font-semibold text-emerald-600 whitespace-nowrap">{s.amount}: {b.a}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{b.d}</p>
                      <p className="mt-1 text-xs text-gray-400">{b.note}</p>
                      <a href={LINK[id]} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800">
                        {s.official}
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-400">{s.disclaimer}</p>

        {/* Querverweise */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Link href="/tools/was-kostet-ein-kind" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">🍼 Was kostet ein Kind? →</span>
          </Link>
          <Link href="/tools/familienbudget" className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
            <span className="text-blue-600 text-sm font-semibold">💰 Familienbudget-Rechner →</span>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">{s.back}</Link>
        </div>
      </section>
    </div>
  );
}
