import Link from "next/link";
import { cookies } from "next/headers";
import SectionHero from "../../components/SectionHero";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Familien-Tools & Rechner",
  description:
    "Kostenlose Rechner & Helfer für Familien: Familienbudget, Was kostet ein Kind, Taschengeld und der Spartyp-Test – schnell, verständlich und ehrlich.",
  path: "/tools",
});

const STR = {
  de: {
    title: "Familien-Tools & Rechner",
    subtitle: "Kostenlose Helfer für den Familienalltag – schnell, verständlich und ehrlich. Kein Login, keine Daten-Weitergabe.",
    cta: "Jetzt ausprobieren →",
    tools: [
      { tag: "Finanzen", title: "Familienbudget-Rechner", desc: "Teile dein Einkommen mit der 50-30-20-Methode auf – in Sekunden." },
      { tag: "Finanzen", title: "Was kostet ein Kind?", desc: "Schätze die Kosten bis zum 18. Geburtstag – pro Monat, Jahr und gesamt." },
      { tag: "Familie", title: "Taschengeld-Rechner", desc: "Wie viel Taschengeld passt zum Alter deines Kindes? Sofort-Empfehlung." },
      { tag: "Quiz", title: "Welcher Spar-Typ bist du?", desc: "5 Fragen, dein persönlicher Spartyp – mit Tipps, die wirklich passen." },
      { tag: "Downloads", title: "Gratis Druckvorlagen", desc: "Budget-Planer, Wochenplan, Packliste & Sparziel-Tracker zum Ausdrucken." },
    ],
  },
  en: {
    title: "Family Tools & Calculators",
    subtitle: "Free helpers for everyday family life – fast, clear and honest. No login, no data sharing.",
    cta: "Try it now →",
    tools: [
      { tag: "Finance", title: "Family Budget Calculator", desc: "Split your income with the 50-30-20 method – in seconds." },
      { tag: "Finance", title: "What does a child cost?", desc: "Estimate the costs until age 18 – per month, year and in total." },
      { tag: "Family", title: "Pocket Money Calculator", desc: "How much pocket money suits your child's age? Instant recommendation." },
      { tag: "Quiz", title: "What's your saver type?", desc: "5 questions, your personal saver type – with tips that really fit." },
      { tag: "Downloads", title: "Free Printables", desc: "Budget planner, weekly plan, packing list & savings tracker to print." },
    ],
  },
  fr: {
    title: "Outils & Calculateurs Famille",
    subtitle: "Des aides gratuites pour le quotidien familial – rapides, claires et honnêtes. Sans compte, sans partage de données.",
    cta: "Essayer maintenant →",
    tools: [
      { tag: "Finances", title: "Calculateur de budget familial", desc: "Répartissez vos revenus avec la méthode 50-30-20 – en quelques secondes." },
      { tag: "Finances", title: "Combien coûte un enfant ?", desc: "Estimez les coûts jusqu'à 18 ans – par mois, par an et au total." },
      { tag: "Famille", title: "Calculateur d'argent de poche", desc: "Quel montant selon l'âge de votre enfant ? Recommandation immédiate." },
      { tag: "Quiz", title: "Quel épargnant êtes-vous ?", desc: "5 questions, votre profil d'épargnant – avec des conseils adaptés." },
      { tag: "Téléchargements", title: "Modèles à imprimer gratuits", desc: "Planificateur de budget, menu, liste de bagages & suivi d'épargne à imprimer." },
    ],
  },
};

const HREFS = ["/tools/familienbudget", "/tools/was-kostet-ein-kind", "/tools/taschengeld", "/tools/spartyp-test", "/tools/druckvorlagen"];
const EMOJIS = ["💰", "🍼", "🐷", "🧭", "🖨️"];

export default function ToolsPage() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-6 pb-24">
        {s.tools.map((tool, i) => (
          <Link
            key={HREFS[i]}
            href={HREFS[i]}
            className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all p-7 flex flex-col"
          >
            <div className="text-4xl mb-3">{EMOJIS[i]}</div>
            <span className="text-xs font-medium text-blue-600">{tool.tag}</span>
            <h2 className="mt-1 text-xl font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">{tool.title}</h2>
            <p className="mt-2 text-gray-500 text-sm flex-1">{tool.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">{s.cta}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
