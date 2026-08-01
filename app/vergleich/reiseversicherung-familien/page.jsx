import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import ComparisonWidget from "../../../components/ComparisonWidget";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Reiseversicherung für Familien: die Bausteine im Vergleich",
  description:
    "Auslandskranken-, Reiserücktritts- und Reiseabbruchversicherung im Vergleich: Was abgedeckt ist, wann es sinnvoll ist und für wen – ehrlich erklärt.",
  path: "/vergleich/reiseversicherung-familien",
});

const CTA = { label: "Angebote ansehen", url: "/api/affiliates/95" };
const columns = [
  { key: "abdeckung", label: "Was abgedeckt ist" },
  { key: "wann", label: "Wann sinnvoll" },
  { key: "fuer", label: "Für wen" },
];
const rows = [
  { name: "Auslandskrankenversicherung", badge: "Wichtigster Baustein", highlight: true, cta: CTA,
    values: { abdeckung: "Behandlung + medizinischer Rücktransport im Ausland", wann: "Bei jeder Auslandsreise", fuer: "Alle Familien" } },
  { name: "Reiserücktrittsversicherung", cta: CTA,
    values: { abdeckung: "Stornokosten, wenn die Reise nicht angetreten wird", wann: "Bei teuren oder früh gebuchten Reisen", fuer: "Familien mit kleinen Kindern" } },
  { name: "Reiseabbruchversicherung", cta: CTA,
    values: { abdeckung: "Anteilige Kosten bei vorzeitigem Abbruch", wann: "Wenn die Reise vorzeitig endet", fuer: "Längere Reisen" } },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title="Reiseversicherung für Familien" subtitle="Die drei Bausteine im ehrlichen Vergleich – was zählt wirklich?" />
      <section className="w-full max-w-4xl px-6 pb-24">
        <p className="text-gray-600 mb-6">
          Eine gute Auslandskrankenversicherung ist für Familien fast immer sinnvoll – die anderen Bausteine je nach Reise.
          Vergleiche die Optionen und wähle nach Leistung, nicht nur nach Preis.
        </p>
        <ComparisonWidget columns={columns} rows={rows} />
        <p className="mt-5 text-xs text-gray-400">
          Allgemeine Orientierung, keine Versicherungsberatung. Leistungen &amp; Bedingungen unterscheiden sich je Anbieter – vor Abschluss prüfen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/blog/reiseversicherung-fuer-familien" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">📖 Ausführlicher Ratgeber</Link>
          <Link href="/vergleich" className="text-gray-500 hover:text-blue-600 text-sm">← Alle Vergleiche</Link>
        </div>
      </section>
    </div>
  );
}
