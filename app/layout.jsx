"use client";

import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";
import { trackingAllowed } from "../utils/consent";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminLogin = pathname === "/admin/login";          
  const isAdminPage = pathname?.startsWith("/admin") && !isAdminLogin;

  const isFrameVisible = !isAdminPage && !isAdminLogin;    

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >

        {/* 🔵 Frontend Navigation */}
        {isFrameVisible && <TopNav />}

        {/* 🔴 Admin-Topbar – ABER NICHT für /admin/login */}
        {isAdminPage && (
          <header className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm fixed top-0 left-0 z-40">
            <h1 className="text-lg font-semibold text-blue-700">Lobbium Admin</h1>

            <a
              href="/admin/logout"
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </a>
          </header>
        )}

        {/* 🧱 Hauptinhalt */}
        <main
          className={isFrameVisible ? "pt-28" : isAdminPage ? "pt-20" : ""}
          style={{ minHeight: "80vh" }}
        >
          {children}
        </main>

        {/* 🔵 DSGVO Cookie Banner */}
        {isFrameVisible && <CookieConsent />}

        {/* 🔵 Footer */}
        {isFrameVisible && <SiteFooter />}

        {/* 🔵 Google Analytics */}
        {trackingAllowed() && !isAdminLogin && !isAdminPage && (
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