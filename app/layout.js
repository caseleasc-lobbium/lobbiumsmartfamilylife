import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-white">
        <SiteHeader />
          <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}