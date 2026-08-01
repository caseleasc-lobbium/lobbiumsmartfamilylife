import Link from "next/link";
import SectionHero from "../../../components/SectionHero";
import ComparisonWidget from "../../../components/ComparisonWidget";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const metadata = buildMeta({
  title: "Girokonto für Familien: Filiale, Direktbank oder Smartphone-Bank?",
  description:
    "Die drei Konto-Typen für Familien im Vergleich: Gebühren, Service und für wen sie am besten passen – ehrliche Orientierung.",
  path: "/vergleich/girokonto-familien",
});

const CTA = { label: "Konten vergleichen", url: "/api/affiliates/110" };
const columns = [
  { key: "gebuehren", label: "Gebühren" },
  { key: "service", label: "Service" },
  { key: "fuer", label: "Am besten für" },
];
const rows = [
  { name: "Direktbank", badge: "Guter Kompromiss", highlight: true, cta: CTA,
    values: { gebuehren: "Meist kostenlos", service: "Alles online, solide", fuer: "Die meisten Familien" } },
  { name: "Filialbank", cta: CTA,
    values: { gebuehren: "Oft Monatsgebühr", service: "Persönliche Beratung vor Ort", fuer: "Wer Beratung schätzt" } },
  { name: "Smartphone-Bank", cta: CTA,
    values: { gebuehren: "Meist kostenlos", service: "Schlanke App, schnelle Eröffnung", fuer: "Digital-affine Nutzer" } },
];

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title="Girokonto für Familien" subtitle="Filiale, Direktbank oder Smartphone-Bank – welcher Typ passt zu euch?" />
      <section className="w-full max-w-4xl px-6 pb-24">
        <p className="text-gray-600 mb-6">
          Das beste Konto ist das, das zu eurem Alltag passt. Vergleiche die Typen und achte auf das, was ihr wirklich nutzt
          (Bargeld, Karten, Beratung) – ein Wechsel spart oft 50–100&nbsp;€ im Jahr.
        </p>
        <ComparisonWidget columns={columns} rows={rows} />
        <p className="mt-5 text-xs text-gray-400">
          Allgemeine Orientierung, keine Finanzberatung. Konditionen unterscheiden sich je Bank – vor Eröffnung prüfen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/blog/girokonto-fuer-familien-vergleich" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">📖 Ausführlicher Ratgeber</Link>
          <Link href="/tools/familienbudget" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">💰 Budget-Rechner</Link>
          <Link href="/vergleich" className="text-gray-500 hover:text-blue-600 text-sm">← Alle Vergleiche</Link>
        </div>
      </section>
    </div>
  );
}
