export default function SiteFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="/" className="hover:text-gray-900">Home</a></li>
            <li><a href="/finanzen-spartipps" className="hover:text-gray-900">Finanzen & Spartipps</a></li>
            <li><a href="/familienleben" className="hover:text-gray-900">Familienleben</a></li>
            <li><a href="/kinder-bildung" className="hover:text-gray-900">Kinder & Bildung</a></li>
            <li><a href="/lifestyle" className="hover:text-gray-900">Lifestyle</a></li>
            <li><a href="/impressum" className="hover:text-gray-900">Impressum</a></li>
            <li><a href="/datenschutz" className="hover:text-gray-900">Datenschutz</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
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

        {/* Logo & Copyright */}
        <div className="text-center md:text-right">
          <img
            src="https://pvmehyinzttpqasothxro.supabase.co/storage/v1/object/public/public-assets/logo/logo.png"
            alt="Lobbium Logo"
            className="w-20 h-auto mx-auto md:ml-auto mb-3"
          />
          <p className="text-gray-500 text-sm">
            © 2025 Lobbium – Smart Family Life
          </p>
        </div>
      </div>
    </footer>
  );
}