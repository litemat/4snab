import { beforeEach, describe, expect, it, vi } from "vitest";
import { WarehouseConflictError } from "@/lib/warehouse-types";

const mocks = vi.hoisted(() => ({ user: vi.fn(), request: vi.fn(), remove: vi.fn(), hidden: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getUserByToken: mocks.user }));
vi.mock("@/lib/requests", () => ({ getRequest: mocks.request }));
vi.mock("@/lib/warehouse-db", () => ({ getWarehouseRepository: () => ({ hiddenLeadIds: mocks.hidden, removeFromWarehouse: mocks.remove }) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { deleteWarehouseRequestAction } from "./delete-actions";

function payload() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ id: "123", version: "2", confirmationId: "123", confirmed: "delete-permanently" })) data.set(key, value);
  return data;
}
describe("local warehouse deletion", () => {
  beforeEach(() => {
    mocks.user.mockReturnValue({ name: "Склад", token: "test-key" });
    mocks.request.mockResolvedValue({ draft: { version: 2, status: "draft" } });
    mocks.hidden.mockReturnValue(new Set());
    mocks.remove.mockReturnValue(undefined);
  });
  it("rejects unauthorized deletion", async () => {
    mocks.user.mockReturnValue(null);
    expect((await deleteWarehouseRequestAction("bad", payload())).ok).toBe(false);
    expect(mocks.remove).not.toHaveBeenCalled();
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it.each(["confirmed", "confirmationId"])("requires %s", async field => {
    const data = payload(); data.delete(field);
    expect((await deleteWarehouseRequestAction("test-key", data)).ok).toBe(false);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it("requires the exact request number", async () => {
    const data = payload(); data.set("confirmationId", "124");
    expect((await deleteWarehouseRequestAction("test-key", data)).ok).toBe(false);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it("only changes the local repository after validation", async () => {
    expect(await deleteWarehouseRequestAction("test-key", payload())).toEqual({ ok: true });
    expect(mocks.request).toHaveBeenCalledWith(123, "Склад");
    expect(mocks.remove).toHaveBeenCalledWith(123, 2, "Склад");
    expect(mocks.revalidate).toHaveBeenCalledWith("/cabinet", "layout");
  });
  it("blocks a request while completion is in progress", async () => {
    mocks.request.mockResolvedValue({ draft: { version: 2, status: "completing" } });
    expect((await deleteWarehouseRequestAction("test-key", payload())).ok).toBe(false);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it("rejects stale versions", async () => {
    mocks.request.mockResolvedValue({ draft: { version: 3, status: "draft" } });
    expect((await deleteWarehouseRequestAction("test-key", payload())).error).toBe(new WarehouseConflictError().message);
    expect(mocks.remove).not.toHaveBeenCalled();
  });
  it("retries an already deleted request without reading amoCRM", async () => {
    mocks.hidden.mockReturnValue(new Set([123]));
    expect((await deleteWarehouseRequestAction("test-key", payload())).ok).toBe(true);
    expect(mocks.request).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });
});
