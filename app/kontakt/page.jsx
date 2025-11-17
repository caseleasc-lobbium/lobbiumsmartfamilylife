export default function KontaktPage() {
  return (
    <>
      {/* Hero-Bereich – gleiches Design wie Impressum/Datenschutz */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-28 md:py-32 px-6 mt-20 border-b border-[#e1e5ee]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          📩 Kontakt
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Du hast Fragen zu Lobbium oder möchtest mit uns zusammenarbeiten?
        </p>
      </section>

      {/* Inhalt */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-gray-700 leading-relaxed space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            Ansprechpartner
          </h2>
          <p>
            <strong>Lobbium – Smart Family Life</strong><br />
            Inhaber: Sergino Elisha<br />
            {/* Passe diese Daten später an deine echte Anschrift an */}
            Deutschland
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            E-Mail
          </h2>
          <p>
            Am schnellsten erreichst du uns per E-Mail unter:<br />
            <a
              href="mailto:info@lobbium.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              info@lobbium.com
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Keine Kontaktformulare, kein Spam – du schreibst uns direkt.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            Kooperationen & Partnerschaften
          </h2>
          <p>
            Für Affiliate-Partnerschaften, Sponsoring, exklusive Platzierungen
            oder individuelle Family-Kampagnen melde dich mit dem Betreff{" "}
            <strong>„Kooperation Lobbium“</strong> per E-Mail.
          </p>
        </div>
      </section>
    </>
  );
}