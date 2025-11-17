import SectionHero from "../../components/SectionHero";

export default function KontaktPage() {
  return (
    <div className="flex flex-col items-center w-full">

      {/* Hero – Einheitlich wie alle anderen Seiten */}
      <SectionHero
        title="Kontakt"
        subtitle="Du hast Fragen zu Lobbium oder möchtest mit uns zusammenarbeiten?"
      />

      {/* Inhalt */}
      <div className="max-w-xl px-6 pb-24 text-gray-700 leading-relaxed">

        <p className="mb-8">
          Wir sind jederzeit für dich erreichbar — direkt, persönlich & ohne Wartezeiten.
        </p>

        {/* Ansprechpartner */}
        <h2 className="font-semibold text-xl mt-6 mb-3 text-[#1c3d6c]">
          Ansprechpartner
        </h2>
        <p className="mb-6">
          <strong>Lobbium – Smart Family Life</strong><br />
          Inhaber: Sergino Elisha<br />
          Deutschland
        </p>

        {/* E-Mail */}
        <h2 className="font-semibold text-xl mt-6 mb-3 text-[#1c3d6c]">
          E-Mail
        </h2>
        <p>
          Am schnellsten erreichst du uns unter:<br />
          <a
            href="mailto:info@lobbium.com"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            info@lobbium.com
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          Keine Formulare, kein Spam — du schreibst uns direkt.
        </p>

        {/* Kooperationen */}
        <h2 className="font-semibold text-xl mt-6 mb-3 text-[#1c3d6c]">
          Kooperationen & Partnerschaften
        </h2>
        <p>
          Für Affiliate-Partnerschaften, Sponsoring oder exklusive Platzierungen
          sende uns bitte eine E-Mail mit dem Betreff{" "}
          <strong>„Kooperation Lobbium“</strong>.
        </p>

      </div>
    </div>
  );
}