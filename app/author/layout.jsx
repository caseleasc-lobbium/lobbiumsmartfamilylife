"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthorSidebar from "@/components/AuthorSidebar";

export default function AuthorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/author/login";

  useEffect(() => {
    const token = localStorage.getItem("authorToken");
    if (!token && !isLoginPage) {
      router.push("/author/login");
    }
  }, [pathname, router, isLoginPage]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {isLoginPage ? (
        <main className="flex justify-center items-center h-screen">
          {children}
        </main>
      ) : (
        <div className="flex min-h-screen">
          <AuthorSidebar />
          <main className="flex-1 p-10">
            <div className="bg-white shadow-md rounded-2xl p-6">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
}