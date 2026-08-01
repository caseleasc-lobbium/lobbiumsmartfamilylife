"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { useI18n } from "../../../components/i18n/LanguageProvider";
import NewsletterSignup from "../../../components/NewsletterSignup";

const TYPE_KEYS = ["planer", "fuchs", "geniesser", "spontan"];
const CTA_HREF = {
  planer: "/tools/familienbudget",
  fuchs: "/blog/second-hand-fuer-familien",
  geniesser: "/blog/haushaltsbudget-50-30-20-methode",
  spontan: "/blog/notgroschen-aufbauen-familie",
};
const EMOJI = { planer: "📊", fuchs: "🦊", geniesser: "🌿", spontan: "⚡" };

const STR = {
  de: {
    title: "Welcher Spar-Typ bist du?",
    subtitle: "5 kurze Fragen – und du weißt, wie du und deine Familie am besten spart. Mit Tipps, die wirklich passen.",
    q: "Frage", of: "von", yourType: "Dein Spar-Typ", tips: "Deine 3 Tipps:", again: "Test wiederholen", back: "← Alle Familien-Tools",
    questions: [
      { q: "Wie gehst du mit deinem Monatsbudget um?", o: ["Ich plane jeden Posten im Voraus", "Ich achte überall auf den günstigsten Preis", "Ich gebe gern aus, gönne mir was", "Mal so, mal so – eher aus dem Bauch"] },
      { q: "Ein größerer Wunsch steht an. Du …", o: ["legst gezielt monatlich dafür zurück", "wartest auf ein Angebot oder gebraucht", "kaufst es, wenn es dich glücklich macht", "entscheidest spontan im Laden"] },
      { q: "Wie stehst du zu Rücklagen / Notgroschen?", o: ["Fester Dauerauftrag – läuft automatisch", "Was ich spare, wandert direkt zur Seite", "Vorhanden, aber nicht mein Fokus", "Klappt mal, mal nicht"] },
      { q: "Beim Einkaufen für die Familie …", o: ["gehe ich mit Liste & Wochenplan", "vergleiche ich Preise & nutze Aktionen", "greife ich auch mal zu Qualität/Marke", "kaufe ich, was mir gerade einfällt"] },
      { q: "Was würde dir beim Sparen am meisten helfen?", o: ["Ein klares System / Budget-Tool", "Die besten Deals & Vergleiche", "Sparen, ohne mich einzuschränken", "Automatik, die für mich spart"] },
    ],
    types: {
      planer: { title: "Der Planer", text: "Du liebst Struktur – und genau das ist deine Stärke. Mit einem klaren Budget holst du das Maximum heraus.", tips: ["Nutze die 50-30-20-Methode als festen Rahmen", "Richte getrennte Konten/Töpfe ein", "Automatisiere deine Sparrate"], cta: "Zum Budget-Rechner" },
      fuchs: { title: "Der Sparfuchs", text: "Kein Deal entgeht dir. Mit etwas Fokus wird aus vielen kleinen Ersparnissen richtig Geld.", tips: ["Setze auf Second-Hand bei Kinder-Sachen", "Vergleiche vor jedem größeren Kauf", "Sammle Ersparnisse gezielt an einem Ort"], cta: "Second-Hand-Spartipps" },
      geniesser: { title: "Der Genießer", text: "Lebensqualität ist dir wichtig – zu Recht. Mit einem sanften System sparst du, ohne zu verzichten.", tips: ["Spare zuerst automatisch, gib den Rest frei aus", "Setze dir ein Wunsch-Sparziel", "Plane Genuss bewusst ins Budget ein"], cta: "Budget ohne Verzicht" },
      spontan: { title: "Der Spontane", text: "Du entscheidest aus dem Bauch – das ist okay. Automatik nimmt dir das Sparen einfach ab.", tips: ["Richte einen Dauerauftrag direkt nach Gehaltseingang ein", "Baue zuerst einen Notgroschen auf", "Nutze feste Spar-Automatik statt Willenskraft"], cta: "Notgroschen aufbauen" },
    },
  },
  en: {
    title: "What's your saver type?",
    subtitle: "5 short questions – and you'll know how you and your family save best. With tips that really fit.",
    q: "Question", of: "of", yourType: "Your saver type", tips: "Your 3 tips:", again: "Retake the test", back: "← All family tools",
    questions: [
      { q: "How do you handle your monthly budget?", o: ["I plan every item in advance", "I look for the cheapest price everywhere", "I like to spend and treat myself", "It varies – more by gut feeling"] },
      { q: "A bigger wish comes up. You …", o: ["set money aside for it monthly", "wait for an offer or buy used", "buy it if it makes you happy", "decide spontaneously in the shop"] },
      { q: "How do you feel about reserves / an emergency fund?", o: ["Fixed standing order – runs automatically", "What I save goes straight aside", "It exists, but not my focus", "Sometimes it works, sometimes not"] },
      { q: "When shopping for the family …", o: ["I go with a list & weekly plan", "I compare prices & use deals", "I sometimes go for quality/brands", "I buy whatever comes to mind"] },
      { q: "What would help you most with saving?", o: ["A clear system / budget tool", "The best deals & comparisons", "Saving without restricting myself", "Automation that saves for me"] },
    ],
    types: {
      planer: { title: "The Planner", text: "You love structure – and that's exactly your strength. With a clear budget you get the most out of it.", tips: ["Use the 50-30-20 method as a fixed frame", "Set up separate accounts/pots", "Automate your savings rate"], cta: "To the budget calculator" },
      fuchs: { title: "The Bargain Hunter", text: "No deal escapes you. With a little focus, many small savings become real money.", tips: ["Go second-hand for kids' items", "Compare before every bigger purchase", "Collect savings in one dedicated place"], cta: "Second-hand saving tips" },
      geniesser: { title: "The Enjoyer", text: "Quality of life matters to you – rightly so. With a gentle system you save without going without.", tips: ["Save automatically first, then spend the rest freely", "Set yourself a wish savings goal", "Plan enjoyment consciously into the budget"], cta: "Budget without going without" },
      spontan: { title: "The Spontaneous", text: "You decide by gut feeling – that's fine. Automation simply takes the saving off your hands.", tips: ["Set up a standing order right after payday", "Build an emergency fund first", "Use fixed saving automation instead of willpower"], cta: "Build an emergency fund" },
    },
  },
  fr: {
    title: "Quel épargnant êtes-vous ?",
    subtitle: "5 questions courtes – et vous saurez comment vous et votre famille épargnez le mieux. Avec des conseils adaptés.",
    q: "Question", of: "sur", yourType: "Votre profil d'épargnant", tips: "Vos 3 conseils :", again: "Refaire le test", back: "← Tous les outils famille",
    questions: [
      { q: "Comment gérez-vous votre budget mensuel ?", o: ["Je planifie chaque poste à l'avance", "Je cherche partout le prix le plus bas", "J'aime dépenser, me faire plaisir", "Ça dépend – plutôt à l'instinct"] },
      { q: "Une grosse envie se présente. Vous …", o: ["mettez de côté chaque mois pour ça", "attendez une promo ou l'occasion", "l'achetez si ça vous rend heureux", "décidez spontanément en magasin"] },
      { q: "Que pensez-vous des réserves / d'un fonds d'urgence ?", o: ["Virement permanent – automatique", "Ce que j'épargne part aussitôt de côté", "Ça existe, mais pas ma priorité", "Parfois oui, parfois non"] },
      { q: "Pour les courses de la famille …", o: ["j'y vais avec liste & plan de la semaine", "je compare les prix & profite des promos", "je choisis parfois la qualité/la marque", "j'achète ce qui me passe par la tête"] },
      { q: "Qu'est-ce qui vous aiderait le plus à épargner ?", o: ["Un système clair / un outil de budget", "Les meilleures offres & comparatifs", "Épargner sans me restreindre", "Une automatisation qui épargne pour moi"] },
    ],
    types: {
      planer: { title: "Le Planificateur", text: "Vous aimez la structure – et c'est justement votre force. Avec un budget clair, vous en tirez le maximum.", tips: ["Utilisez la méthode 50-30-20 comme cadre fixe", "Créez des comptes/enveloppes séparés", "Automatisez votre taux d'épargne"], cta: "Vers le calculateur de budget" },
      fuchs: { title: "Le Dénicheur", text: "Aucune bonne affaire ne vous échappe. Avec un peu de focus, de petites économies deviennent une vraie somme.", tips: ["Optez pour la seconde main pour les enfants", "Comparez avant chaque gros achat", "Regroupez vos économies au même endroit"], cta: "Astuces seconde main" },
      geniesser: { title: "L'Épicurien", text: "La qualité de vie compte pour vous – à juste titre. Avec un système en douceur, vous épargnez sans vous priver.", tips: ["Épargnez d'abord automatiquement, dépensez le reste librement", "Fixez-vous un objectif d'épargne plaisir", "Intégrez le plaisir consciemment au budget"], cta: "Un budget sans privation" },
      spontan: { title: "Le Spontané", text: "Vous décidez à l'instinct – c'est très bien. L'automatisation épargne à votre place.", tips: ["Mettez un virement permanent juste après la paie", "Constituez d'abord un fonds d'urgence", "Misez sur l'automatisation plutôt que la volonté"], cta: "Constituer un fonds d'urgence" },
    },
  },
};

export default function SpartypTool() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ planer: 0, fuchs: 0, geniesser: 0, spontan: 0 });

  const pick = (i) => {
    const key = TYPE_KEYS[i];
    setScores((p) => ({ ...p, [key]: p[key] + 1 }));
    setStep((x) => x + 1);
  };
  const reset = () => { setScores({ planer: 0, fuchs: 0, geniesser: 0, spontan: 0 }); setStep(0); };

  const done = step >= s.questions.length;
  const winner = done ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] : null;
  const type = winner ? s.types[winner] : null;

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="w-full max-w-2xl px-6 pb-24">
        {!done && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow p-7">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span>{s.q} {step + 1} {s.of} {s.questions.length}</span>
              <div className="h-1.5 w-32 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${(step / s.questions.length) * 100}%` }} />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#0F1C3F] mb-5">{s.questions[step].q}</h2>
            <div className="space-y-3">
              {s.questions[step].o.map((label, i) => (
                <button key={i} onClick={() => pick(i)}
                  className="w-full text-left rounded-2xl border border-gray-200 px-5 py-4 font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition">
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && type && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow p-8 text-center">
            <div className="text-5xl mb-2">{EMOJI[winner]}</div>
            <p className="text-sm text-blue-600 font-semibold">{s.yourType}</p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#0F1C3F]">{type.title}</h2>
            <p className="mt-3 text-gray-600">{type.text}</p>
            <div className="mt-6 text-left rounded-2xl bg-blue-50 border border-blue-100 p-5">
              <p className="font-semibold text-[#0F1C3F] mb-2">{s.tips}</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {type.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
              </ul>
            </div>
            <Link href={CTA_HREF[winner]} className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition">
              {type.cta} →
            </Link>
            <div className="mt-4">
              <button onClick={reset} className="text-sm text-gray-500 hover:text-blue-600">{s.again}</button>
            </div>
          </div>
        )}

        {done && (
          <div className="mt-6">
            <NewsletterSignup />
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600">{s.back}</Link>
        </div>
      </section>
    </div>
  );
}
