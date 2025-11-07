"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("lobbium_admin_loggedin");
    if (!loggedIn) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8faff",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
}