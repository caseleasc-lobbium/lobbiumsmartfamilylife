export default function SiteFooter() {
  return (
    <footer className="w-full bg-white py-6 sm:py-8 mt-10 sm:mt-16">
      <div
        className="
          max-w-6xl mx-auto 
          px-4 sm:px-6 
          grid grid-cols-1 md:grid-cols-3 
          gap-6 sm:gap-10 
          items-center md:items-end
        "
      >

        {/* BLOCK LINKS – Logo + Copyright */}
        <div className="flex flex-col md:items-start items-center order-1">
          <img
            src="https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo%20.PNG"
            alt="Lobbium Logo"
            className="w-20 sm:w-24 h-auto mb-1 md:mb-0"
          />

          {/* Mobile versteckt, Desktop sichtbar */}
          <p className="hidden md:block text-gray-500 text-sm mt-1">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>

        {/* MITTLERE NAVIGATION – Desktop genau mittig */}
        <div className="flex justify-center order-3 md:order-2">
          <div className="flex gap-2 sm:gap-3">
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

        {/* NEWSLETTER BUTTON – Rechts auf Copyright Höhe */}
        <div className="flex md:justify-end justify-center order-2 md:order-3 md:mt-0 mt-2">
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

        {/* MOBILE COPYRIGHT – bleibt wie vorher */}
        <div className="md:hidden w-full text-center mt-3 order-4">
          <p className="text-gray-500 text-xs">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>
      </div>
    </footer>
  );
}