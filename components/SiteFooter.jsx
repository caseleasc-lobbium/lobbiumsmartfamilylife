export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Copyright – Links */}
        <div className="flex flex-col items-start">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Lobbium Logo"
            className="w-20 h-auto mb-3"
          />
          <p className="text-gray-500 text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* Footer Tabs – Mitte */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-3">
            <a
              href="/impressum"
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700"
            >
              Datenschutz
            </a>
            <a
              href="/kontakt"
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-700"
            >
              Kontakt
            </a>
          </div>
        </div>

        {/* Newsletter Button – Rechts */}
        <div className="flex flex-col items-end">
          <a
            href="/newsletter"
            className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:shadow-lg transition"
          >
            Newsletter
          </a>
        </div>
      </div>
    </footer>
  );
}