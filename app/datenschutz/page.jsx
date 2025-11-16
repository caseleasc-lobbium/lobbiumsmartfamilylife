import Head from "next/head";

export default function Datenschutz() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung – Smart Family Life by Lobbium</title>
        <meta
          name="description"
          content="Datenschutzerklärung für Smart Family Life by Lobbium – Informationen gemäß DSGVO."
        />
      </Head>

      {/* Hero-Bereich */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-28 md:py-32 px-6 mt-20 border-b border-[#e1e5ee]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-4">
          🔒 Datenschutzerklärung
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Der Schutz deiner persönlichen Daten ist uns wichtig.
        </p>
      </section>

      {/* Datenschutz Inhalt */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-gray-700 leading-relaxed space-y-8">

        {/* Verantwortliche Stelle */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            1. Verantwortliche Stelle
          </h2>
          <p>
            <strong>Lobbium – Smart Family Life</strong><br />
            Verantwortlich: <strong>Sergino Elisha</strong><br />
            (Adresse folgt)<br />
            Deutschland<br />
            E-Mail: info@lobbium.com
          </p>
        </div>

        {/* Datenerhebung */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            2. Erhebung und Speicherung personenbezogener Daten
          </h2>
          <p>
            Wir erheben personenbezogene Daten, wenn du unseren Newsletter abonnierst
            oder uns über ein Formular kontaktierst.
            <br /><br />
            Zu den verarbeiteten Daten gehören u. a.:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>E-Mail-Adresse</li>
            <li>Name (falls angegeben)</li>
            <li>Nutzungsdaten wie Seitenaufrufe (anonymisiert)</li>
          </ul>
          <p className="mt-3">
            Die Daten werden ausschließlich zur Bereitstellung unserer Dienste,
            für den Versand unseres Newsletters oder zur Bearbeitung deiner Anfrage genutzt.
          </p>
        </div>

        {/* Weitergabe */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            3. Weitergabe von Daten
          </h2>
          <p>
            Eine Weitergabe deiner Daten an Dritte erfolgt nur, wenn:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>du ausdrücklich eingewilligt hast,</li>
            <li>dies zur Vertragserfüllung notwendig ist,</li>
            <li>oder wir gesetzlich dazu verpflichtet sind.</li>
          </ul>
        </div>

        {/* Cookies */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            4. Cookies & Analyse-Tools
          </h2>
          <p>
            Unsere Website verwendet Cookies, um Funktionen bereitzustellen und die Nutzung
            zu verbessern. Du kannst Cookies jederzeit in deinem Browser deaktivieren.
            <br /><br />
            Zusätzlich setzen wir datenschutzkonforme Analyseverfahren ein, die anonymisierte
            Statistiken erfassen.
          </p>
        </div>

        {/* Rechte */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1c3d6c] mb-3">
            5. Deine Rechte
          </h2>
          <p>
            Du hast jederzeit das Recht auf:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Auskunft über gespeicherte Daten</li>
            <li>Berichtigung falscher Daten</li>
            <li>Löschung deiner Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Widerruf deiner Einwilligungen</li>
          </ul>

          <p className="mt-3">
            Wende dich dafür bitte an: <strong>info@lobbium.com</strong>.
          </p>
        </div>

        <p className="text-sm text-gray-500 pt-8">
          Quelle: e-recht24.de (angepasst)
        </p>
      </section>
    </>
  );
}