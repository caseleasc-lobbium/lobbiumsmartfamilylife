import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

describe("session tokens (HMAC)", () => {
  it("erstellt und verifiziert ein gültiges Token", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("lehnt leere/ungültige/verfälschte Tokens ab", () => {
    expect(verifySessionToken(null)).toBe(false);
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken("kaputt")).toBe(false);
    expect(verifySessionToken("true")).toBe(false); // alter statischer Wert ist jetzt ungültig
    const token = createSessionToken();
    expect(verifySessionToken(token + "x")).toBe(false); // manipulierte Signatur
  });

  it("lehnt abgelaufene Tokens ab", () => {
    const expired = createSessionToken(-1000);
    expect(verifySessionToken(expired)).toBe(false);
  });
});
