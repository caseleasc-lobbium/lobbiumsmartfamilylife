"use client";
import Link from "next/link";

export default function HomeClient() {
  return (
    <>
      {/* Hero-Bereich */}
     <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center pt-52 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          Smart Family Life by Lobbium
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Clever sparen, Alltag organisieren und Kinder spielerisch fördern –
          kompakt, praxiserprobt und schön aufbereitet.
        </p>
      </section>

      {/* Themenbereiche */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-10 pb-20">
        {[
          {
            icon: "💰",
            title: "Finanzen & Spartipps",
            desc: "Budget, Familienkonto & smarte Routinen – so bleibt jeden Monat mehr übrig.",
            link: "/finanzen-spartipps",
          },
          {
            icon: "🌳",
            title: "Familienleben & Alltag",
            desc: "Struktur, Routinen & Zeitmanagement für entspannte Tage mit Kindern.",
            link: "/familienleben",
          },
          {
            icon: "🎓",
            title: "Kinder & Bildung",
            desc: "Lernideen, Spiele & Medienkompetenz – modern & kindgerecht.",
            link: "/kinder-bildung",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee] text-center"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-[#1c3d6c] mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
            <Link
              href={item.link}
              className="text-[#2b6cb0] font-medium hover:underline"
            >
              Mehr erfahren →
            </Link>
          </div>
        ))}
      </section>

      {/* Blog-Vorschau */}
      <section className="bg-gradient-to-b from-[#f0f4ff] to-[#f8faff] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-[#1c3d6c]">Neu im Blog</h2>
            <Link
              href="/blog"
              className="text-[#2b6cb0] hover:underline font-medium"
            >
              Alle Beiträge →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "10 einfache Wege, monatlich 150€ zu sparen",
                desc: "Praktische Schritte für den Familienalltag – mit Einkaufsplanung, Energietricks und Mini-Automationen.",
              },
              {
                title: "Familienleben organisieren leicht gemacht",
                desc: "Wie du Routinen schaffst, die wirklich halten – mit Planung und Flexibilität.",
              },
              {
                title: "Clever investieren für die Zukunft deiner Kinder",
                desc: "ETFs, Kindersparpläne & nachhaltige Anlagen einfach erklärt.",
              },
            ].map((post, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee]"
              >
                <span className="text-sm text-[#2b6cb0] font-semibold">
                  Spartipp
                </span>
                <h3 className="text-lg font-bold text-[#1c3d6c] mt-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.desc}
                </p>
                <Link
                  href="/blog"
                  className="text-[#2b6cb0] font-medium hover:underline"
                >
                  Lesen →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">
          📬 Hol dir die besten Familientipps per E-Mail
        </h2>
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