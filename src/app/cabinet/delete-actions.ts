"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUserByToken } from "@/lib/auth";
import { getRequest } from "@/lib/requests";
import { getWarehouseRepository } from "@/lib/warehouse-db";
import { WarehouseConflictError, WarehouseValidationError } from "@/lib/warehouse-types";

const schema = z.object({
  id: z.coerce.number().int().positive(),
  version: z.coerce.number().int().nonnegative(),
  confirmationId: z.string(),
  confirmed: z.literal("delete-permanently"),
}).refine(data => data.confirmationId === String(data.id));

export async function deleteWarehouseRequestAction(token: string, data: FormData): Promise<{ ok: boolean; error?: string }> {
  const user = getUserByToken(token);
  if (!user) return { ok: false, error: "Доступ запрещён. Войдите в кабинет заново." };
  const parsed = schema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { ok: false, error: "Подтвердите удаление и введите точный номер заявки." };
  const { id, version } = parsed.data;
  try {
    const repository = getWarehouseRepository();
    if (!repository.hiddenLeadIds().has(id)) {
      // Read the warehouse request to validate its pipeline; never modify amoCRM.
      const request = await getRequest(id, user.name);
      if (request.draft.status === "completing") {
        return { ok: false, error: "Заявка передаётся диспетчеру. Дождитесь завершения передачи." };
      }
      if (request.draft.version !== version) throw new WarehouseConflictError();
      repository.removeFromWarehouse(id, version, user.name);
    }
    revalidatePath("/cabinet", "layout");
    revalidatePath("/s/[token]", "layout");
    return { ok: true };
  } catch (error) {
    if (error instanceof WarehouseConflictError || error instanceof WarehouseValidationError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "Не удалось удалить заявку из кабинета. Обновите страницу и повторите." };
  }
}
