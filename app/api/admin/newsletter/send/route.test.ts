import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorized: vi.fn(),
  confirmedFilter: vi.fn(),
  sendEmail: vi.fn(),
  logError: vi.fn(),
}));

vi.mock("@/lib/security", async () => {
  const actual = await vi.importActual<typeof import("@/lib/security")>(
    "@/lib/security"
  );
  return { ...actual, validateAdminAuth: mocks.authorized };
});

vi.mock("@/lib/encryption", () => ({
  decrypt: (value: string) => value.replace("encrypted:", ""),
}));

vi.mock("@/lib/email", () => ({ sendEmail: mocks.sendEmail }));

vi.mock("@/lib/newsletter", () => ({
  assembleIssue: vi.fn(),
  buildWeeklyHtml: vi.fn(() => "<p>weekly</p>"),
  buildAdminMessageHtml: vi.fn(() => "<p>custom</p>"),
}));

vi.mock("@/lib/errorlog", () => ({ logError: mocks.logError }));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => {
    const result = {
      data: [
        {
          id: 1,
          email: "encrypted:user@example.com",
          name: "encrypted:Alex",
          unsub_token: "unsubscribe-token",
          locale: "de",
        },
      ],
      error: null,
    };
    const builder: Record<string, unknown> = {};
    builder.select = vi.fn(() => builder);
    builder.in = vi.fn(() => builder);
    builder.eq = mocks.confirmedFilter.mockImplementation(() => builder);
    builder.or = vi.fn(() => result);
    return { from: vi.fn(() => builder) };
  },
}));

import { POST } from "./route";

function request(body: unknown) {
  return new Request("https://www.lobbium.com/api/admin/newsletter/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("admin newsletter send", () => {
  beforeEach(() => {
    mocks.authorized.mockReset().mockReturnValue(true);
    mocks.confirmedFilter.mockClear();
    mocks.sendEmail.mockReset().mockResolvedValue({ success: true });
    mocks.logError.mockReset();
  });

  it("requires an authenticated admin", async () => {
    mocks.authorized.mockReturnValue(false);
    const response = await POST(request({ ids: [1], mode: "newsletter" }) as never);
    expect(response.status).toBe(401);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("sends custom mail only through the confirmed subscriber query", async () => {
    const response = await POST(
      request({
        ids: [1, 2],
        mode: "custom",
        subject: "Wichtige Information",
        message: "Hallo aus dem Admin-Bereich",
      }) as never
    );

    expect(response.status).toBe(200);
    expect(mocks.confirmedFilter).toHaveBeenCalledWith("confirmed", true);
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Wichtige Information",
        tags: expect.arrayContaining(["admin-message"]),
      })
    );
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ sent: 1, skipped: 1, failed: 0 })
    );
  });

  it("rejects custom mail without subject or message", async () => {
    const response = await POST(
      request({ ids: [1], mode: "custom", subject: "", message: "" }) as never
    );
    expect(response.status).toBe(400);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });
});
