import PrintSheet from "../../../../components/PrintSheet";
import { generateMetadata as buildMeta } from "../../../../lib/seo";

export const metadata = buildMeta({
  title: "Sparziel-Tracker zum Ausdrucken",
  description:
    "Kostenlose Druckvorlage: Sparziel-Tracker zum Ausmalen – motiviert die ganze Familie, das Sparziel zu erreichen.",
  path: "/tools/druckvorlagen/sparziel",
});

export default function Page() {
  return (
    <div className="flex flex-col items-center w-full">
      <PrintSheet
        title="Sparziel-Tracker"
        subtitle="Sparziel festlegen, jeden erreichten Schritt ausmalen – so bleibt die ganze Familie am Ball."
        sheetTitle="Mein Sparziel"
        sheetIntro="Ausmalen, was schon gespart ist – sichtbarer Fortschritt motiviert am meisten."
      >
        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <p><strong>Wofür spare ich?</strong> _______________________________________________</p>
          <p><strong>Zielbetrag:</strong> __________ €&nbsp;&nbsp;&nbsp;<strong>bis:</strong> __________</p>
          <p><strong>Pro Kästchen:</strong> __________ €</p>
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square border border-gray-300 rounded-sm flex items-center justify-center text-[9px] text-gray-300"
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xs text-gray-400">
          <span>Start</span>
          <span>25 %</span>
          <span>50 %</span>
          <span>75 %</span>
          <span>🎉 Ziel</span>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Tipp: Häng den Tracker an den Kühlschrank – jedes ausgemalte Kästchen ist ein kleiner Erfolg.
        </p>
      </PrintSheet>
    </div>
  );
}
