"use client";

import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";
import { LanguageProvider } from "../components/i18n/LanguageProvider";
import { trackingAllowed } from "../utils/consent";
import "../styles/globals.css";

// Strukturierte Daten (Schema.org) für Suchmaschinen & Rich Results
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Lobbium — Smart Family Life",
      url: "https://www.lobbium.com",
      logo: "https://www.lobbium.com/logo.png",
    },
    {
      "@type": "WebSite",
      name: "Smart Family Life by Lobbium",
      url: "https://www.lobbium.com",
      inLanguage: "de-DE",
      description:
        "Clever sparen, den Alltag organisieren und Kinder spielerisch fördern — kompakt, modern & täglich aktualisiert.",
    },
  ],
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Admin-Bereich erkennen (aber NICHT /admin/login!)
  const isAdminArea =
    pathname?.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/admin/login/");

  // Öffentliche Seiten → TopNav + Footer
  const isFrameVisible = !isAdminArea && !pathname?.startsWith("/admin/login");

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* Strukturierte Daten für Suchmaschinen */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />

        <LanguageProvider>

        {/* Public TopNav */}
        {isFrameVisible && <TopNav />}

        {/* Admin-Topbar – NICHT auf /admin/login */}
        {isAdminArea && (
          <header className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm fixed top-0 left-0 z-40">
            <h1 className="text-lg font-semibold text-blue-700">
              Lobbium Admin
            </h1>
            <a
              href="/admin/logout"
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </a>
          </header>
        )}

        {/* Inhalt */}
        <main
          className={isFrameVisible ? "pt-28" : isAdminArea ? "pt-20" : ""}
          style={{ minHeight: "80vh" }}
        >
          {children}
        </main>

        {/* Footer + Cookies */}
        {isFrameVisible && <CookieConsent />}
        {isFrameVisible && <SiteFooter />}

        </LanguageProvider>

        {/* Analytics */}
        {trackingAllowed() && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  gtag('consent', 'update', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted'
                  });
                `,
              }}
            />
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-XXXXXXX');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}