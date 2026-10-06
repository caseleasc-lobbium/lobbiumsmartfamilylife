import { describe, expect, it } from "vitest";
import { GET as getNewsletter } from "./newsletter/route";
import * as subscribersRoute from "./subscribers/route";
import { GET as getContact } from "./contact/route";
import { GET as sendWeeklyNewsletter } from "./admin/newsletter/send-weekly/route";
import { GET as getAffiliateStats } from "./affiliates/stats/route";
import { GET as getAffiliateAnalytics } from "./affiliates/analytics/route";
import { GET as getAffiliateCategoryStats } from "./affiliates/category-stats/route";
import { GET as getSettings, POST as postSettings } from "./settings/route";

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
});
