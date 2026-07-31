// Zentrales, best-effort Fehler-Logging nach Supabase (wirft nie).
import { getSupabase } from "@/lib/supabase";

export async function logError(
  source: string,
  message: unknown,
  context?: unknown
): Promise<void> {
  try {
    const supabase = getSupabase();
    let safeContext: unknown = null;
    if (context !== undefined) {
      try {
        safeContext = JSON.parse(JSON.stringify(context));
      } catch {
        safeContext = { note: "context nicht serialisierbar" };
      }
    }
    await supabase.from("error_logs").insert({
      level: "error",
      source: String(source).slice(0, 200),
      message: String(
        message instanceof Error ? message.message : message
      ).slice(0, 2000),
      context: safeContext,
    });
  } catch {
    // Logging darf niemals den Request beeinflussen.
  }
}
