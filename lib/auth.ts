import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "signal_admin";

function secret() {
  return process.env.ADMIN_PASSWORD || "change-me";
}

export function signAdminSession() {
  const payload = "admin";
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isValidSession(value?: string | null) {
  if (!value) return false;
  const expected = signAdminSession();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkAdminPassword(password: string) {
  const expected = Buffer.from(secret());
  const given = Buffer.from(password);
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return isValidSession(jar.get(ADMIN_COOKIE)?.value);
}
