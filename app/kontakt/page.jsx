import SectionHero from "../../components/SectionHero";

export default function KontaktPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Kontakt"
        subtitle="Wir freuen uns über deine Nachricht — schnell, direkt & unkompliziert."
      />

      <div className="max-w-xl px-6 pb-24 text-gray-700 leading-relaxed">

        <p className="mb-6">
          Du kannst uns jederzeit erreichen — wir antworten so schnell wie möglich.
        </p>

        <h2 className="font-semibold text-xl mt-6 mb-3">E-Mail</h2>
        <p>support@lobbium.com</p>

        <h2 className="font-semibold text-xl mt-6 mb-3">Adresse</h2>
        <p>
          Lobbium — Smart Family Life<br/>
          Deutschland (genaue Adresse folgt)
        </p>

      </div>
    </div>
  );
}