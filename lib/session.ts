// Signierte, ablaufende Admin-Session-Tokens (HMAC-SHA256).
// Format: "<payloadBase64url>.<hmacBase64url>", payload = { exp: number }.
// Verhindert Fälschen des Auth-Cookies (früher statischer Wert "true").
import crypto from "crypto";

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ENCRYPTION_KEY ||
    "dev-only-insecure-secret-change-me"
  );
}

export function createSessionToken(ttlMs: number = DEFAULT_TTL_MS): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs })).toString(
    "base64url"
  );
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  try {
    if (!token || typeof token !== "string") return false;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;

    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("base64url");

    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof decoded.exp === "number" && Date.now() < decoded.exp;
  } catch {
    return false;
  }
}
