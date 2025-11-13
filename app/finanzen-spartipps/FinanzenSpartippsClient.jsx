"use client";
import Image from "next/image";
import AffiliateGrid from "@/components/AffiliateGrid";

export default function FinanzenSpartippsClient() {
  const bereiche = [
    {
      title: "Haushaltsbudget",
      desc: "Einfache Tools, um Einnahmen & Ausgaben immer im Blick zu behalten.",
    },
    {
      title: "Energie sparen",
      desc: "Strom, Heizung und Wasser effizient nutzen – kleine Schritte, große Wirkung.",
    },
    {
      title: "Familienkonto & Cashback",
      desc: "So organisierst du Finanzen fair & transparent im Familienalltag.",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center pt-52 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          Finanzen & Spartipps
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Budgetplanung, Versicherungen, Energiesparen und smarte Spartipps – so
          bleibt jeden Monat mehr für Familien übrig.
        </p>
      </section>

      {/* PARTNER-KACHELN */}
      <section className="py-20 bg-gradient-to-b from-[#f9fbff] to-[#ffffff]">
        <h2 className="text-2xl font-bold text-center text-[#1c3d6c] mb-10">
          💰 Unsere Finanz-Partner des Tages
        </h2>
        <AffiliateGrid category="finanzen" limit={9} />
      </section>

      {/* NEWSLETTER */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">
          📬 Erhalte exklusive Spartipps direkt ins Postfach
        </h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Bleib immer auf dem Laufenden – mit neuen Spartipps, Finanzideen &
          cleveren Routinen für Familien.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Deine E-Mail-Adresse"
            className="flex-1 border border-[#ccd3e0] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2b6cb0]"
            required
          />
          <button
            type="submit"
            className="bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white px-5 py-2 rounded-md font-semibold shadow-soft transition"
          >
            Anmelden
          </button>
        </form>
      </section>
    </>
  );
}