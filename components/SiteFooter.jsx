export default function SiteFooter() {
  const pages = [
    { label: "Impressum", url: "/impressum" },
    { label: "Datenschutz", url: "/datenschutz" },
    { label: "Kontakt", url: "/kontakt" },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

        {/* Logo & Copyright (1 → links) */}
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

        {/* Footer Tabs (2 → zentriert) */}
        <div className="flex justify-center">
          <nav className="flex gap-3">
            {pages.map((p) => (
              <a
                key={p.url}
                href={p.url}
                className="
                  px-5 py-2 rounded-xl text-sm font-medium
                  bg-gray-100 text-gray-700
                  hover:bg-gray-200 transition
                  active:bg-blue-600 active:text-white
                "
              >
                {p.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Newsletter Button (4 → rechts) */}
        <div className="text-right">
          <a
            href="/newsletter"
            className="
              inline-block px-6 py-3 rounded-xl
              bg-blue-600 text-white font-medium
              shadow hover:shadow-lg transition
            "
          >
            Newsletter
          </a>
        </div>

      </div>
    </footer>
  );
}