"use client";
import AffiliateGrid from "../components/AffiliateGrid";

export default function HomeClient() {
  return (
    <>
      {/* HERO-BEREICH */}
      <section className="bg-gradient-to-b from-[#f0f4ff] via-[#f5f7fa] to-[#ffffff] text-center pt-52 pb-20">
        <h1 className="text-5xl font-bold text-[#1c3d6c] mb-4">
          Smart Family Life by Lobbium
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Clever sparen, Alltag organisieren und Kinder spielerisch fördern –
          kompakt, praxiserprobt und schön aufbereitet.
        </p>
      </section>

      {/* VITRINE – PARTNER DES TAGES */}
      <section className="py-20 bg-gradient-to-b from-[#f9fbff] to-[#ffffff]">
        <h2 className="text-3xl font-bold text-center text-[#1c3d6c] mb-10">
          🌟 Partner des Tages – Empfehlungen für dich
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Jeden Tag neu ausgewählt – beliebte Marken, clevere Spartipps und
          familienfreundliche Inspirationen aus allen Rubriken.
        </p>

        {/* GEMISCHTE AFFILIATES */}
        <AffiliateGrid category="all" limit={6} />
      </section>

      {/* RUBRIKENÜBERSICHT */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-4 gap-8 text-center">
        {[
          {
            title: "💰 Finanzen & Spartipps",
            desc: "Spare clever & plane nachhaltig für deine Familie.",
            href: "/finanzen-spartipps",
          },
          {
            title: "👨‍👩‍👧 Familienleben",
            desc: "Ideen & Tools für Organisation und glückliche Routinen.",
            href: "/familienleben",
          },
          {
            title: "🎓 Kinder & Bildung",
            desc: "Lernideen & Spiele für kluge Köpfe.",
            href: "/kinder-bildung",
          },
          {
            title: "🌿 Lifestyle & Inspiration",
            desc: "Selfcare, Nachhaltigkeit & Genuss für den Alltag.",
            href: "/lifestyle",
          },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="bg-white border border-[#e1e5ee] rounded-xl shadow-md hover:shadow-lg transition p-6"
          >
            <h3 className="text-xl font-semibold text-[#1c3d6c] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </a>
        ))}
      </section>

      {/* NEWSLETTER */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">
          📬 Wöchentliche Family-Highlights direkt ins Postfach
        </h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Erhalte jede Woche neue Ideen, Partnerangebote & Spartipps für dein
          Familienleben – kostenlos & inspirierend.
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
