"use client";
import Link from "next/link";
import Image from "next/image";

export default function LifestyleClient() {
  const themen = [
    {
      icon: "🌿",
      title: "Nachhaltiger Alltag",
      desc: "Einfache Wege, um Umweltbewusstsein und Familienleben zu verbinden.",
    },
    {
      icon: "🧘‍♀️",
      title: "Selfcare & Balance",
      desc: "Tipps für mentale Gesundheit und kleine Auszeiten im Alltag.",
    },
    {
      icon: "🍲",
      title: "Gesunde Ernährung",
      desc: "Schnelle & ausgewogene Familienrezepte für jeden Tag.",
    },
  ];

  const inspiration = [
    "/images/life1.png",
    "/images/life2.png",
    "/images/life3.png",
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center pt-52 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          Lifestyle & Inspiration
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Ideen für ein bewusstes, nachhaltiges & glückliches Familienleben.
        </p>
      </section>

      {/* THEMEN */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-10 pb-20">
        {themen.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee] text-center"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#1c3d6c] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* INSPIRATIONSBEREICH */}
      <section className="bg-[#f8faff] py-16">
        <h2 className="text-2xl font-bold text-center text-[#1c3d6c] mb-8">
          Inspiration aus dem Alltag
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {inspiration.map((src, i) => (
            <div
              key={i}
              className="w-40 h-24 relative grayscale hover:grayscale-0 transition mx-auto"
            >
              <Image
                src={src}
                alt={`Lifestyle Inspiration ${i + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">
          🌸 Lebe inspiriert – Woche für Woche!
        </h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Erhalte kreative Lifestyle-Tipps, nachhaltige Ideen & Motivation für dein Familienleben direkt per E-Mail.
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