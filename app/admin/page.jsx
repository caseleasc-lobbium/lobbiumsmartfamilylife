"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) router.push("/admin/login");
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Benutzer" value="1,234" color="bg-blue-100" />
          <StatCard title="Verkäufe" value="€9,870" color="bg-green-100" />
          <StatCard title="Besuche" value="12,980" color="bg-yellow-100" />
        </main>
      </div>
    </div>
  );
}