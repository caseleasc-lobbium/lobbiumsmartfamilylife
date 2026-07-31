import { cookies } from "next/headers";
import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Meal-Prep-Wochenplan zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Essensplan für die ganze Woche inkl. Einkaufsliste – perfekt fürs Meal-Prep in der Familie.",
  path: "/tools/druckvorlagen/wochenplan",
});

const STR = {
  de: { title: "Meal-Prep-Wochenplan", subtitle: "Einmal planen, entspannt durch die Woche – ausdrucken und ausfüllen.",
    sheetTitle: "Wochen-Essensplan", sheetIntro: "Woche vom __________ bis __________",
    day: "Tag", cols: ["Frühstück", "Mittag", "Abend"], shop: "Einkaufsliste",
    days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"] },
  en: { title: "Meal-Prep Weekly Plan", subtitle: "Plan once, cruise through the week – print and fill in.",
    sheetTitle: "Weekly meal plan", sheetIntro: "Week from __________ to __________",
    day: "Day", cols: ["Breakfast", "Lunch", "Dinner"], shop: "Shopping list",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  fr: { title: "Menu de la semaine (meal prep)", subtitle: "Planifier une fois, une semaine sereine – à imprimer et remplir.",
    sheetTitle: "Menu hebdomadaire", sheetIntro: "Semaine du __________ au __________",
    day: "Jour", cols: ["Petit-déj.", "Midi", "Soir"], shop: "Liste de courses",
    days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
};

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet title={s.title} subtitle={s.subtitle} sheetTitle={s.sheetTitle} sheetIntro={s.sheetIntro}>
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 py-2 px-2 text-left text-blue-600 w-24">{s.day}</th>
              {s.cols.map((c) => <th key={c} className="border border-gray-300 py-2 px-2 text-left text-blue-600">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {s.days.map((d) => (
              <tr key={d}>
                <td className="border border-gray-300 py-4 px-2 font-semibold text-gray-700">{d}</td>
                <td className="border border-gray-300"></td><td className="border border-gray-300"></td><td className="border border-gray-300"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">{s.shop}</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 border-b border-gray-200 pb-1">
              <span className="inline-block w-4 h-4 border border-gray-300 rounded-sm" />
              <span className="text-gray-300">________________________</span>
            </div>
          ))}
        </div>
      </PrintSheet>
    </div>
  );
}
