import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authorized: vi.fn(),
  deletedIds: vi.fn(),
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

vi.mock("@/lib/errorlog", () => ({ logError: mocks.logError }));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => {
    let deleting = false;
    const builder: Record<string, unknown> = {};
    builder.select = vi.fn((columns: string) => {
      if (deleting && columns === "id") {
        return Promise.resolve({ data: [{ id: 1 }, { id: 2 }], error: null });
      }
      return builder;
    });
    builder.order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          email: "encrypted:user@example.com",
          name: "encrypted:Alex",
          confirmed: true,
        },
      ],
      error: null,
    });
    builder.delete = vi.fn(() => {
      deleting = true;
      return builder;
    });
    builder.in = mocks.deletedIds.mockImplementation(() => builder);
    return { from: vi.fn(() => builder) };
  },
}));

import { DELETE, GET } from "./route";

describe("admin newsletter subscribers", () => {
  beforeEach(() => {
    mocks.authorized.mockReset().mockReturnValue(true);
    mocks.deletedIds.mockClear();
    mocks.logError.mockReset();
  });

  it("requires an authenticated admin", async () => {
    mocks.authorized.mockReturnValue(false);
    const response = await GET(
      new Request("https://www.lobbium.com/api/admin/newsletter/subscribers") as never
    );
    expect(response.status).toBe(401);
  });

  it("returns decrypted subscriber data privately", async () => {
    const response = await GET(
      new Request("https://www.lobbium.com/api/admin/newsletter/subscribers") as never
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual([
      expect.objectContaining({ email: "user@example.com", name: "Alex" }),
    ]);
  });

  it("deletes only explicitly supplied valid ids", async () => {
    const response = await DELETE(
      new Request("https://www.lobbium.com/api/admin/newsletter/subscribers", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: [1, 2] }),
      }) as never
    );
    expect(response.status).toBe(200);
    expect(mocks.deletedIds).toHaveBeenCalledWith("id", [1, 2]);
    await expect(response.json()).resolves.toEqual({ success: true, deleted: 2 });
  });

  it("refuses an empty bulk deletion", async () => {
    const response = await DELETE(
      new Request("https://www.lobbium.com/api/admin/newsletter/subscribers", {
        method: "DELETE",
        body: JSON.stringify({ ids: [] }),
      }) as never
    );
    expect(response.status).toBe(400);
    expect(mocks.deletedIds).not.toHaveBeenCalled();
  });
});
