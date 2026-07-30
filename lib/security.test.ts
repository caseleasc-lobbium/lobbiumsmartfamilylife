import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  sanitizeInput,
  rateLimit,
  validateAdminAuth,
  getClientIp,
  SECURITY_HEADERS,
} from "./security";

describe("isValidEmail", () => {
  it("akzeptiert gültige Adressen", () => {
    expect(isValidEmail("info@lobbium.com")).toBe(true);
    expect(isValidEmail("a.b-c@sub.domain.de")).toBe(true);
  });
  it("lehnt ungültige Adressen ab", () => {
    expect(isValidEmail("keine-email")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a @b.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("sanitizeInput", () => {
  it("maskiert HTML-/Script-Zeichen", () => {
    expect(sanitizeInput('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;&#x2F;script&gt;"
    );
  });
});

describe("rateLimit", () => {
  it("erlaubt bis zum Limit und blockt danach mit retryAfter", () => {
    const id = "test-" + Math.round(performance.now());
    expect(rateLimit(id, 2, 60000).allowed).toBe(true);
    expect(rateLimit(id, 2, 60000).allowed).toBe(true);
    const blocked = rateLimit(id, 2, 60000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });
});

describe("validateAdminAuth", () => {
  const store = (val?: string) => ({
    get: (_name: string) => (val === undefined ? undefined : { value: val }),
  });
  it("akzeptiert nur den korrekten Cookie-Wert", () => {
    expect(validateAdminAuth(store("true"))).toBe(true);
    expect(validateAdminAuth(store("false"))).toBe(false);
    expect(validateAdminAuth(store())).toBe(false);
  });
});

describe("getClientIp", () => {
  const req = (headers: Record<string, string>) => ({
    headers: { get: (n: string) => headers[n] ?? null },
  });
  it("liest x-forwarded-for (erste IP) bevorzugt", () => {
    expect(getClientIp(req({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });
  it("fällt auf x-real-ip und dann unknown zurück", () => {
    expect(getClientIp(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(getClientIp(req({}))).toBe("unknown");
  });
});

describe("SECURITY_HEADERS", () => {
  it("enthält die wichtigsten Schutz-Header", () => {
    expect(SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
  });
});
