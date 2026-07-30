// Passwort-Hashing mit Node crypto (scrypt) – keine externe Dependency.
// Format des gespeicherten Hashes: "scrypt:<saltHex>:<hashHex>"
// (Separator ":" statt "$", damit .env-Parser das $ nicht als Variable interpretiert.)
import crypto from "crypto";

const KEYLEN = 64;

// Erzeugt einen speicherbaren Hash-String für ein Passwort.
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(String(password), salt, KEYLEN);
  return `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;
}

// Timing-sicherer Vergleich eines Klartext-Passworts gegen einen gespeicherten Hash.
export function verifyPassword(
  password: string,
  stored: string | null | undefined
): boolean {
  try {
    if (!stored || typeof stored !== "string") return false;
    const [scheme, saltHex, hashHex] = stored.split(":");
    if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = crypto.scryptSync(String(password), salt, expected.length || KEYLEN);

    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
