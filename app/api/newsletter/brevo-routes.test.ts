import { afterEach, describe, expect, it } from "vitest";
import { POST as canonicalPost } from "./route";
import { POST as legacyPost } from "./subscribe/route";
import { GET as unsubscribeGet, POST as unsubscribePost } from "./unsubscribe/route";

describe("newsletter route compatibility", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("routes the legacy subscribe endpoint through the canonical handler", () => {
    expect(legacyPost).toBe(canonicalPost);
  });

  it("rejects an invalid one-click token without touching subscriber data", async () => {
    const response = await unsubscribePost(
      new Request("https://www.lobbium.com/api/newsletter/unsubscribe?token=short") as never
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual({ error: "Ungueltiger Abmelde-Link" });
  });

  it("keeps invalid legacy links on the existing confirmation page", async () => {
    const response = await unsubscribeGet(
      new Request("https://www.lobbium.com/api/newsletter/unsubscribe") as never
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.lobbium.com/newsletter/abgemeldet"
    );
  });
});
