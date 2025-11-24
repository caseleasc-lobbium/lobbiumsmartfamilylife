import SectionHero from "../../components/SectionHero";

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Datenschutzerklärung"
        subtitle="Transparente Informationen zum Datenschutz gemäß DSGVO."
      />

      <div className="max-w-3xl px-6 pb-24 text-gray-700 leading-relaxed">

        {/* ========================================================= */}
        {/* 1. Verantwortlicher */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">1. Verantwortlicher</h2>
        <p>
          Lobbium – Smart Family Life<br/>
          Inhaber: Sergino Elisha <br/>
          Alexanderstraße 152<br/>
          70180 Stuttgart<br/>
          Deutschland<br/><br/>
          E-Mail: info@lobbium.com
        </p>

        {/* ========================================================= */}
        {/* 2. Erhebung und Speicherung personenbezogener Daten */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">
          2. Erhebung und Speicherung personenbezogener Daten
        </h2>
        <p>
          Lobbium speichert grundsätzlich nur die Daten, die für die Nutzung der
          Webseite notwendig sind. Wir verwenden <strong>keine Cookies zu Marketing-
          oder Trackingzwecken</strong>. Es werden ausschließlich technisch notwendige Cookies eingesetzt.
        </p>

        {/* ========================================================= */}
        {/* 3. Cookies – inklusive COOKIE-BANNER-ABSCHNITT */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">3. Cookies</h2>
        <p>
          Diese Webseite verwendet nur <strong>technisch notwendige Cookies</strong>, die für den
          Betrieb der Seite erforderlich sind (z. B. Session-Cookies, Spracheinstellungen
          oder Sicherheitsfunktionen).
        </p>
        <p className="mt-3">
          Da <strong>keine Analyse-, Marketing- oder Tracking-Cookies</strong> verwendet werden,
          ist nach Art. 6 Abs. 1 lit. f DSGVO <strong>kein Einwilligungs-Banner</strong> erforderlich.
        </p>

        <h3 className="font-semibold text-lg mt-4 mb-2">
          Cookie-Hinweis (Banner)
        </h3>
        <p>
          Beim ersten Besuch wird ein kurzer Hinweis eingeblendet, der erklärt,
          dass ausschließlich technisch notwendige Cookies verwendet werden.
          Durch das Weitersurfen akzeptieren Besucher diese automatisch.
        </p>
        <p className="mt-2">
          Dies entspricht den Vorgaben der DSGVO und der aktuellen Rechtsprechung,
          sofern keine Marketing- oder Tracking-Dienste eingesetzt werden
          (Google Analytics, Meta Pixel, etc.).
        </p>

        {/* ========================================================= */}
        {/* 4. Newsletter */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">4. Newsletter</h2>
        <p>
          Wenn Nutzer unseren Newsletter abonnieren, erfolgt die Verarbeitung
          ausschließlich auf Grundlage der Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
          Wir verwenden ein <strong>Double-Opt-In-Verfahren</strong>.  
        </p>
        <p className="mt-3">
          Zum Versand nutzen wir den Dienstleister <strong>Brevo (Sendinblue)</strong>,
          der vollständig DSGVO-konform ist und seine Server in der EU betreibt.
        </p>
        <p className="mt-3">
          Die Einwilligung kann jederzeit widerrufen werden, ein Link befindet sich
          in jedem Newsletter.
        </p>

        {/* ========================================================= */}
        {/* 5. Affiliate-Links */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">5. Affiliate-Links</h2>
        <p>
          Lobbium nutzt Affiliate-Links. Beim Klick werden wir technisch erfasst,
          jedoch erfolgt keine Profilbildung oder Tracking über unsere Webseite.
        </p>
        <p className="mt-2">
          Die Weiterleitung erfolgt anonymisiert über unseren eigenen Server,
          ohne personenbezogene Daten zu speichern.
        </p>

        {/* ========================================================= */}
        {/* 6. Server-Logs */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">6. Server-Logfiles</h2>
        <p>
          Beim Aufruf der Seite erhebt unser Hostinganbieter (Vercel)
          automatisch technische Daten (z. B. IP, Zeit, Browser).
          Diese Daten dienen ausschließlich der Sicherheit und Stabilität
          der Plattform und werden nicht ausgewertet.
        </p>

        {/* ========================================================= */}
        {/* 7. Rechte der Nutzer */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">7. Rechte der Nutzer</h2>
        <p>
          Nutzer haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung und Widerruf ihrer Einwilligung.
        </p>

        {/* ========================================================= */}
        {/* 8. Schluss */}
        {/* ========================================================= */}
        <h2 className="font-semibold text-xl mt-6 mb-3">8. Aktualität</h2>
        <p>
          Diese Datenschutzerklärung wird regelmäßig aktualisiert, um
          Gesetzesänderungen und technische Entwicklungen zu berücksichtigen.
        </p>
      </div>
    </div>
  );
}