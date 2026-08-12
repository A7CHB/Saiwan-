import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_DAYS, hasRole, type Role } from "@/lib/constants";
import { signSessionToken, verifySessionToken } from "./jwt";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  locale: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Issue a session: an opaque random token is stored hashed in the database and
 * wrapped in a signed JWT cookie. Revoking the row kills the session instantly,
 * which a stateless JWT alone could not do.
 */
export async function createSession(
  userId: string,
  role: Role,
  meta?: { userAgent?: string | null; ip?: string | null },
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: meta?.userAgent?.slice(0, 255) ?? null,
      ip: meta?.ip ?? null,
    },
    select: { id: true },
  });

  const jwt = await signSessionToken({ sid: session.id, uid: userId, role }, expiresAt);

  const store = await cookies();
  store.set(SESSION_COOKIE, `${session.id}.${token}.${jwt}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  // Opportunistic cleanup keeps the table from growing without a cron job.
  prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
}

/**
 * Resolve the current user. Memoised per request, and authoritative: the JWT
 * signature, the session row, its expiry and the user's live `role`/`isActive`
 * flags are all re-checked here rather than trusted from the cookie.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  // Cookie layout: "<sessionId>.<token>.<jwt>" — the JWT contains dots of its
  // own, so only the first two separators are significant.
  const firstDot = raw.indexOf(".");
  const secondDot = raw.indexOf(".", firstDot + 1);
  if (firstDot < 1 || secondDot < 0) return null;

  const sid = raw.slice(0, firstDot);
  const token = raw.slice(firstDot + 1, secondDot);
  const jwt = raw.slice(secondDot + 1);
  if (!token || !jwt) return null;

  const claims = await verifySessionToken(jwt);
  if (!claims || claims.sid !== sid) return null;

  const session = await prisma.session.findUnique({
    where: { id: sid },
    select: {
      tokenHash: true,
      expiresAt: true,
      user: {
        select: { id: true, email: true, name: true, phone: true, role: true, locale: true, isActive: true },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) return null;
  if (session.tokenHash !== hashToken(token)) return null;
  if (!session.user.isActive) return null;

  const { user } = session;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role as Role,
    locale: user.locale,
  };
});

export async function destroySession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    const sid = raw.split(".", 1)[0];
    if (sid) await prisma.session.deleteMany({ where: { id: sid } });
  }
  store.delete(SESSION_COOKIE);
}

/** Sign out everywhere — used after a password change or by an admin. */
export async function destroyAllSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function requireUser(redirectTo = "/en/account"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/en/account?redirect=${encodeURIComponent(redirectTo)}`);
  return user;
}

/**
 * The server-side authorisation gate for every admin surface. Middleware
 * provides a fast redirect for humans; this is what actually protects data and
 * must be called by every admin page, action and route handler.
 */
export async function requireRole(required: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!hasRole(user.role, required)) redirect("/admin/forbidden");
  return user;
}

export const requireAdmin = () => requireRole("ADMIN");
export const requireStaff = () => requireRole("STAFF");

/** Non-redirecting variant for route handlers that must answer with a status. */
export async function authorize(required: Role): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || !hasRole(user.role, required)) return null;
  return user;
}
