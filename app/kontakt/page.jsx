import SectionHero from "../components/SectionHero";

export default function KontaktPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 🔵 Hero – gleiches Design wie Newsletter / Rubriken */}
      <SectionHero
        title="Kontakt"
        subtitle="Du hast Fragen zu Lobbium oder möchtest mit uns zusammenarbeiten? 
                 Hier erreichst du uns direkt – ohne Umwege, ohne Kontaktformular."
      />

      {/* 📩 Inhalt */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-gray-700 leading-relaxed space-y-8">
        {/* Ansprechpartner */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F1C3F] mb-3">
            Ansprechpartner
          </h2>
          <p>
            <strong>Lobbium – Smart Family Life</strong><br />
            Inhaber: Sergino Elisha<br />
            Deutschland
          </p>
        </div>

        {/* E-Mail */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F1C3F] mb-3">
            E-Mail
          </h2>
          <p>
            Am schnellsten erreichst du uns per E-Mail unter:
          </p>
          <p className="mt-2">
            <a
              href="mailto:info@lobbium.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              info@lobbium.com
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Kein Kontaktformular, kein Spam – du schreibst uns direkt und persönlich.
          </p>
        </div>

        {/* Kooperationen */}
        <div>
          <h2 className="text-2xl font-semibold text-[#0F1C3F] mb-3">
            Kooperationen & Partnerschaften
          </h2>
          <p>
            Für Affiliate-Partnerschaften, Sponsoring, exklusive Platzierungen
            oder individuelle Family-Kampagnen melde dich mit dem Betreff{" "}
            <strong>„Kooperation Lobbium“</strong> per E-Mail.
          </p>
        </div>
      </section>
    </div>
  );
}