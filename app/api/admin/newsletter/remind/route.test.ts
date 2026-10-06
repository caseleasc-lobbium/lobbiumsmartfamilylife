import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorized: vi.fn(),
  confirmedFilter: vi.fn(),
  rateLimitDb: vi.fn(),
  sendTemplateEmail: vi.fn(),
  tokenUpdate: vi.fn(),
  queueInsert: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("@/lib/security", async () => {
  const actual = await vi.importActual<typeof import("@/lib/security")>(
    "@/lib/security"
  );
  return { ...actual, validateAdminAuth: mocks.authorized };
});

vi.mock("@/lib/ratelimit", () => ({ rateLimitDb: mocks.rateLimitDb }));

vi.mock("@/lib/encryption", () => ({
  decrypt: (value: string) => value.replace("encrypted:", ""),
}));

vi.mock("@/lib/email", () => ({
  sendTemplateEmail: mocks.sendTemplateEmail,
}));

vi.mock("@/lib/errorlog", () => ({ logError: mocks.logError }));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => {
    const queryResult = {
      data: [
        {
          id: 3,
          email: "encrypted:pending@example.com",
          name: "encrypted:Pat",
          locale: "de",
        },
      ],
      error: null,
    };
    const updateBuilder = {
      eq: mocks.tokenUpdate.mockResolvedValue({ error: null }),
    };
    const subscriberBuilder: Record<string, unknown> = {
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve(queryResult).then(resolve),
    };
    subscriberBuilder.select = vi.fn(() => subscriberBuilder);
    subscriberBuilder.eq = mocks.confirmedFilter.mockImplementation(() => subscriberBuilder);
    subscriberBuilder.or = vi.fn(() => subscriberBuilder);
    subscriberBuilder.in = vi.fn(() => subscriberBuilder);
    subscriberBuilder.update = vi.fn(() => updateBuilder);

    const queueUpdateBuilder = { eq: vi.fn().mockResolvedValue({ error: null }) };
    const queueInsertBuilder = {
      select: vi.fn(() => queueInsertBuilder),
      maybeSingle: vi.fn().mockResolvedValue({ data: { id: 9 }, error: null }),
    };
    const queueBuilder = {
      insert: mocks.queueInsert.mockImplementation(() => queueInsertBuilder),
      update: vi.fn(() => queueUpdateBuilder),
    };

    return {
      from: (table: string) =>
        table === "newsletter_queue" ? queueBuilder : subscriberBuilder,
    };
  },
}));

import { POST } from "./route";

function request(body: unknown) {
  return new Request("https://www.lobbium.com/api/admin/newsletter/remind", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("admin newsletter confirmation reminders", () => {
  beforeEach(() => {
    mocks.authorized.mockReset().mockReturnValue(true);
    mocks.rateLimitDb.mockReset().mockResolvedValue({ allowed: true });
    mocks.sendTemplateEmail.mockReset().mockResolvedValue({ success: true });
    mocks.confirmedFilter.mockClear();
    mocks.tokenUpdate.mockClear();
    mocks.queueInsert.mockClear();
    mocks.logError.mockReset();
  });

  it("sends only a confirmation reminder to pending subscribers", async () => {
    const response = await POST(request({ all: true }) as never);

    expect(response.status).toBe(200);
    expect(mocks.confirmedFilter).toHaveBeenCalledWith("confirmed", false);
    expect(mocks.sendTemplateEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "pending@example.com",
        templateId: 2,
        params: expect.objectContaining({
          CONFIRM_URL: expect.stringContaining("/api/newsletter/confirm?token="),
        }),
      })
    );
    expect(mocks.queueInsert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "pending" })
    );
    await expect(response.json()).resolves.toEqual({
      ok: true,
      recipients: 1,
      sent: 1,
      failed: 0,
    });
  });

  it("blocks the same reminder action for 24 hours", async () => {
    mocks.rateLimitDb.mockResolvedValue({ allowed: false, retryAfter: 3600 });
    const response = await POST(request({ all: true }) as never);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("3600");
    expect(mocks.sendTemplateEmail).not.toHaveBeenCalled();
  });
});
