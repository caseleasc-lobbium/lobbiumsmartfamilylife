import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  eq: vi.fn(),
  logError: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/lib/encryption", () => ({
  emailHash: (email: string) => `hash:${email.toLowerCase()}`,
}));

vi.mock("@/lib/errorlog", () => ({ logError: mocks.logError }));

vi.mock("@/lib/supabase", () => {
  const builder = {
    update: mocks.update,
    eq: mocks.eq,
  };
  mocks.update.mockImplementation(() => builder);
  return {
    getSupabase: () => ({ from: vi.fn(() => builder) }),
  };
});

import { POST } from "./route";

function webhookRequest(payload: unknown, secret = "webhook-secret") {
  return new Request("https://www.lobbium.com/api/webhooks/brevo", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-lobbium-webhook-secret": secret,
    },
    body: JSON.stringify(payload),
  });
}

describe("Brevo webhook", () => {
  beforeEach(() => {
    process.env.BREVO_WEBHOOK_SECRET = "webhook-secret";
    mocks.eq.mockReset().mockResolvedValue({ error: null });
    mocks.logError.mockReset();
    mocks.update.mockClear();
  });

  it("rejects requests with the wrong secret", async () => {
    const response = await POST(
      webhookRequest({ event: "delivered" }, "wrong-secret") as never
    );

    expect(response.status).toBe(401);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("returns a service error when the webhook secret is missing", async () => {
    delete process.env.BREVO_WEBHOOK_SECRET;

    const response = await POST(
      webhookRequest({ event: "delivered" }) as never
    );

    expect(response.status).toBe(503);
    expect(mocks.logError).toHaveBeenCalledWith(
      "brevo.webhook-config",
      "BREVO_WEBHOOK_SECRET is missing",
      {}
    );
  });

  it("rejects malformed JSON without reporting an internal failure", async () => {
    const request = new Request(
      "https://www.lobbium.com/api/webhooks/brevo",
      {
        method: "POST",
        headers: { "x-lobbium-webhook-secret": "webhook-secret" },
        body: "{not-json",
      }
    );

    const response = await POST(request as never);

    expect(response.status).toBe(400);
    expect(mocks.logError).not.toHaveBeenCalled();
  });

  it("accepts successful delivery events without storing PII", async () => {
    const response = await POST(
      webhookRequest({
        event: "delivered",
        email: "User@Example.com",
        "message-id": "message-1",
      }) as never
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: 1 });
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.logError).not.toHaveBeenCalled();
  });

  it("suppresses hard-bounced subscribers and logs only a hash", async () => {
    const response = await POST(
      webhookRequest({
        event: "hardBounce",
        email: "User@Example.com",
        "message-id": "message-2",
      }) as never
    );

    expect(response.status).toBe(200);
    expect(mocks.update).toHaveBeenCalledWith({ unsubscribed: true });
    expect(mocks.eq).toHaveBeenCalledWith(
      "email_hash",
      "hash:user@example.com"
    );
    expect(mocks.logError).toHaveBeenCalledWith(
      "brevo.webhook",
      "Transactional email event: hardBounce",
      expect.objectContaining({
        emailHash: "hash:user@example.com",
        messageId: "message-2",
      })
    );
    expect(JSON.stringify(mocks.logError.mock.calls)).not.toContain(
      "User@Example.com"
    );
  });

  it("handles batched events", async () => {
    const response = await POST(
      webhookRequest([{ event: "sent" }, { event: "delivered" }]) as never
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: 2 });
  });
});
