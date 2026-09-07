import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ set: vi.fn(), delete: vi.fn(), get: vi.fn(), proto: "http" }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ set: mocks.set, delete: mocks.delete, get: mocks.get }),
  headers: async () => new Headers({ "x-forwarded-proto": mocks.proto }),
}));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));
import { loginAction, logoutAction, renewSessionAction } from "./actions";
import { sessionForKey } from "@/lib/warehouse-session";

describe("warehouse key login", () => {
  beforeEach(() => {
    vi.stubEnv("WAREHOUSE_USERS", "test-warehouse-key:Тестовый склад");
    mocks.proto = "http";
    mocks.get.mockReturnValue(undefined);
  });
  it("rejects unknown keys without creating a session", async () => {
    const data = new FormData(); data.set("access", "unknown-key");
    expect((await loginAction({ error: "" }, data)).error).toContain("Ключ не найден");
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it("accepts only a key, not an old URL", async () => {
    const data = new FormData(); data.set("access", "http://localhost:3000/s/test-warehouse-key");
    expect((await loginAction({ error: "" }, data)).error).toContain("без ссылки");
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it("validates a configured key and redirects without exposing it in the URL", async () => {
    const data = new FormData(); data.set("access", " test-warehouse-key ");
    await expect(loginAction({ error: "" }, data)).rejects.toThrow("redirect:/cabinet");
    expect(mocks.set).toHaveBeenCalledWith("warehouse-session", sessionForKey("test-warehouse-key"), expect.objectContaining({ httpOnly: true, sameSite: "lax", secure: false, maxAge: 2592000 }));
  });
  it("uses secure cookies on HTTPS", async () => {
    mocks.proto = "https";
    const data = new FormData(); data.set("access", "test-warehouse-key");
    await expect(loginAction({ error: "" }, data)).rejects.toThrow("redirect:/cabinet");
    expect(mocks.set).toHaveBeenCalledWith("warehouse-session", expect.any(String), expect.objectContaining({ secure: true }));
  });
  it("clears the session on logout", async () => {
    await expect(logoutAction()).rejects.toThrow("redirect:/login");
    expect(mocks.delete).toHaveBeenCalledWith("warehouse-session");
  });
  it("extends an existing valid session to thirty days", async () => {
    mocks.get.mockReturnValue({ value: sessionForKey("test-warehouse-key") });
    await renewSessionAction();
    expect(mocks.set).toHaveBeenCalledWith("warehouse-session", expect.any(String), expect.objectContaining({ maxAge: 2592000 }));
  });
  it("does not renew an unknown or revoked key", async () => {
    mocks.get.mockReturnValue({ value: sessionForKey("revoked-key") });
    await renewSessionAction();
    expect(mocks.set).not.toHaveBeenCalled();
  });
});
