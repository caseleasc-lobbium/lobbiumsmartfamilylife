"use client";

import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";
import { trackingAllowed } from "../utils/consent";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // 🔥 Login-Seite komplett blank – ohne Navigation, ohne Footer
  const isLoginPage = pathname === "/admin/login";

  // 🔥 Interne Admin-Bereiche (aber nicht Login)
  const isInternalAdmin = pathname.startsWith("/admin") && !isLoginPage;

  // Navigation & Footer nur für öffentliche Seiten
  const showFrame = !isInternalAdmin && !isLoginPage;
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
        {/* 🔵 Keine TopNav für Login */}
        {showFrame && <TopNav />}

        {/* Seite */}
        <main className={showFrame ? "pt-28" : ""} style={{ minHeight: "80vh" }}>
          {children}
        </main>

        {/* 🔵 Cookie Banner */}
        {showFooter && <CookieConsent />}

        {/* 🔵 Footer */}
        {showFooter && <SiteFooter />}

        {/* Google Analytics */}
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