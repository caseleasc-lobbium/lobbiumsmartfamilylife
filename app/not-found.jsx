import Link from "next/link";
import Lobbi from "../components/Lobbi";

export const metadata = { title: "Seite nicht gefunden | Lobbium" };

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-24">
      <Lobbi size={140} />
      <p className="mt-4 text-5xl font-extrabold text-[#0F1C3F]">404</p>
      <h1 className="mt-2 text-xl font-bold text-[#0F1C3F]">Hoppla – hier ist nichts.</h1>
      <p className="mt-2 text-gray-500 max-w-md">
        Diese Seite gibt es nicht (mehr). Lobbi bringt dich zurück – zu Ratgeber, Tools und Empfehlungen für den Familienalltag.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition">Zur Startseite</Link>
        <Link href="/blog" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl transition">Ratgeber</Link>
        <Link href="/tools" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl transition">Tools</Link>
      </div>
    </div>
  );
}
