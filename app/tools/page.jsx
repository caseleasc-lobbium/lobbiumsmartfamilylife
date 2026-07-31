import Link from "next/link";
import SectionHero from "../../components/SectionHero";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const metadata = buildMeta({
  title: "Familien-Tools & Rechner",
  description:
    "Kostenlose Rechner & Helfer für Familien: Familienbudget, Was kostet ein Kind, Taschengeld und der Spartyp-Test – schnell, verständlich und ehrlich.",
  path: "/tools",
});

const TOOLS = [
  {
    href: "/tools/familienbudget",
    emoji: "💰",
    title: "Familienbudget-Rechner",
    desc: "Teile dein Einkommen mit der 50-30-20-Methode auf – in Sekunden.",
    tag: "Finanzen",
  },
  {
    href: "/tools/was-kostet-ein-kind",
    emoji: "🍼",
    title: "Was kostet ein Kind?",
    desc: "Schätze die Kosten bis zum 18. Geburtstag – pro Monat, Jahr und gesamt.",
    tag: "Finanzen",
  },
  {
    href: "/tools/taschengeld",
    emoji: "🐷",
    title: "Taschengeld-Rechner",
    desc: "Wie viel Taschengeld passt zum Alter deines Kindes? Sofort-Empfehlung.",
    tag: "Familie",
  },
  {
    href: "/tools/spartyp-test",
    emoji: "🧭",
    title: "Welcher Spar-Typ bist du?",
    desc: "5 Fragen, dein persönlicher Spartyp – mit Tipps, die wirklich passen.",
    tag: "Quiz",
  },
  {
    href: "/tools/druckvorlagen",
    emoji: "🖨️",
    title: "Gratis Druckvorlagen",
    desc: "Budget-Planer, Wochenplan, Packliste & Sparziel-Tracker zum Ausdrucken.",
    tag: "Downloads",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Familien-Tools & Rechner"
        subtitle="Kostenlose Helfer für den Familienalltag – schnell, verständlich und ehrlich. Kein Login, keine Daten-Weitergabe."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-6 pb-24">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all p-7 flex flex-col"
          >
            <div className="text-4xl mb-3">{tool.emoji}</div>
            <span className="text-xs font-medium text-blue-600">{tool.tag}</span>
            <h2 className="mt-1 text-xl font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">
              {tool.title}
            </h2>
            <p className="mt-2 text-gray-500 text-sm flex-1">{tool.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
              Jetzt ausprobieren →
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
