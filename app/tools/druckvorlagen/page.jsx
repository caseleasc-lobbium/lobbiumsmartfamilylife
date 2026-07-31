import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Gratis Druckvorlagen für Familien",
  description:
    "Kostenlose Druckvorlagen zum Ausdrucken: Haushaltsbudget-Planer, Meal-Prep-Wochenplan, Familien-Packliste und Sparziel-Tracker. Ohne Anmeldung.",
  path: "/tools/druckvorlagen",
});

const SHEETS = [
  { href: "/tools/druckvorlagen/haushaltsbudget", emoji: "💶", title: "Haushaltsbudget-Planer", desc: "Einnahmen, Fixkosten & Sparen auf einer Seite – Monat für Monat den Überblick behalten." },
  { href: "/tools/druckvorlagen/wochenplan", emoji: "🍽️", title: "Meal-Prep-Wochenplan", desc: "Wochenplan für alle Mahlzeiten inkl. Einkaufsliste – nie wieder ratlos vor dem Kühlschrank." },
  { href: "/tools/druckvorlagen/packliste", emoji: "🧳", title: "Familien-Packliste", desc: "Die komplette Urlaubs-Packliste inkl. Reiseapotheke – nichts Wichtiges mehr vergessen." },
  { href: "/tools/druckvorlagen/sparziel", emoji: "🎯", title: "Sparziel-Tracker", desc: "Sparziel zum Ausmalen – motiviert die ganze Familie, dranzubleiben." },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Gratis Druckvorlagen"
        subtitle="Schöne, praktische Vorlagen zum Ausdrucken oder als PDF speichern – kostenlos, ohne Anmeldung. Perfekt für den Familienalltag."
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-6 pb-24">
        {SHEETS.map((s) => (
          <Link key={s.href} href={s.href} className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all p-7 flex flex-col">
            <div className="text-4xl mb-3">{s.emoji}</div>
            <h2 className="text-xl font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">{s.title}</h2>
            <p className="mt-2 text-gray-500 text-sm flex-1">{s.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">Öffnen &amp; drucken →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
