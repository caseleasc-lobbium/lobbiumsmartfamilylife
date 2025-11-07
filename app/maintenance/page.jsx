"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Maintenance() {
  // Countdown Ziel-Datum (z. B. Launch am 15. Dezember 2025)
  const launchDate = new Date("2025-12-15T00:00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = launchDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / (1000 * 60)) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f7f9fc] to-[#eaf2ff] text-center px-6">
      {/* Logo */}
      <div className="mb-6 animate-fade-in">
        <Image
          src="/logo.png"
          alt="Lobbium Smart Family Life Logo"
          width={100}
          height={100}
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* Titel */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#1c3d6c] mb-3">
        🚧 Lobbium Smart Family Life
      </h1>

      {/* Beschreibung */}
      <p className="text-gray-700 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
        Unsere Website wird gerade liebevoll überarbeitet, um dir bald noch mehr
        smarte Ideen rund um Familie, Alltag & Finanzen zu bieten.
      </p>

      {/* Countdown */}
      <div className="flex flex-wrap justify-center gap-6 text-blue-700 font-semibold text-lg md:text-xl mb-12">
        {[
          { label: "Tage", value: timeLeft.days },
          { label: "Stunden", value: timeLeft.hours },
          { label: "Minuten", value: timeLeft.mins },
          { label: "Sekunden", value: timeLeft.secs },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-blue-600">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-sm uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <p className="text-gray-800 font-medium mb-4">
          Sei dabei, wenn wir live gehen – trage dich hier ein:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Danke! Wir benachrichtigen dich zum Launch 💙");
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="Deine E-Mail-Adresse"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Benachrichtigen
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs">
        © {new Date().getFullYear()} Lobbium Smart Family Life. Alle Rechte vorbehalten.
      </footer>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
      `}</style>
    </main>
  );
}
