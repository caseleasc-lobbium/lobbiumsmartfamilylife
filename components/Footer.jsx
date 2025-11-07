import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white via-[#f3f5f8] to-[#e9edf2] text-gray-700 pt-16 pb-10 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Spalte 1 */}
        <div>
          <div className="flex items-center mb-3">
            <Image
              src="/logo.png"
              alt="Smart Family Life Logo"
              width={70}
              height={70}
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Smart Family Life by Lobbium</strong> – Spartipps, Alltag &
            Bildungsideen für Familien. Dein Begleiter für Organisation,
            Sparen und entspanntes Familienleben.
          </p>
        </div>

        {/* Spalte 2 */}
        <div>
          <h4 className="text-[#1c3d6c] font-semibold mb-3">Themen</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/finanzen-spartipps" className="hover:text-blue-600">
                Finanzen & Spartipps
              </Link>
            </li>
            <li>
              <Link href="/familienleben" className="hover:text-blue-600">
                Familienleben & Alltag
              </Link>
            </li>
            <li>
              <Link href="/kinder-bildung" className="hover:text-blue-600">
                Kinder & Bildung
              </Link>
            </li>
            <li>
              <Link href="/lifestyle" className="hover:text-blue-600">
                Lifestyle
              </Link>
            </li>
          </ul>
        </div>

        {/* Spalte 3 */}
        <div>
          <h4 className="text-[#1c3d6c] font-semibold mb-3">Rechtliches</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/impressum" className="hover:text-blue-600">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-blue-600">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/kontakt" className="hover:text-blue-600">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Trennlinie */}
      <div className="max-w-6xl mx-auto border-t border-gray-200 mt-10 pt-6 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Smart Family Life by Lobbium. Alle Rechte
          vorbehalten.
        </p>
      </div>
    </footer>
  );
}
