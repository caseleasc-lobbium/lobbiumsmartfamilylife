"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Magic Link wird verifiziert...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Ungültiger Magic Link - Token fehlt");
      return;
    }

    // Token verifizieren
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/admin/verify-magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage("✅ Login erfolgreich! Weiterleitung zum Dashboard...");
          
          // Auth in localStorage speichern (für Frontend-Checks)
          localStorage.setItem("lobbiumAdminAuth", "true");
          localStorage.setItem("lobbiumLoginTime", Date.now().toString());

          // Weiterleitung nach 1 Sekunde
          setTimeout(() => {
            router.push("/admin");
          }, 1000);
        } else {
          setStatus("error");
          setMessage(`❌ ${data.error || "Verifizierung fehlgeschlagen"}`);
        }
      } catch (err) {
        console.error("Verify Error:", err);
        setStatus("error");
        setMessage("❌ Serverfehler bei der Verifizierung");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {status === "verifying" && (
          <>
            <div className="mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Verifizierung läuft...
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              Login erfolgreich!
            </h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              Verifizierung fehlgeschlagen
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => router.push("/admin/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Zurück zum Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyMagicLink() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Lade...
          </h1>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
