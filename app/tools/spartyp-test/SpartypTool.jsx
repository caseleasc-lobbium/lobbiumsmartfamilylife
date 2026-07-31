"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";

const QUESTIONS = [
  {
    q: "Wie gehst du mit deinem Monatsbudget um?",
    options: [
      { t: "planer", label: "Ich plane jeden Posten im Voraus" },
      { t: "fuchs", label: "Ich achte überall auf den günstigsten Preis" },
      { t: "geniesser", label: "Ich gebe gern aus, gönne mir was" },
      { t: "spontan", label: "Mal so, mal so – eher aus dem Bauch" },
    ],
  },
  {
    q: "Ein größerer Wunsch steht an. Du …",
    options: [
      { t: "planer", label: "legst gezielt monatlich dafür zurück" },
      { t: "fuchs", label: "wartest auf ein Angebot oder gebraucht" },
      { t: "geniesser", label: "kaufst es, wenn es dich glücklich macht" },
      { t: "spontan", label: "entscheidest spontan im Laden" },
    ],
  },
  {
    q: "Wie stehst du zu Rücklagen / Notgroschen?",
    options: [
      { t: "planer", label: "Fester Dauerauftrag – läuft automatisch" },
      { t: "fuchs", label: "Was ich spare, wandert direkt zur Seite" },
      { t: "geniesser", label: "Vorhanden, aber nicht mein Fokus" },
      { t: "spontan", label: "Klappt mal, mal nicht" },
    ],
  },
  {
    q: "Beim Einkaufen für die Familie …",
    options: [
      { t: "planer", label: "gehe ich mit Liste & Wochenplan" },
      { t: "fuchs", label: "vergleiche ich Preise & nutze Aktionen" },
      { t: "geniesser", label: "greife ich auch mal zu Qualität/Marke" },
      { t: "spontan", label: "kaufe ich, was mir gerade einfällt" },
    ],
  },
  {
    q: "Was würde dir beim Sparen am meisten helfen?",
    options: [
      { t: "planer", label: "Ein klares System / Budget-Tool" },
      { t: "fuchs", label: "Die besten Deals & Vergleiche" },
      { t: "geniesser", label: "Sparen, ohne mich einzuschränken" },
      { t: "spontan", label: "Automatik, die für mich spart" },
    ],
  },
];

const TYPES = {
  planer: {
    emoji: "📊", title: "Der Planer",
    text: "Du liebst Struktur – und genau das ist deine Stärke. Mit einem klaren Budget holst du das Maximum heraus.",
    tips: ["Nutze die 50-30-20-Methode als festen Rahmen", "Richte getrennte Konten/Töpfe ein", "Automatisiere deine Sparrate"],
    cta: { href: "/tools/familienbudget", label: "Zum Budget-Rechner" },
  },
  fuchs: {
    emoji: "🦊", title: "Der Sparfuchs",
    text: "Kein Deal entgeht dir. Mit etwas Fokus wird aus vielen kleinen Ersparnissen richtig Geld.",
    tips: ["Setze auf Second-Hand bei Kinder-Sachen", "Vergleiche vor jedem größeren Kauf", "Sammle Ersparnisse gezielt an einem Ort"],
    cta: { href: "/blog/second-hand-fuer-familien", label: "Second-Hand-Spartipps" },
  },
  geniesser: {
    emoji: "🌿", title: "Der Genießer",
    text: "Lebensqualität ist dir wichtig – zu Recht. Mit einem sanften System sparst du, ohne zu verzichten.",
    tips: ["Spare zuerst automatisch, gib den Rest frei aus", "Setze dir ein Wunsch-Sparziel", "Plane Genuss bewusst ins Budget ein"],
    cta: { href: "/blog/haushaltsbudget-50-30-20-methode", label: "Budget ohne Verzicht" },
  },
  spontan: {
    emoji: "⚡", title: "Der Spontane",
    text: "Du entscheidest aus dem Bauch – das ist okay. Automatik nimmt dir das Sparen einfach ab.",
    tips: ["Richte einen Dauerauftrag direkt nach Gehaltseingang ein", "Baue zuerst einen Notgroschen auf", "Nutze feste Spar-Automatik statt Willenskraft"],
    cta: { href: "/blog/notgroschen-aufbauen-familie", label: "Notgroschen aufbauen" },
  },
};

export default function SpartypTool() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ planer: 0, fuchs: 0, geniesser: 0, spontan: 0 });

  const pick = (t) => {
    const next = { ...scores, [t]: scores[t] + 1 };
    setScores(next);
    setStep((s) => s + 1);
  };
  const reset = () => {
    setScores({ planer: 0, fuchs: 0, geniesser: 0, spontan: 0 });
    setStep(0);
  };

  const done = step >= QUESTIONS.length;
  const winner = done
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    : null;
  const type = winner ? TYPES[winner] : null;

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Welcher Spar-Typ bist du?"
        subtitle="5 kurze Fragen – und du weißt, wie du und deine Familie am besten spart. Mit Tipps, die wirklich passen."
      />

      <section className="w-full max-w-2xl px-6 pb-24">
        {!done && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span>Frage {step + 1} von {QUESTIONS.length}</span>
              <div className="h-1.5 w-32 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#0F1C3F] mb-5">{QUESTIONS[step].q}</h2>
            <div className="space-y-3">
              {QUESTIONS[step].options.map((o, i) => (
                <button
                  key={i}
                  onClick={() => pick(o.t)}
                  className="w-full text-left rounded-2xl border border-gray-200 px-5 py-4 font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && type && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow p-8 text-center">
            <div className="text-5xl mb-2">{type.emoji}</div>
            <p className="text-sm text-blue-600 font-semibold">Dein Spar-Typ</p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#0F1C3F]">{type.title}</h2>
            <p className="mt-3 text-gray-600">{type.text}</p>

            <div className="mt-6 text-left rounded-2xl bg-blue-50 border border-blue-100 p-5">
              <p className="font-semibold text-[#0F1C3F] mb-2">Deine 3 Tipps:</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {type.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
              </ul>
            </div>

            <Link href={type.cta.href} className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
              {type.cta.label} →
            </Link>
            <div className="mt-4">
              <button onClick={reset} className="text-sm text-gray-500 hover:text-blue-600">Test wiederholen</button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">← Alle Familien-Tools</Link>
        </div>
      </section>
    </div>
  );
}
