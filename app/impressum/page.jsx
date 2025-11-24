import SectionHero from "../../components/SectionHero";

export default function ImpressumPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Impressum"
        subtitle="Rechtliche Angaben gemäß § 5 TMG — klar, transparent & zuverlässig."
      />

      <div className="max-w-3xl px-6 pb-24 text-gray-700 leading-relaxed">

        <h2 className="font-semibold text-xl mt-6 mb-3">Impressum gemäß § 5 TMG</h2>
        <p>
          <strong>Lobbium – Smart Family Life</strong><br/>
          Inhaber: Sergino Elisha<br/>
          Straße: Alexanderstrasse 152 <br/>
          PLZ / Ort: 70180, Stuttgart <br/>
          Deutschland<br/>
          E-Mail: info@lobbium.com<br/>
          Webseite: https://lobbium.com
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
        </h2>
        <p>
          Sergino Elisha<br/>
          Adresse wie oben
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Umsatzsteuer / Wirtschaft</h2>
        <p>
          Da Lobbium keine eigenen physischen Produkte verkauft, sondern Inhalte und 
          Affiliate-Empfehlungen bereitstellt, ist derzeit keine 
          Umsatzsteuer-Identifikationsnummer erforderlich. 
          Eine Ergänzung ist jederzeit möglich, sobald notwendig.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. 
          Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte 
          übernehmen wir jedoch keine Gewähr. Als Diensteanbieter sind wir 
          gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten verantwortlich.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Haftung für Links</h2>
        <p>
          Diese Website enthält Links zu externen Webseiten Dritter 
          (Affiliate-Links und normale Links), auf deren Inhalte wir keinen Einfluss haben.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter 
          oder Betreiber verantwortlich. Trotz sorgfältiger Kontrolle übernehmen 
          wir keine Haftung für externe Inhalte.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Urheberrecht</h2>
        <p>
          Alle Inhalte, Texte, Bilder, Grafiken sowie das Design von Lobbium.com 
          sind urheberrechtlich geschützt. Eine Verwendung außerhalb dieser Website 
          ist ohne schriftliche Zustimmung nicht gestattet.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Online-Streitbeilegung</h2>
        <p>
          Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
          <a 
            href="https://ec.europa.eu/consumers/odr/" 
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          <br/>
          Wir sind nicht verpflichtet und nicht bereit, 
          an einem Streitbeilegungsverfahren teilzunehmen.
        </p>

      </div>
    </div>
  );
}