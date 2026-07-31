import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const metadata = buildMeta({
  title: "Familien-Packliste zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: komplette Urlaubs-Packliste für Familien inkl. Reiseapotheke – nichts Wichtiges mehr vergessen.",
  path: "/tools/druckvorlagen/packliste",
});

const GROUPS = [
  { title: "Dokumente & Geld", items: ["Ausweise / Reisepässe", "Krankenversicherungskarten", "Buchungen / Tickets", "Bargeld / Karten", "Impfpass (Kinder)"] },
  { title: "Kleidung", items: ["Wäsche & Socken", "Ober-/Unterteile", "Jacke / Regenkleidung", "Schlafanzüge", "Bade-/Sportsachen", "Schuhe"] },
  { title: "Reiseapotheke", items: ["Pflaster & Verband", "Fieber-/Schmerzmittel (Kind)", "Mittel gegen Reiseübelkeit", "Insektenschutz & After-Sun", "Sonnencreme (hoher LSF)", "Desinfektion & Pinzette", "Dauermedikamente"] },
  { title: "Für die Kinder", items: ["Kuscheltier / Einschlafhilfe", "Spielzeug / Bücher", "Snacks & Trinkflasche", "Feuchttücher & Windeln", "Wechselkleidung Handgepäck"] },
  { title: "Technik & Sonstiges", items: ["Ladegeräte / Powerbank", "Adapter (Ausland)", "Kopfhörer", "Wiederverschließbare Beutel", "Kleiner Erste-Hilfe-Beutel"] },
];

const Group = ({ title, items }) => (
  <div className="mb-5 break-inside-avoid">
    <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">{title}</h3>
    <ul className="space-y-1.5 text-sm">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <span className="inline-block w-4 h-4 border border-gray-300 rounded-sm shrink-0" />
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet
        title="Familien-Packliste"
        subtitle="Die komplette Urlaubs-Checkliste inkl. Reiseapotheke – abhaken und entspannt starten."
        sheetTitle="Urlaubs-Packliste"
        sheetIntro="Reiseziel: __________________    Reisedatum: __________"
      >
        <div className="columns-1 sm:columns-2 gap-8">
          {GROUPS.map((g) => (
            <Group key={g.title} title={g.title} items={g.items} />
          ))}
        </div>
      </PrintSheet>
    </div>
  );
}
