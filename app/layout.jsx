"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import CookieConsent from "../components/CookieConsent";
import { trackingAllowed } from "../utils/consent";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminArea =
    pathname?.startsWith("/admin") && pathname !== "/admin/login" && !pathname.startsWith("/admin/login/");
  const isFrameVisible = !isAdminArea && !pathname?.startsWith("/admin/login");

  return (
    <html lang="de">
      <Head>
        <meta name="verify-admitad" content="5026684ff6" />
      </Head>

      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {isFrameVisible && <TopNav />}

        {isAdminArea && (
          <header className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm fixed top-0 left-0 z-40">
            <h1 className="text-lg font-semibold text-blue-700">Lobbium Admin</h1>
            <a href="/admin/logout" className="text-red-600 hover:text-red-800 font-medium">
              Logout
            </a>
          </header>
        )}

        <main
          className={isFrameVisible ? "pt-28" : isAdminArea ? "pt-20" : ""}
          style={{ minHeight: "80vh" }}
        >
          {children}
        </main>

        {isFrameVisible && <CookieConsent />}
        {isFrameVisible && <SiteFooter />}

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
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" />
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