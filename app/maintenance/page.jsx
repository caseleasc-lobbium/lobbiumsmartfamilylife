"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MaintenancePage() {
  const [daysLeft, setDaysLeft] = useState(5);

  useEffect(() => {
    // Countdown simulieren (z. B. 5 Tage bis Launch)
    const timer = setInterval(() => {
      setDaysLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000 * 60 * 60 * 24);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#f0f4ff] via-[#e8eefc] to-[#ffffff] text-center p-6">
      <Image
        src="/logo.png"
        alt="Lobbium Logo"
        width={90}
        height={90}
        className="mb-4 opacity-90"
      />
      <h1 className="text-3xl md:text-5xl font-bold text-[#1c3d6c] mb-3">
        🛠️ Lobbium wird aktualisiert
      </h1>
      <p className="text-gray-700 max-w-xl mx-auto leading-relaxed mb-6">
        Unsere Plattform wird gerade verbessert, um dir noch mehr smarte
        Inhalte zu Finanzen, Familie und Lifestyle zu bieten.
      </p>
      <p className="text-[#2b6cb0] text-lg font-semibold">
        Relaunch in <span className="text-[#1c3d6c]">{daysLeft}</span> Tagen
      </p>
      <div className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Lobbium – Smart Family Life
      </div>
    </div>
  );
}