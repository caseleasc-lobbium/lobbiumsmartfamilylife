// Durables Rate-Limiting über Supabase (übersteht Serverless-Neustarts).
// Fällt bei DB-Problemen auf das In-Memory-Limit zurück.
import { getSupabase } from "@/lib/supabase";
import { rateLimit as rateLimitMemory } from "@/lib/security";
import type { RateLimitResult } from "@/lib/security";

interface RpcRow {
  allowed: boolean;
  remaining: number;
  retry_after: number;
}

export async function rateLimitDb(
  key: string,
  max = 5,
  windowSeconds = 60
): Promise<RateLimitResult> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });

    if (error || !Array.isArray(data) || !data[0]) {
      return rateLimitMemory(key, max, windowSeconds * 1000);
    }

    const row = data[0] as RpcRow;
    return {
      allowed: row.allowed,
      remaining: row.remaining,
      retryAfter: row.retry_after,
    };
  } catch {
    return rateLimitMemory(key, max, windowSeconds * 1000);
  }
}
