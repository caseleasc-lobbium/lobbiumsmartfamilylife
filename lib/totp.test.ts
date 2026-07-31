import { describe, it, expect } from "vitest";
import { generateTotpSecret, generateTotp, verifyTotp } from "./totp";

describe("TOTP (2FA)", () => {
  it("erzeugt ein gültiges Base32-Secret", () => {
    const s = generateTotpSecret();
    expect(s).toMatch(/^[A-Z2-7]+$/);
    expect(s.length).toBeGreaterThanOrEqual(16);
  });

  it("verifiziert den aktuellen Code (Roundtrip)", () => {
    const s = generateTotpSecret();
    expect(verifyTotp(s, generateTotp(s))) .toBe(true);
  });

  it("lehnt falsche/ungültige Codes ab", () => {
    const s = generateTotpSecret();
    expect(verifyTotp(s, "000000")).toBe(false);
    expect(verifyTotp(s, "12345")).toBe(false); // zu kurz
    expect(verifyTotp(s, "abcdef")).toBe(false);
    expect(verifyTotp(s, "")).toBe(false);
    expect(verifyTotp("", "123456")).toBe(false);
  });
});
