import Link from "next/link";
import { cookies } from "next/headers";
import SectionHero from "../../../components/SectionHero";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Gratis Druckvorlagen für Familien",
  description:
    "Kostenlose Druckvorlagen zum Ausdrucken: Haushaltsbudget-Planer, Meal-Prep-Wochenplan, Familien-Packliste und Sparziel-Tracker. Ohne Anmeldung.",
  path: "/tools/druckvorlagen",
});

const HREFS = ["/tools/druckvorlagen/haushaltsbudget", "/tools/druckvorlagen/wochenplan", "/tools/druckvorlagen/packliste", "/tools/druckvorlagen/sparziel"];
const EMOJIS = ["💶", "🍽️", "🧳", "🎯"];

const STR = {
  de: {
    title: "Gratis Druckvorlagen",
    subtitle: "Schöne, praktische Vorlagen zum Ausdrucken oder als PDF speichern – kostenlos, ohne Anmeldung. Perfekt für den Familienalltag.",
    cta: "Öffnen & drucken →",
    sheets: [
      { title: "Haushaltsbudget-Planer", desc: "Einnahmen, Fixkosten & Sparen auf einer Seite – Monat für Monat den Überblick behalten." },
      { title: "Meal-Prep-Wochenplan", desc: "Wochenplan für alle Mahlzeiten inkl. Einkaufsliste – nie wieder ratlos vor dem Kühlschrank." },
      { title: "Familien-Packliste", desc: "Die komplette Urlaubs-Packliste inkl. Reiseapotheke – nichts Wichtiges mehr vergessen." },
      { title: "Sparziel-Tracker", desc: "Sparziel zum Ausmalen – motiviert die ganze Familie, dranzubleiben." },
    ],
  },
  en: {
    title: "Free Printables",
    subtitle: "Beautiful, practical templates to print or save as PDF – free, no login. Perfect for everyday family life.",
    cta: "Open & print →",
    sheets: [
      { title: "Household Budget Planner", desc: "Income, fixed costs & savings on one page – keep track month by month." },
      { title: "Meal-Prep Weekly Plan", desc: "A weekly plan for all meals incl. shopping list – never clueless at the fridge again." },
      { title: "Family Packing List", desc: "The complete holiday packing list incl. travel first-aid kit – forget nothing important." },
      { title: "Savings Goal Tracker", desc: "A colour-in savings goal – motivates the whole family to stick with it." },
    ],
  },
  fr: {
    title: "Modèles à imprimer gratuits",
    subtitle: "De beaux modèles pratiques à imprimer ou enregistrer en PDF – gratuits, sans compte. Parfaits pour le quotidien familial.",
    cta: "Ouvrir & imprimer →",
    sheets: [
      { title: "Planificateur de budget", desc: "Revenus, charges fixes & épargne sur une page – gardez le cap mois après mois." },
      { title: "Menu de la semaine (meal prep)", desc: "Un plan pour tous les repas avec liste de courses – fini l'hésitation devant le frigo." },
      { title: "Liste de bagages famille", desc: "La liste de vacances complète avec trousse à pharmacie – ne rien oublier d'important." },
      { title: "Suivi d'objectif d'épargne", desc: "Un objectif à colorier – motive toute la famille à tenir bon." },
    ],
  },
};

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-6 pb-24">
        {s.sheets.map((sh, i) => (
          <Link key={HREFS[i]} href={HREFS[i]} className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all p-7 flex flex-col">
            <div className="text-4xl mb-3">{EMOJIS[i]}</div>
            <h2 className="text-xl font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">{sh.title}</h2>
            <p className="mt-2 text-gray-500 text-sm flex-1">{sh.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">{s.cta}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
