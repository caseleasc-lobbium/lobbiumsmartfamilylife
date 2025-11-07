"use client";
import Image from "next/image";
import Link from "next/link";

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

  const partner = [
    "/images/finance1.png",
    "/images/finance2.png",
    "/images/finance3.png",
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

      {/* THEMEN */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-10 pb-20">
        {bereiche.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee] text-center"
          >
            <h3 className="text-xl font-semibold text-[#1c3d6c] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* PARTNER */}
      <section className="bg-[#f8faff] py-16">
        <h2 className="text-2xl font-bold text-center text-[#1c3d6c] mb-8">
          Finanzpartner & Tools
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {partner.map((src, i) => (
            <div
              key={i}
              className="w-36 h-16 relative grayscale hover:grayscale-0 transition mx-auto"
            >
              <Image
                src={src}
                alt={`Finanzpartner ${i + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
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