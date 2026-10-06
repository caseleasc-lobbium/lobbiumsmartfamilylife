import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendTemplateEmail: vi.fn(),
  logError: vi.fn(),
  subscriberInsert: vi.fn(),
  queueInsert: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendTemplateEmail: mocks.sendTemplateEmail,
}));

vi.mock("@/lib/encryption", () => ({
  encrypt: (value: string) => `encrypted:${value}`,
  emailHash: (value: string) => `hash:${value}`,
}));

vi.mock("@/lib/ratelimit", () => ({
  rateLimitDb: vi.fn().mockResolvedValue({ allowed: true }),
}));

vi.mock("@/lib/errorlog", () => ({
  logError: mocks.logError,
}));

vi.mock("@/lib/supabase", () => {
  const subscriberBuilder: Record<string, unknown> = {};
  subscriberBuilder.select = vi.fn(() => subscriberBuilder);
  subscriberBuilder.eq = vi.fn(() => subscriberBuilder);
  subscriberBuilder.limit = vi.fn(() => subscriberBuilder);
  subscriberBuilder.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  subscriberBuilder.insert = mocks.subscriberInsert;

  const queueBuilder: Record<string, unknown> = {};
  queueBuilder.insert = mocks.queueInsert.mockImplementation(() => queueBuilder);
  queueBuilder.select = vi.fn(() => queueBuilder);
  queueBuilder.maybeSingle = vi.fn().mockResolvedValue({ data: { id: "queue-1" }, error: null });
  queueBuilder.update = vi.fn(() => queueBuilder);
  queueBuilder.eq = vi.fn().mockResolvedValue({ error: null });

  return {
    getSupabase: () => ({
      from: (table: string) =>
        table === "newsletter_queue" ? queueBuilder : subscriberBuilder,
    }),
  };
});

import { POST } from "./route";

function subscribeRequest() {
  return new Request("https://www.lobbium.com/api/newsletter", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify({
      email: "user@example.com",
      name: "Alex",
      locale: "de",
    }),
  });
}

describe("newsletter Brevo subscription flow", () => {
  beforeEach(() => {
    mocks.sendTemplateEmail.mockReset();
    mocks.logError.mockReset();
    mocks.subscriberInsert.mockReset().mockResolvedValue({ error: null });
    mocks.queueInsert.mockClear();
  });

  it("does not report success when Brevo rejects the confirmation email", async () => {
    mocks.sendTemplateEmail.mockResolvedValue({
      success: false,
      error: "Brevo rejected the message",
    });

    const response = await POST(subscribeRequest() as never);

    expect(response.status).toBe(502);
    expect(response.headers.get("cache-control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual({
      error: "Bestaetigungs-E-Mail konnte nicht gesendet werden",
    });
    expect(mocks.logError).toHaveBeenCalledWith(
      "newsletter.brevo-confirm",
      "Brevo rejected the message",
      {}
    );
  });

  it("uses long random tokens and queues a successful confirmation", async () => {
    mocks.sendTemplateEmail.mockResolvedValue({ success: true, messageId: "message-1" });

    const response = await POST(subscribeRequest() as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });

    const subscriber = mocks.subscriberInsert.mock.calls[0][0];
    expect(subscriber.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(subscriber.unsub_token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const queued = mocks.queueInsert.mock.calls[0][0];
    expect(queued.status).toBe("pending");
    expect(mocks.sendTemplateEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        templateId: 1,
        params: expect.objectContaining({ LOCALE: "de" }),
      })
    );
  });
});
