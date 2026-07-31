import { cookies } from "next/headers";
import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Sparziel-Tracker zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Sparziel-Tracker zum Ausmalen – motiviert die ganze Familie, das Sparziel zu erreichen.",
  path: "/tools/druckvorlagen/sparziel",
});

const STR = {
  de: {
    title: "Sparziel-Tracker", subtitle: "Sparziel festlegen, jeden erreichten Schritt ausmalen – so bleibt die ganze Familie am Ball.",
    sheetTitle: "Mein Sparziel", sheetIntro: "Ausmalen, was schon gespart ist – sichtbarer Fortschritt motiviert am meisten.",
    l1: "Wofür spare ich?", l2a: "Zielbetrag:", l2b: "bis:", l3: "Pro Kästchen:",
    marks: ["Start", "25 %", "50 %", "75 %", "🎉 Ziel"],
    tip: "Tipp: Häng den Tracker an den Kühlschrank – jedes ausgemalte Kästchen ist ein kleiner Erfolg.",
  },
  en: {
    title: "Savings Goal Tracker", subtitle: "Set a savings goal, colour in each step reached – so the whole family stays on track.",
    sheetTitle: "My savings goal", sheetIntro: "Colour in what's already saved – visible progress motivates most.",
    l1: "What am I saving for?", l2a: "Target amount:", l2b: "by:", l3: "Per box:",
    marks: ["Start", "25 %", "50 %", "75 %", "🎉 Goal"],
    tip: "Tip: stick the tracker on the fridge – every coloured box is a small win.",
  },
  fr: {
    title: "Suivi d'objectif d'épargne", subtitle: "Fixez un objectif, coloriez chaque étape atteinte – toute la famille reste motivée.",
    sheetTitle: "Mon objectif d'épargne", sheetIntro: "Coloriez ce qui est déjà épargné – un progrès visible motive le plus.",
    l1: "Pour quoi j'épargne ?", l2a: "Montant cible :", l2b: "d'ici :", l3: "Par case :",
    marks: ["Départ", "25 %", "50 %", "75 %", "🎉 Objectif"],
    tip: "Astuce : accrochez le suivi au frigo – chaque case coloriée est une petite victoire.",
  },
};

export default function Page() {
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"];
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet title={s.title} subtitle={s.subtitle} sheetTitle={s.sheetTitle} sheetIntro={s.sheetIntro}>
        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <p><strong>{s.l1}</strong> _______________________________________________</p>
          <p><strong>{s.l2a}</strong> __________ €&nbsp;&nbsp;&nbsp;<strong>{s.l2b}</strong> __________</p>
          <p><strong>{s.l3}</strong> __________ €</p>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="aspect-square border border-gray-300 rounded-sm flex items-center justify-center text-[9px] text-gray-300">{i + 1}</div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-xs text-gray-400">
          {s.marks.map((m, i) => <span key={i}>{m}</span>)}
        </div>
        <p className="mt-6 text-xs text-gray-400">{s.tip}</p>
      </PrintSheet>
    </div>
  );
}
