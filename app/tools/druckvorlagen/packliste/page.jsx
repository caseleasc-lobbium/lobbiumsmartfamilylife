import { cookies } from "next/headers";
import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Familien-Packliste zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: komplette Urlaubs-Packliste für Familien inkl. Reiseapotheke – nichts Wichtiges mehr vergessen.",
  path: "/tools/druckvorlagen/packliste",
});

const STR = {
  de: {
    title: "Familien-Packliste", subtitle: "Die komplette Urlaubs-Checkliste inkl. Reiseapotheke – abhaken und entspannt starten.",
    sheetTitle: "Urlaubs-Packliste", sheetIntro: "Reiseziel: __________________    Reisedatum: __________",
    groups: [
      ["Dokumente & Geld", ["Ausweise / Reisepässe", "Krankenversicherungskarten", "Buchungen / Tickets", "Bargeld / Karten", "Impfpass (Kinder)"]],
      ["Kleidung", ["Wäsche & Socken", "Ober-/Unterteile", "Jacke / Regenkleidung", "Schlafanzüge", "Bade-/Sportsachen", "Schuhe"]],
      ["Reiseapotheke", ["Pflaster & Verband", "Fieber-/Schmerzmittel (Kind)", "Mittel gegen Reiseübelkeit", "Insektenschutz & After-Sun", "Sonnencreme (hoher LSF)", "Desinfektion & Pinzette", "Dauermedikamente"]],
      ["Für die Kinder", ["Kuscheltier / Einschlafhilfe", "Spielzeug / Bücher", "Snacks & Trinkflasche", "Feuchttücher & Windeln", "Wechselkleidung Handgepäck"]],
      ["Technik & Sonstiges", ["Ladegeräte / Powerbank", "Adapter (Ausland)", "Kopfhörer", "Wiederverschließbare Beutel", "Kleiner Erste-Hilfe-Beutel"]],
    ],
  },
  en: {
    title: "Family Packing List", subtitle: "The complete holiday checklist incl. travel first-aid kit – tick off and start relaxed.",
    sheetTitle: "Holiday packing list", sheetIntro: "Destination: __________________    Travel date: __________",
    groups: [
      ["Documents & money", ["ID cards / passports", "Health insurance cards", "Bookings / tickets", "Cash / cards", "Vaccination record (kids)"]],
      ["Clothing", ["Underwear & socks", "Tops / bottoms", "Jacket / rainwear", "Pyjamas", "Swim / sports gear", "Shoes"]],
      ["Travel first-aid kit", ["Plasters & bandages", "Fever/pain relief (child)", "Travel sickness remedy", "Insect repellent & after-sun", "Sunscreen (high SPF)", "Disinfectant & tweezers", "Regular medication"]],
      ["For the kids", ["Cuddly toy / sleep aid", "Toys / books", "Snacks & water bottle", "Wet wipes & nappies", "Spare clothes in hand luggage"]],
      ["Tech & other", ["Chargers / power bank", "Adapter (abroad)", "Headphones", "Resealable bags", "Small first-aid pouch"]],
    ],
  },
  fr: {
    title: "Liste de bagages famille", subtitle: "La checklist de vacances complète avec trousse à pharmacie – cocher et partir sereins.",
    sheetTitle: "Liste de bagages", sheetIntro: "Destination : __________________    Date de départ : __________",
    groups: [
      ["Documents & argent", ["Cartes d'identité / passeports", "Cartes d'assurance maladie", "Réservations / billets", "Espèces / cartes", "Carnet de vaccination (enfants)"]],
      ["Vêtements", ["Sous-vêtements & chaussettes", "Hauts / bas", "Veste / imperméable", "Pyjamas", "Maillots / tenue de sport", "Chaussures"]],
      ["Trousse à pharmacie", ["Pansements & bandages", "Antipyrétique/antidouleur (enfant)", "Contre le mal des transports", "Répulsif & après-soleil", "Crème solaire (indice élevé)", "Désinfectant & pince à épiler", "Traitements habituels"]],
      ["Pour les enfants", ["Doudou / aide au sommeil", "Jouets / livres", "En-cas & gourde", "Lingettes & couches", "Vêtements de rechange en cabine"]],
      ["Tech & divers", ["Chargeurs / batterie externe", "Adaptateur (étranger)", "Écouteurs", "Sachets refermables", "Petite trousse de secours"]],
    ],
  },
};

const Group = ({ title, items }) => (
  <div className="mb-5 break-inside-avoid">
    <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">{title}</h3>
    <ul className="space-y-1.5 text-sm">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <span className="inline-block w-4 h-4 border border-gray-300 rounded-sm shrink-0" />{it}
        </li>
      ))}
    </ul>
  </div>
);

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet title={s.title} subtitle={s.subtitle} sheetTitle={s.sheetTitle} sheetIntro={s.sheetIntro}>
        <div className="columns-1 sm:columns-2 gap-8">
          {s.groups.map(([t, items]) => <Group key={t} title={t} items={items} />)}
        </div>
      </PrintSheet>
    </div>
  );
}
