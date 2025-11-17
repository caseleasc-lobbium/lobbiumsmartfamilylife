"use client";

import "../styles/admin.css"; // optional für später

export default function AdminLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-white min-h-screen">
        {/* Admin Header */}
        <header className="w-full flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Lobbium Admin
          </h1>

          <a
            href="/admin/logout"
            className="text-red-600 font-medium hover:underline"
          >
            Logout
          </a>
        </header>

        {/* Admin Inhalt */}
        <main className="w-full flex justify-center py-14">
          {children}
        </main>
      </body>
    </html>
  );
}