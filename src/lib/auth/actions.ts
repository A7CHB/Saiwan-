"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, dummyVerify, passwordIssues } from "@/lib/auth/password";
import { createSession, destroySession, getSessionUser } from "@/lib/auth/session";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { resolveLocale, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import type { Role } from "@/lib/constants";

export type AuthState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean };

const emailSchema = z.string().email().max(160);

async function messages(locale: Locale) {
  const d = await getDictionary(locale);
  return d;
}

/**
 * Sign in.
 *
 * Three deliberate choices: the error message never distinguishes "no such
 * user" from "wrong password", a dummy hash is computed when the account does
 * not exist so response time cannot be used to enumerate accounts, and attempts
 * are rate limited per IP + email.
 */
export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const d = await messages(locale);

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "");

  if (!emailSchema.safeParse(email).success) {
    return { fieldErrors: { email: d.form.errors.email } };
  }
  if (!password) {
    return { fieldErrors: { password: d.form.errors.required } };
  }

  const requestHeaders = await headers();
  const key = `signin:${clientIp(requestHeaders)}:${email}`;
  if (!rateLimit(key, 8, 10 * 60_000).ok) {
    return { error: d.form.errors.rateLimited };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await dummyVerify();
    return { error: d.auth.invalidCredentials };
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: d.auth.invalidCredentials };
  }
  if (!user.isActive) {
    return { error: d.auth.accountDisabled };
  }

  resetRateLimit(key);

  await createSession(user.id, user.role as Role, {
    userAgent: requestHeaders.get("user-agent"),
    ip: clientIp(requestHeaders),
  });
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  // Only same-origin relative paths — never bounce to an attacker's URL.
  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : localePath(locale, "/account");
  redirect(safeRedirect);
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const d = await messages(locale);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = d.form.errors.required;
  if (!emailSchema.safeParse(email).success) fieldErrors.email = d.form.errors.email;

  const issue = passwordIssues(password);
  if (issue === "short") fieldErrors.password = d.form.errors.minLength.replace("{min}", "8");
  else if (issue === "weak") fieldErrors.password = d.form.errors.passwordWeak;

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const requestHeaders = await headers();
  if (!rateLimit(`signup:${clientIp(requestHeaders)}`, 5, 60 * 60_000).ok) {
    return { error: d.form.errors.rateLimited };
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { fieldErrors: { email: d.auth.emailTaken } };

  const user = await prisma.user.create({
    data: {
      email,
      name: name.slice(0, 80),
      phone: phone.slice(0, 30) || null,
      passwordHash: await hashPassword(password),
      // Role is never taken from the form. Elevation happens only in the admin.
      role: "CUSTOMER",
      locale,
    },
    select: { id: true },
  });

  await createSession(user.id, "CUSTOMER", {
    userAgent: requestHeaders.get("user-agent"),
    ip: clientIp(requestHeaders),
  });

  redirect(localePath(locale, "/account"));
}

export async function signOutAction(formData: FormData) {
  const locale = resolveLocale(formData.get("locale"));
  await destroySession();
  redirect(localePath(locale, "/account"));
}

export async function updateProfileAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const d = await messages(locale);

  const user = await getSessionUser();
  if (!user) return { error: d.auth.invalidCredentials };

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) return { fieldErrors: { name: d.form.errors.required } };

  await prisma.user.update({
    where: { id: user.id },
    // Email and role are intentionally not editable here: changing an email is
    // an identity change and needs verification, and role never belongs to the
    // account holder.
    data: { name: name.slice(0, 80), phone: phone.slice(0, 30) || null, locale },
  });

  revalidatePath(localePath(locale, "/account"));
  return { ok: true };
}
