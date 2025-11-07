"use client";
import Link from "next/link";

export default function BlogClient() {
  const posts = [
    {
      title: "10 einfache Wege, monatlich 150€ zu sparen",
      desc: "Einfache Spartipps, die sich sofort umsetzen lassen.",
    },
    {
      title: "Familienleben organisieren leicht gemacht",
      desc: "Wie du Routinen schaffst, die wirklich halten.",
    },
    {
      title: "Clever investieren für die Zukunft deiner Kinder",
      desc: "Langfristige Anlageideen für Familien.",
    },
  ];

  const blogPosts = [
    {
      id: 1,
      tag: "Finanzen",
      title: "So baust du finanzielle Sicherheit für deine Familie auf",
      desc: "Von Budgetplanung bis Rücklagenbildung – Schritt für Schritt erklärt.",
      link: "/blog",
    },
    {
      id: 2,
      tag: "Alltag",
      title: "5 Wege, um den Familienalltag stressfreier zu gestalten",
      desc: "Mit Organisation, Routinen und Teamwork entspannt durch die Woche.",
      link: "/blog",
    },
    {
      id: 3,
      tag: "Bildung",
      title: "Wie Kinder spielend lernen – Tipps für Eltern",
      desc: "So förderst du Motivation und Kreativität deines Kindes.",
      link: "/blog",
    },
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center pt-52 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">Blog</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Aktuelle Artikel über Finanzen, Familie und Bildung – praktische Tipps & Inspiration für deinen Alltag.
        </p>
      </section>

      {/* BEITRÄGE */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pt-10 pb-20">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee]"
          >
            <h3 className="text-xl font-semibold text-[#1c3d6c] mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{post.desc}</p>
            <Link href="/blog" className="text-[#2b6cb0] font-medium hover:underline">
              Lesen →
            </Link>
          </div>
        ))}
      </section>

      {/* BLOG-KARTEN */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-[#e1e5ee] flex flex-col justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-[#2b6cb0]">{post.tag}</span>
              <h3 className="text-lg font-bold text-[#1c3d6c] mt-2 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{post.desc}</p>
            </div>
            <div className="mt-4">
              <Link href={post.link} className="text-[#2b6cb0] font-medium hover:underline">
                Weiterlesen →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* NEWSLETTER */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">📬 Verpasse keine neuen Artikel!</h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Erhalte regelmäßig Spartipps, Alltagsideen & Lernimpulse für deine Familie – direkt in dein Postfach.
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