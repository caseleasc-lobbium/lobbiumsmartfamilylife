import Link from "next/link";
import { cookies } from "next/headers";
import PrintButton from "./PrintButton";

const UI = {
  de: { print: "🖨️ Drucken / als PDF speichern", back: "← Alle Druckvorlagen", footer: "Kostenlose Vorlage von Lobbium – Smart Family Life · lobbium.com" },
  en: { print: "🖨️ Print / save as PDF", back: "← All printables", footer: "Free template by Lobbium – Smart Family Life · lobbium.com" },
  fr: { print: "🖨️ Imprimer / enregistrer en PDF", back: "← Tous les modèles", footer: "Modèle gratuit de Lobbium – Smart Family Life · lobbium.com" },
};

// Rahmen für eine Druckvorlage: Intro (nicht gedruckt) + weißes Blatt (.print-sheet)
export default function PrintSheet({ title, subtitle, sheetTitle, sheetIntro, children }) {
  const loc = cookies().get("lobbium_locale")?.value;
  const ui = UI[["de", "en", "fr"].includes(loc) ? loc : "de"];

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <div className="no-print text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F1C3F]">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
        <div className="mt-5 flex items-center justify-center gap-4">
          <PrintButton label={ui.print} />
          <Link href="/tools/druckvorlagen" className="text-sm text-gray-500 hover:text-blue-600">{ui.back}</Link>
        </div>
      </div>

      <div className="print-sheet bg-white rounded-2xl border border-gray-200 shadow p-8 md:p-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <div className="text-lg font-extrabold text-[#0F1C3F]">Lobbium</div>
            <div className="text-[11px] uppercase tracking-widest text-blue-600">Smart Family Life</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[#0F1C3F]">{sheetTitle}</div>
            <div className="text-xs text-gray-400">lobbium.com/tools</div>
          </div>
        </div>

        {sheetIntro && <p className="text-sm text-gray-500 mb-6">{sheetIntro}</p>}
        {children}

        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-[11px] text-gray-400">{ui.footer}</div>
      </div>
    </div>
  );
}
