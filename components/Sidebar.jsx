import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white flex flex-col py-6 px-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Menü</h2>
      <Link href="/admin" className="hover:bg-blue-600 rounded p-2">
        Dashboard
      </Link>
      <Link href="#" className="hover:bg-blue-600 rounded p-2">
        Benutzer
      </Link>
      <Link href="#" className="hover:bg-blue-600 rounded p-2">
        Einstellungen
      </Link>
    </aside>
  );
}