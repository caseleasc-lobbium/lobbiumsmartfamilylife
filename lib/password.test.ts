import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password hashing (scrypt)", () => {
  const pw = "lobbium2!#025tNLmWwui9";

  it("erzeugt einen Hash im Format scrypt:salt:hash", () => {
    const h = hashPassword(pw);
    const parts = h.split(":");
    expect(parts[0]).toBe("scrypt");
    expect(parts).toHaveLength(3);
    expect(parts[1]).toMatch(/^[0-9a-f]+$/);
    expect(parts[2]).toMatch(/^[0-9a-f]+$/);
  });

  it("verifiziert das korrekte Passwort", () => {
    const h = hashPassword(pw);
    expect(verifyPassword(pw, h)).toBe(true);
  });

  it("lehnt ein falsches Passwort ab", () => {
    const h = hashPassword(pw);
    expect(verifyPassword("falsch", h)).toBe(false);
  });

  it("nutzt einen zufälligen Salt (zwei Hashes unterscheiden sich)", () => {
    expect(hashPassword(pw)).not.toBe(hashPassword(pw));
  });

  it("lehnt leere/ungültige/verfälschte Hashes sicher ab", () => {
    expect(verifyPassword(pw, null)).toBe(false);
    expect(verifyPassword(pw, undefined)).toBe(false);
    expect(verifyPassword(pw, "")).toBe(false);
    expect(verifyPassword(pw, "kaputt")).toBe(false);
    expect(verifyPassword(pw, "scrypt:only-salt")).toBe(false);
    const h = hashPassword(pw);
    expect(verifyPassword(pw, h + "00")).toBe(false); // manipuliert
  });
});
