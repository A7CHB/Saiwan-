"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, dummyVerify } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { hasRole, type Role } from "@/lib/constants";

export type AdminAuthState = { error?: string };

/**
 * Dashboard sign-in — the only sign-in the application has.
 *
 * The storefront is anonymous by design, so this endpoint is the entire attack
 * surface for authentication: it answers with one message for every failure
 * mode, computes a dummy hash for unknown addresses so timing cannot enumerate
 * accounts, and is rate limited per IP.
 */
export async function adminSignInAction(
  _prev: AdminAuthState,
  formData: FormData,
): Promise<AdminAuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!z.string().email().safeParse(email).success || !password) {
    return { error: "Enter your email address and password." };
  }

  const requestHeaders = await headers();
  const ip = clientIp(requestHeaders);
  const key = `admin-signin:${ip}`;

  if (!rateLimit(key, 6, 15 * 60_000).ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // One message for every failure mode — no account enumeration, no hint about
  // whether the address exists or merely lacks permission.
  const generic = { error: "Those credentials were not recognised." };

  if (!user) {
    await dummyVerify();
    return generic;
  }
  if (!(await verifyPassword(password, user.passwordHash))) return generic;
  if (!user.isActive) return generic;
  if (!hasRole(user.role, "STAFF")) return generic;

  resetRateLimit(key);

  await createSession(user.id, user.role as Role, {
    userAgent: requestHeaders.get("user-agent"),
    ip,
  });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  redirect(safeNext);
}

export async function adminSignOutAction() {
  await destroySession();
  redirect("/admin/login");
}
