import SectionHero from "../../components/SectionHero";

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Datenschutz"
        subtitle="Wir schützen deine Daten — transparent, sicher & DSGVO-konform."
      />

      <div className="max-w-3xl px-6 pb-24 text-gray-700 leading-relaxed">

        <h2 className="font-semibold text-xl mt-6 mb-3">1. Allgemeines</h2>
        <p>
          Wir nehmen den Schutz persönlicher Daten sehr ernst. Lobbium verarbeitet
          personenbezogene Daten ausschließlich im Einklang mit der DSGVO.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">2. Welche Daten wir speichern</h2>
        <ul className="list-disc ml-6">
          <li>E-Mail-Adresse bei Newsletter-Anmeldung</li>
          <li>Klickstatistiken auf Affiliate-Links (anonymisiert)</li>
          <li>Technische Nutzungsdaten (Serverlogs)</li>
        </ul>

        <h2 className="font-semibold text-xl mt-6 mb-3">3. Cookies</h2>
        <p>
          Wir verwenden nur technisch notwendige Cookies und Cookies zur Messung
          anonymisierter Affiliate-Klicks. Du kannst Cookies jederzeit ablehnen.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">4. Deine Rechte</h2>
        <ul className="list-disc ml-6">
          <li>Auskunft über gespeicherte Daten</li>
          <li>Löschung deiner Daten</li>
          <li>Widerruf der Einwilligung</li>
        </ul>

      </div>
    </div>
  );
}