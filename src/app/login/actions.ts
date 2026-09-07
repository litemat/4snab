"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserByToken } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_MAX_AGE, getSessionUser, sessionForKey } from "@/lib/warehouse-session";

async function persistSession(key: string) {
  const requestHeaders = await headers();
  (await cookies()).set(SESSION_COOKIE, sessionForKey(key), {
    httpOnly: true,
    sameSite: "lax",
    secure: requestHeaders.get("x-forwarded-proto") === "https",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function renewSessionAction() {
  const user = await getSessionUser();
  if (user) await persistSession(user.token);
}

export async function loginAction(_state: { error: string }, data: FormData) {
  const key = String(data.get("access") ?? "").trim();
  if (key.length < 8 || key.length > 256 || /[\s/?#]/.test(key)) {
    return { error: "Введите только ваш ключ доступа, без ссылки." };
  }
  if (!getUserByToken(key)) return { error: "Ключ не найден. Проверьте его или обратитесь к администратору." };
  await persistSession(key);
  redirect("/cabinet");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
