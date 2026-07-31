import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const metadata = buildMeta({
  title: "Haushaltsbudget-Planer zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Haushaltsbudget-Planer für Familien – Einnahmen, Fixkosten, variable Ausgaben und Sparen auf einer Seite.",
  path: "/tools/druckvorlagen/haushaltsbudget",
});

const Section = ({ title, rows }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">{title}</h3>
    <table className="w-full text-sm">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-gray-200">
            <td className="py-2 text-gray-700">{r || " "}</td>
            <td className="py-2 w-28 text-right text-gray-300">________ €</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet
        title="Haushaltsbudget-Planer"
        subtitle="Monat für Monat den Überblick behalten – ausdrucken und ausfüllen."
        sheetTitle="Budget-Planer"
        sheetIntro="Monat: __________________    Nach der 50-30-20-Methode: 50 % Notwendiges · 30 % Wünsche · 20 % Sparen."
      >
        <Section title="Einnahmen" rows={["Gehalt 1", "Gehalt 2", "Kindergeld", "Sonstiges", ""]} />
        <Section title="Fixkosten (Notwendiges)" rows={["Miete / Wohnen", "Strom / Gas / Wasser", "Versicherungen", "Internet / Handy", "Mobilität / Auto", "Kita / Betreuung", ""]} />
        <Section title="Variable Kosten" rows={["Lebensmittel", "Kleidung", "Freizeit / Hobbys", "Kinder / Schule", ""]} />
        <Section title="Sparen & Rücklagen" rows={["Notgroschen", "Sparplan Kinder", "Urlaubskasse", ""]} />
        <p className="text-xs text-gray-400">Tipp: Erst sparen (Dauerauftrag nach Gehaltseingang), dann den Rest ausgeben.</p>
      </PrintSheet>
    </div>
  );
}
