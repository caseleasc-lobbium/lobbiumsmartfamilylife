import { cookies } from "next/headers";
import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Haushaltsbudget-Planer zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Haushaltsbudget-Planer für Familien – Einnahmen, Fixkosten, variable Ausgaben und Sparen auf einer Seite.",
  path: "/tools/druckvorlagen/haushaltsbudget",
});

const STR = {
  de: {
    title: "Haushaltsbudget-Planer", subtitle: "Monat für Monat den Überblick behalten – ausdrucken und ausfüllen.",
    sheetTitle: "Budget-Planer", sheetIntro: "Monat: __________________    Nach der 50-30-20-Methode: 50 % Notwendiges · 30 % Wünsche · 20 % Sparen.",
    tip: "Tipp: Erst sparen (Dauerauftrag nach Gehaltseingang), dann den Rest ausgeben.",
    s: [
      ["Einnahmen", ["Gehalt 1", "Gehalt 2", "Kindergeld", "Sonstiges", ""]],
      ["Fixkosten (Notwendiges)", ["Miete / Wohnen", "Strom / Gas / Wasser", "Versicherungen", "Internet / Handy", "Mobilität / Auto", "Kita / Betreuung", ""]],
      ["Variable Kosten", ["Lebensmittel", "Kleidung", "Freizeit / Hobbys", "Kinder / Schule", ""]],
      ["Sparen & Rücklagen", ["Notgroschen", "Sparplan Kinder", "Urlaubskasse", ""]],
    ],
  },
  en: {
    title: "Household Budget Planner", subtitle: "Keep track month by month – print and fill in.",
    sheetTitle: "Budget Planner", sheetIntro: "Month: __________________    By the 50-30-20 method: 50 % needs · 30 % wants · 20 % saving.",
    tip: "Tip: save first (standing order after payday), then spend the rest.",
    s: [
      ["Income", ["Salary 1", "Salary 2", "Child benefit", "Other", ""]],
      ["Fixed costs (needs)", ["Rent / housing", "Electricity / gas / water", "Insurance", "Internet / phone", "Transport / car", "Childcare", ""]],
      ["Variable costs", ["Groceries", "Clothing", "Leisure / hobbies", "Kids / school", ""]],
      ["Saving & reserves", ["Emergency fund", "Kids' savings plan", "Holiday fund", ""]],
    ],
  },
  fr: {
    title: "Planificateur de budget", subtitle: "Gardez le cap mois après mois – à imprimer et remplir.",
    sheetTitle: "Planificateur de budget", sheetIntro: "Mois : __________________    Selon la méthode 50-30-20 : 50 % besoins · 30 % envies · 20 % épargne.",
    tip: "Astuce : épargnez d'abord (virement après la paie), dépensez le reste ensuite.",
    s: [
      ["Revenus", ["Salaire 1", "Salaire 2", "Allocations", "Autres", ""]],
      ["Charges fixes (besoins)", ["Loyer / logement", "Électricité / gaz / eau", "Assurances", "Internet / téléphone", "Transport / voiture", "Garde d'enfants", ""]],
      ["Charges variables", ["Alimentation", "Vêtements", "Loisirs / hobbies", "Enfants / école", ""]],
      ["Épargne & réserves", ["Fonds d'urgence", "Épargne enfants", "Cagnotte vacances", ""]],
    ],
  },
};

const Section = ({ title, rows }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">{title}</h3>
    <table className="w-full text-sm"><tbody>
      {rows.map((r, i) => (
        <tr key={i} className="border-b border-gray-200">
          <td className="py-2 text-gray-700">{r || " "}</td>
          <td className="py-2 w-28 text-right text-gray-300">________ €</td>
        </tr>
      ))}
    </tbody></table>
  </div>
);

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet title={s.title} subtitle={s.subtitle} sheetTitle={s.sheetTitle} sheetIntro={s.sheetIntro}>
        {s.s.map(([t, rows], i) => <Section key={i} title={t} rows={rows} />)}
        <p className="text-xs text-gray-400">{s.tip}</p>
      </PrintSheet>
    </div>
  );
}
