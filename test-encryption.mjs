import { encrypt, decrypt } from "./lib/encryption.js";

const text = "test@lobbium.com";
const enc = encrypt(text);
console.log("🔒 Encrypted:", enc);
console.log("🔓 Decrypted:", decrypt(enc));