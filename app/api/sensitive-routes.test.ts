import { describe, expect, it } from "vitest";
import { GET as getNewsletter } from "./newsletter/route";
import * as subscribersRoute from "./subscribers/route";
import { GET as getContact } from "./contact/route";
import {
  DELETE as deleteLegacyMessage,
  GET as getLegacyMessages,
} from "./admin/messages/route";
import { GET as sendWeeklyNewsletter } from "./admin/newsletter/send-weekly/route";
import { GET as getAffiliateStats } from "./affiliates/stats/route";
import { GET as getAffiliateAnalytics } from "./affiliates/analytics/route";
import { GET as getAffiliateCategoryStats } from "./affiliates/category-stats/route";
import { POST as postAffiliateRevenue } from "./affiliates/revenue/route";
import { GET as checkAuth } from "./check-auth/route";
import { GET as getSettings, POST as postSettings } from "./settings/route";
import * as legacyBlogRoute from "./blog/route";
import * as legacyPostsRoute from "./posts/route";
import { createSessionToken } from "@/lib/session";

function anonymousRequest(path: string) {
  return {
    url: `https://www.lobbium.com${path}`,
    cookies: { get: () => undefined },
    headers: { get: () => null },
  } as never;
}

async function expectPrivateUnauthorized(response: Response) {
  expect(response.status).toBe(401);
  expect(response.headers.get("cache-control")).toContain("private");
  expect(response.headers.get("cache-control")).toContain("no-store");
  await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
}

describe("sensitive API routes", () => {
  it.each([
    ["newsletter", getNewsletter, "/api/newsletter"],
    ["subscribers", subscribersRoute.GET, "/api/subscribers"],
    ["contact", getContact, "/api/contact"],
    ["legacy messages", getLegacyMessages, "/api/admin/messages"],
    ["weekly newsletter", sendWeeklyNewsletter, "/api/admin/newsletter/send-weekly"],
    ["affiliate stats", getAffiliateStats, "/api/affiliates/stats"],
    ["affiliate analytics", getAffiliateAnalytics, "/api/affiliates/analytics"],
    [
      "affiliate category stats",
      getAffiliateCategoryStats,
      "/api/affiliates/category-stats",
    ],
    ["settings", getSettings, "/api/settings"],
  ])("rejects anonymous access to %s", async (_name, handler, path) => {
    await expectPrivateUnauthorized(await handler(anonymousRequest(path)));
  });

  it("rejects anonymous settings writes", async () => {
    await expectPrivateUnauthorized(
      await postSettings(anonymousRequest("/api/settings"))
    );
  });

  it("does not expose the legacy subscriber creation bypass", () => {
    expect("POST" in subscribersRoute).toBe(false);
  });

  it("rejects the old unsigned admin cookie", async () => {
    const response = await checkAuth({
      cookies: { get: () => ({ value: "true" }) },
    } as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ authorized: false });
  });

  it("rejects the former hardcoded affiliate revenue key", async () => {
    delete process.env.AFFILIATE_REVENUE_SECRET;
    const response = await postAffiliateRevenue({
      headers: {
        get: (name: string) =>
          name === "authorization"
            ? "Bearer lobbium_secure_key_2025_V6.1"
            : null,
      },
      json: async () => ({}),
    } as never);

    expect(response.status).toBe(401);
  });

  it("accepts only the configured affiliate revenue key", async () => {
    process.env.AFFILIATE_REVENUE_SECRET = "revenue-test-secret";
    const response = await postAffiliateRevenue({
      headers: {
        get: (name: string) =>
          name === "authorization" ? "Bearer revenue-test-secret" : null,
      },
      json: async () => ({}),
    } as never);
    delete process.env.AFFILIATE_REVENUE_SECRET;

    expect(response.status).toBe(400);
  });

  it("rejects path traversal in legacy message deletion", async () => {
    process.env.ADMIN_SESSION_SECRET = "session-test-secret";
    const token = createSessionToken();
    const response = await deleteLegacyMessage({
      cookies: {
        get: () => ({ value: token }),
      },
      json: async () => ({ filename: "../../package.json" }),
    } as never);
    delete process.env.ADMIN_SESSION_SECRET;

    expect(response.status).toBe(400);
  });

  it("keeps legacy file-backed content APIs read-only", () => {
    expect("POST" in legacyBlogRoute).toBe(false);
    expect("DELETE" in legacyBlogRoute).toBe(false);
    expect("POST" in legacyPostsRoute).toBe(false);
    expect("DELETE" in legacyPostsRoute).toBe(false);
  });
});
