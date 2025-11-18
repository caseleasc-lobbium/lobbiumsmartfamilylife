export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-6 sm:py-8 mt-10 sm:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 items-end">

        {/* Logo & Copyright */}
        <div className="flex flex-col items-start text-center sm:text-left">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Lobbium Logo"
            className="w-20 sm:w-24 h-auto mb-2 mx-auto sm:mx-0"
          />
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* Footer Tabs */}
        <div className="flex items-center sm:items-end justify-center">
          <div className="flex gap-2 sm:gap-3 pb-1">
            <a
              href="/impressum"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Datenschutz
            </a>
            <a
              href="/kontakt"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Kontakt
            </a>
          </div>
        </div>

        {/* Newsletter Button */}
        <div className="flex items-center sm:items-end justify-center sm:justify-end pb-1 mt-2 sm:mt-0">
          <a
            href="/newsletter"
            className="inline-block px-5 py-2 sm:px-6 sm:py-3 rounded-xl bg-blue-600 text-white font-medium text-sm sm:text-base shadow hover:shadow-lg transition"
          >
            Newsletter
          </a>
        </div>

      </div>
    </footer>
  );
}