export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-2 sm:py-6 mt-4 sm:mt-10">
      <div
        className="
          max-w-6xl mx-auto 
          px-4 sm:px-6 
          grid grid-cols-1 md:grid-cols-3 
          gap-4 sm:gap-10 
          items-center md:items-end
        "
      >

        {/* BLOCK LINKS – Logo + Copyright */}
        <div className="flex flex-col md:items-start items-center order-1">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Lobbium Logo"
            className="w-20 sm:w-24 h-auto mb-0 md:mb-0"
          />

          {/* Mobile versteckt, Desktop sichtbar */}
          <p className="hidden md:block text-gray-500 text-sm mt-1">
            © {new Date().getFullYear()} Lobbium – Smart Family Life
          </p>
        </div>

        {/* MITTLERE NAVIGATION – Desktop genau mittig */}
        <div className="flex justify-center order-3 md:order-2">
          <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
            <a
              href="/blog"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Ratgeber
            </a>
            <a
              href="/tools"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Tools
            </a>
            <a
              href="/deals"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Deals
            </a>
            <a
              href="/vergleich"
              className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm text-gray-700"
            >
              Vergleiche
            </a>
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

        {/* NEWSLETTER BUTTON – Mobile symmetrisch */}
        <div className="flex md:justify-end justify-center order-2 md:order-3 mt-1 md:mt-0">
          <a
            href="/newsletter"
            className="
              inline-block 
              px-5 py-2 sm:px-6 sm:py-3 
              rounded-xl 
              bg-blue-600 text-white 
              font-medium 
              text-sm sm:text-base shadow 
              hover:shadow-lg 
              transition
            "
          >
            Newsletter
          </a>
        </div>

        {/* MOBILE COPYRIGHT */}
        <div className="md:hidden w-full text-center mt-2 order-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Lobbium – Smart Family Life
          </p>
        </div>
      </div>
    </footer>
  );
}