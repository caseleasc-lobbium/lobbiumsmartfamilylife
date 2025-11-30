import { createClient } from "@supabase/supabase-js";

// Zentrale Supabase Client-Erstellung mit Fehlerbehandlung
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase ENV Variables nicht gesetzt - verwende Dummy Client für Build");
    // Dummy Client für Build-Zeit, damit der Build nicht fehlschlägt
    return createClient(
      supabaseUrl || "https://dummy.supabase.co",
      supabaseKey || "dummy-key-for-build"
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Export für direkte Verwendung (wird zur Laufzeit korrekt initialisiert)
let supabaseInstance = null;

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = getSupabaseClient();
  }
  return supabaseInstance;
}
