import Link from "next/link";
import { cookies } from "next/headers";
import SectionHero from "../../components/SectionHero";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Vergleiche für Familien",
  description:
    "Ehrliche Vergleiche für Familien: Reiseversicherung, Girokonto & mehr – die Optionen übersichtlich gegenübergestellt.",
  path: "/vergleich",
});

const STR = {
  de: { title: "Vergleiche", subtitle: "Ehrliche Gegenüberstellungen – die Optionen auf einen Blick, damit du schneller die passende Wahl triffst.", cta: "Vergleich ansehen →" },
  en: { title: "Comparisons", subtitle: "Honest side-by-side comparisons – the options at a glance so you decide faster.", cta: "View comparison →" },
  fr: { title: "Comparatifs", subtitle: "Comparatifs honnêtes – les options en un coup d'œil pour décider plus vite.", cta: "Voir le comparatif →" },
};

const ITEMS = [
  { href: "/vergleich/reiseversicherung-familien", emoji: "🧳", de: ["Reiseversicherung für Familien", "Die 3 Bausteine im Vergleich – was wirklich zählt."], en: ["Travel insurance for families", "The 3 building blocks compared."], fr: ["Assurance voyage famille", "Les 3 garanties comparées."] },
  { href: "/vergleich/girokonto-familien", emoji: "🏦", de: ["Girokonto für Familien", "Filiale, Direktbank oder Smartphone-Bank?"], en: ["Family current account", "Branch, direct or smartphone bank?"], fr: ["Compte courant famille", "Agence, en ligne ou néobanque ?"] },
];

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const L = ["de", "en", "fr"].includes(loc) ? loc : "de";
  const s = STR[L];
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl px-6 pb-24">
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href} className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all p-7 flex flex-col">
            <div className="text-4xl mb-3">{it.emoji}</div>
            <h2 className="text-xl font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">{it[L][0]}</h2>
            <p className="mt-2 text-gray-500 text-sm flex-1">{it[L][1]}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">{s.cta}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
