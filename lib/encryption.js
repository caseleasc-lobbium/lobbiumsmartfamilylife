import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto
  .createHash("sha256")
  .update(String(process.env.ENCRYPTION_KEY))
  .digest("base64")
  .substr(0, 32);

export function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Deterministischer, nicht umkehrbarer Hash einer E-Mail (für Dubletten-Prüfung
// ohne Klartext-Speicherung). HMAC mit ENCRYPTION_KEY als Schlüssel.
export function emailHash(email) {
  if (!email) return null;
  return crypto
    .createHmac("sha256", String(process.env.ENCRYPTION_KEY))
    .update(email.trim().toLowerCase())
    .digest("hex");
}

export function decrypt(encrypted) {
  try {
    if (!encrypted || !encrypted.includes(":")) return encrypted;
    const [ivHex, encryptedText] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("❌ Decryption error:", err.message);
    return "[Decryption failed]";
  }
}