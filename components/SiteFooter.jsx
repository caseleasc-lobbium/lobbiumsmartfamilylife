export default function SiteFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 items-center">

        {/* 1 — Logo + Copyright (LINKS) */}
        <div className="text-left">
          <img
            src="https://pvmehyinzttpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo.png"
            alt="Lobbium Logo"
            className="w-20 h-auto mb-3"
          />
          <p className="text-gray-500 text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* 3 — Footer Navigation (MITTE) */}
        <div className="flex justify-center">
          <nav className="flex gap-6 text-gray-600 text-sm">
            <a href="/impressum" className="hover:text-gray-900 transition">
              Impressum
            </a>
            <a href="/datenschutz" className="hover:text-gray-900 transition">
              Datenschutz
            </a>
            <a href="/kontakt" className="hover:text-gray-900 transition">
              Kontakt
            </a>
          </nav>
        </div>

        {/* 2 — Newsletter (RECHTS) */}
        <div className="text-center md:text-right mt-8 md:mt-0">
          <h3 className="font-semibold text-gray-800 mb-4">Newsletter</h3>

          <a
            href="/newsletter"
            className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:shadow-lg transition"
          >
            Newsletter
          </a>

          <p className="text-gray-500 text-sm mt-2">
            Keine Werbung. Kein Spam. Jederzeit kündbar.
          </p>
        </div>

      </div>
    </footer>
  );
}