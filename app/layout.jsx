"use client";

import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";
import { trackingAllowed } from "../utils/consent";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  const showFrame = !isInternal; // TopNav + Footer
  const showFooter = showFrame;

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {/* 🔵 Immer sichtbare Hauptnavigation (oben fixiert) */}
        {showFrame && <TopNav />}

        {/* 🔵 Seiteninhalt */}
        <main className="pt-28" style={{ minHeight: "80vh" }}>
          {children}
        </main>

        {/* 🔵 DSGVO Cookie Banner */}
        {showFooter && <CookieConsent />}


        {/* 🔵 Google Analytics nur bei Consent */}
        {trackingAllowed() && (
          <>
            {/* Google Consent Mode */}
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

            {/* Google Analytics Script */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
            ></script>

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