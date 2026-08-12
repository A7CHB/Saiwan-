import { SignJWT, jwtVerify } from "jose";

/**
 * Edge-safe token helpers. The JWT carries only a session id and a role hint so
 * middleware can gate `/admin` without a database round-trip. It is never the
 * authority: every server surface re-reads the session row and the user's live
 * role (see `session.ts`).
 */

export type SessionClaims = {
  sid: string;
  uid: string;
  role: string;
};

const ISSUER = "saiwan";
const AUDIENCE = "saiwan-web";

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or shorter than 32 characters. Set it in .env before starting the app.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(claims: SessionClaims, expiresAt: Date): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["HS256"],
    });
    if (typeof payload.sid !== "string" || typeof payload.uid !== "string") return null;
    return { sid: payload.sid, uid: payload.uid, role: String(payload.role ?? "CUSTOMER") };
  } catch {
    return null;
  }
}
