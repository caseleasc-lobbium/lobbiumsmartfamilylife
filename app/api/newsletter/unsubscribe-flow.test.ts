import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  backupInsert: vi.fn(),
  deleteEq: vi.fn(),
  logError: vi.fn(),
  maybeSingle: vi.fn(),
}));

vi.mock("@/lib/errorlog", () => ({ logError: mocks.logError }));

vi.mock("@/lib/supabase", () => {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: mocks.maybeSingle,
  };
  const subscribers = {
    select: query.select,
    delete: vi.fn(() => ({ eq: mocks.deleteEq })),
  };
  const unsubscribed = { insert: mocks.backupInsert };

  return {
    getSupabase: () => ({
      from: (table: string) =>
        table === "newsletter_unsubscribed" ? unsubscribed : subscribers,
    }),
  };
});

import { POST } from "./unsubscribe/route";

const URL =
  "https://www.lobbium.com/api/newsletter/unsubscribe?token=abcdefghijklmnopqrstuvwxyz123456";

describe("newsletter one-click unsubscribe", () => {
  beforeEach(() => {
    mocks.backupInsert.mockReset().mockResolvedValue({ error: null });
    mocks.deleteEq.mockReset().mockResolvedValue({ error: null });
    mocks.logError.mockReset();
    mocks.maybeSingle.mockReset().mockResolvedValue({
      data: {
        id: "subscriber-1",
        email: "encrypted-email",
        name: "encrypted-name",
        locale: "de",
      },
      error: null,
    });
  });

  it("backs up and removes a subscriber", async () => {
    const response = await POST(new Request(URL, { method: "POST" }) as never);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.backupInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "encrypted-email",
        name: "encrypted-name",
        locale: "de",
      })
    );
    expect(mocks.deleteEq).toHaveBeenCalledWith("id", "subscriber-1");
  });

  it("does not claim success when deleting the subscriber fails", async () => {
    mocks.deleteEq.mockResolvedValue({ error: { message: "delete failed" } });

    const response = await POST(new Request(URL, { method: "POST" }) as never);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Abmeldung konnte nicht abgeschlossen werden",
    });
    expect(mocks.logError).toHaveBeenCalledWith(
      "newsletter.unsubscribe",
      { message: "delete failed" },
      {}
    );
  });
});
