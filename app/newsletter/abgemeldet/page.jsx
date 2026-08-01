import Link from "next/link";
import Lobbi from "../../../components/Lobbi";

export const metadata = { title: "Abgemeldet | Lobbium" };

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-24">
      <Lobbi size={110} />
      <h1 className="mt-4 text-2xl font-bold text-[#0F1C3F]">Du bist abgemeldet.</h1>
      <p className="mt-2 text-gray-500 max-w-md">
        Schade, dass du gehst! Du erhältst ab sofort keinen Familien-Spar-Brief mehr.
        Falls es ein Versehen war, kannst du dich jederzeit wieder anmelden.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href="/newsletter" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition">Wieder anmelden</Link>
        <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl transition">Zur Startseite</Link>
      </div>
    </div>
  );
}
