export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">

        {/* LEFT: Logo + Copyright */}
        <div className="flex items-center gap-4">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Lobbium Logo"
            className="w-12 h-auto"
          />

          <p className="text-gray-500 text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* CENTER: Impressum, Datenschutz, Kontakt */}
        <div className="flex items-center gap-3">
          <a
            href="/impressum"
            className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition"
          >
            Impressum
          </a>

          <a
            href="/datenschutz"
            className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition"
          >
            Datenschutz
          </a>

          <a
            href="/kontakt"
            className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 hover:bg-gray-200 transition"
          >
            Kontakt
          </a>
        </div>

        {/* RIGHT: Newsletter Button */}
        <a
          href="/newsletter"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:shadow-lg transition"
        >
          Newsletter
        </a>

      </div>
    </footer>
  );
}