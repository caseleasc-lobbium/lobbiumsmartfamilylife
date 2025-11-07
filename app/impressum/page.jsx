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

      {/* Hero-Bereich */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-28 md:py-32 px-6 mt-20 border-b border-[#e1e5ee]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">📘 Impressum</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Angaben gemäß § 5 TMG
        </p>
      </section>

      {/* Impressum Inhalt */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-700 leading-relaxed">
        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Betreiber</h2>
        <p className="mb-6">
          <strong>Lobbium</strong><br />
          Inhaber: Max Mustermann<br />
          Musterstraße 12<br />
          12345 Musterstadt<br />
          Deutschland
        </p>

        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Kontakt</h2>
        <p className="mb-6">
          Telefon: +49 (0)123 456789<br />
          E-Mail: info@lobbium.com
        </p>

        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Umsatzsteuer-ID</h2>
        <p className="mb-6">
          Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE123456789
        </p>

        <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-4">Haftungshinweis</h2>
        <p className="mb-6">
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
          für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
          sind ausschließlich deren Betreiber verantwortlich.
        </p>

        <p className="text-sm text-gray-500 mt-10">
          Quelle: Impressum-Generator von e-recht24.de
        </p>
      </section>
    </>
  );
}
