import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "./auth";
import { env } from "./env";

export const SESSION_COOKIE = "warehouse-session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export function sessionForKey(key: string) {
  return createHash("sha256").update(`4snab-session-v1:${key}`).digest("hex");
}
export async function getSessionUser() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;
  for (const entry of (env.warehouseUsersRaw ?? "").split(",")) {
    const key = entry.trim().split(":")[0].trim();
    if (key.length >= 8 && sessionForKey(key) === value) return getUserByToken(key);
  }
  return null;
}
export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
