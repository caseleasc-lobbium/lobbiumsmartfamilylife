import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail, sendTemplateEmail } from "./email";

describe("Brevo email client", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-api-key";
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not call Brevo when the API key is missing", async () => {
    delete process.env.BREVO_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendEmail({ to: "user@example.com", subject: "Test", html: "<p>Test</p>" })
    ).resolves.toMatchObject({ success: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the expected payload to Brevo", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ messageId: "message-123" }), { status: 201 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendEmail({
      to: "user@example.com",
      subject: "Subject",
      html: "<p>Hello</p>",
      replyTo: { name: "Support", email: "reply@example.com" },
      tags: ["transactional"],
      headers: { "List-Unsubscribe": "<https://example.com/unsubscribe>" },
    });

    expect(result).toEqual({ success: true, messageId: "message-123" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options.method).toBe("POST");
    expect(options.headers["api-key"]).toBe("test-api-key");
    expect(JSON.parse(options.body)).toMatchObject({
      sender: { name: "Lobbium", email: "info@lobbium.com" },
      to: [{ email: "user@example.com" }],
      subject: "Subject",
      htmlContent: "<p>Hello</p>",
      replyTo: { name: "Support", email: "reply@example.com" },
      tags: ["transactional"],
      headers: { "List-Unsubscribe": "<https://example.com/unsubscribe>" },
    });
  });

  it("returns Brevo API errors without reporting success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ code: "invalid_parameter", message: "Bad payload" }), {
          status: 400,
        })
      )
    );

    await expect(
      sendEmail({ to: "user@example.com", subject: "Test", html: "<p>Test</p>" })
    ).resolves.toMatchObject({
      success: false,
      status: 400,
      code: "invalid_parameter",
      error: "Bad payload",
    });
  });

  it("renders localized local templates before sending", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ messageId: "message-456" }), { status: 201 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendTemplateEmail({
      to: "user@example.com",
      templateId: 1,
      params: {
        NAME: "Alex",
        LOCALE: "en",
        CONFIRM_URL: "https://www.lobbium.com/api/newsletter/confirm?token=test-token",
      },
    });

    expect(result.success).toBe(true);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.subject).toBe("Please confirm your Lobbium subscription");
    expect(payload.htmlContent).toContain("Confirm subscription");
    expect(payload.tags).toEqual(["lobbium-template-1", "locale-en"]);
  });
});
