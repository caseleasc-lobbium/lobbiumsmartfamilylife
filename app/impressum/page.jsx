import Head from "next/head";

export default function Impressum() {
  return (
    <>
      <Head>
        <title>Impressum – Smart Family Life by Lobbium</title>
        <meta
          name="description"
          content="Impressum von Smart Family Life by Lobbium – gesetzliche Informationen gemäß § 5 TMG."
        />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-28 md:py-32 px-6 mt-20 border-b border-[#e1e5ee]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">📘 Impressum</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Angaben gemäß § 5 TMG
        </p>
      </section>

      {/* Inhalt */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-700 leading-relaxed">

        {/* Betreiber */}
        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Betreiber</h2>
        <p className="mb-6">
          <strong>Lobbium – Smart Family Life</strong><br />
          Verantwortlich gemäß § 5 TMG:<br />
          <strong>Sergino Elisha</strong><br />
          (Adresse folgt)
          <br />
          Deutschland
        </p>

        {/* Kontakt */}
        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Kontakt</h2>
        <p className="mb-6">
          Telefon: folgt…<br />
          E-Mail: info@lobbium.com
        </p>

        {/* Umsatzsteuer (optional) */}
        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Umsatzsteuer-ID</h2>
        <p className="mb-6">
          (Falls vorhanden) Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: folgt…
        </p>

        {/* Haftung */}
        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Haftungshinweis</h2>
        <p className="mb-6">
          Trotz sorgfältiger Kontrolle übernehmen wir keine Haftung für Inhalte externer Links.
          Für die Inhalte der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Quelle: e-recht24.de (angepasst)
        </p>
      </section>
    </>
  );
}