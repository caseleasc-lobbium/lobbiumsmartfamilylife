import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const metadata = buildMeta({
  title: "Meal-Prep-Wochenplan zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Essensplan für die ganze Woche inkl. Einkaufsliste – perfekt fürs Meal-Prep in der Familie.",
  path: "/tools/druckvorlagen/wochenplan",
});

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet
        title="Meal-Prep-Wochenplan"
        subtitle="Einmal planen, entspannt durch die Woche – ausdrucken und ausfüllen."
        sheetTitle="Wochen-Essensplan"
        sheetIntro="Woche vom __________ bis __________"
      >
        <table className="w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 py-2 px-2 text-left text-blue-600 w-24">Tag</th>
              <th className="border border-gray-300 py-2 px-2 text-left text-blue-600">Frühstück</th>
              <th className="border border-gray-300 py-2 px-2 text-left text-blue-600">Mittag</th>
              <th className="border border-gray-300 py-2 px-2 text-left text-blue-600">Abend</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d) => (
              <tr key={d}>
                <td className="border border-gray-300 py-4 px-2 font-semibold text-gray-700">{d}</td>
                <td className="border border-gray-300"></td>
                <td className="border border-gray-300"></td>
                <td className="border border-gray-300"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">Einkaufsliste</h3>
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
