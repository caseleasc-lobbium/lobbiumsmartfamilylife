export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Logo + Copyright (Links) */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Smart Family Life Logo"
            className="w-24 h-auto mb-2"   // <-- 10% größer (statt w-20)
          />
          <p className="text-gray-500 text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* Mittlere Links in grauen Tabs */}
        <div className="flex gap-3">
          <a
            href="/impressum"
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Impressum
          </a>

          <a
            href="/datenschutz"
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Datenschutz
          </a>

          <a
            href="/kontakt"
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Kontakt
          </a>
        </div>

        {/* Newsletter Button rechts */}
        <div>
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