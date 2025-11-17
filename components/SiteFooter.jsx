export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">

        {/* LOGO + COPYRIGHT */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo.png"
            alt="Lobbium Logo"
            className="w-20 h-auto mb-3"
          />
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* FOOTER NAVIGATION */}
        <nav className="flex items-center gap-4">
          <a
            href="/impressum"
            className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
          >
            Impressum
          </a>
          <a
            href="/datenschutz"
            className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
          >
            Datenschutz
          </a>
          <a
            href="/kontakt"
            className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
          >
            Kontakt
          </a>
        </nav>

        {/* NEWSLETTER BUTTON */}
        <div className="flex flex-col items-center md:items-end">
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