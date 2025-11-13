"use client";
import AffiliateGrid from "@/components/AffiliateGrid";

export default function KinderBildungClient() {
  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center pt-52 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          Kinder & Bildung
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
          Lernideen, Spiele und Medienkompetenz – modern, kreativ und kindgerecht
          für neugierige Köpfe.
        </p>
      </section>

      {/* DYNAMISCHE PARTNER */}
      <section className="py-20 bg-gradient-to-b from-[#f9fbff] to-[#ffffff]">
        <h2 className="text-2xl font-bold text-center text-[#1c3d6c] mb-10">
          🎓 Lernpartner & Kooperationen
        </h2>
        <AffiliateGrid category="kinder" limit={9} />
      </section>

      {/* NEWSLETTER */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-[#eef3fb] to-[#f8faff]">
        <h2 className="text-2xl font-bold text-[#1c3d6c] mb-4">
          📬 Bildung & Lernideen direkt ins Postfach
        </h2>
        <p className="text-gray-700 mb-6 max-w-md mx-auto leading-relaxed">
          Erhalte regelmäßig neue Lernspiele, Förderideen & kindgerechte
          Tipps zum Lernen.
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
