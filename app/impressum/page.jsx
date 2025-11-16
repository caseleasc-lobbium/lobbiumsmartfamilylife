import SectionHero from "../../components/SectionHero";

export default function ImpressumPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Impressum"
        subtitle="Rechtliche Angaben gemäß § 5 TMG — klar, transparent & zuverlässig."
      />

      <div className="max-w-3xl px-6 pb-24 text-gray-700 leading-relaxed">

        <h2 className="font-semibold text-xl mt-6 mb-3">Betreiber der Webseite</h2>
        <p>
          Lobbium – Smart Family Life<br/>
          Sergino Elisha<br/>
          Adresse folgt…<br/>
          Deutschland
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Kontakt</h2>
        <p>
          E-Mail: info@lobbium.com<br/>
          Telefon: folgt…
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Verantwortlich nach § 55 Abs. 2 RStV</h2>
        <p>Sergino Elisha</p>

      </div>
    </div>
  );
}