import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, negotiateLocale, isLocale } from "@/lib/i18n/config";
import { LOCALE_COOKIE, SESSION_COOKIE, VISITOR_COOKIE, hasRole } from "@/lib/constants";
import { verifySessionToken } from "@/lib/auth/jwt";

const PUBLIC_FILE = /\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|json|webmanifest|woff2?)$/i;

/**
 * Runs on every request (Next 16 `proxy`, formerly `middleware`).
 *
 * Three jobs, in order:
 *   1. Put every customer-facing URL behind a locale prefix.
 *   2. Give each visitor a stable anonymous id for analytics (no PII).
 *   3. Fast-fail unauthenticated traffic at /admin.
 *
 * Step 3 is a redirect for humans, never an authorisation decision — the JWT is
 * only signature-checked here. `requireRole()` re-reads the session row and the
 * user's live role on the server for every admin page and action.
 */
export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    return guardAdmin(request);
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    const response = NextResponse.next();
    // Remember the choice so the next bare-URL visit lands in the same language.
    if (request.cookies.get(LOCALE_COOKIE)?.value !== maybeLocale) {
      response.cookies.set(LOCALE_COOKIE, maybeLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return withVisitor(request, response);
  }

  // No locale in the path — pick one and redirect.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : negotiateLocale(request.headers.get("accept-language")) || defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return withVisitor(request, NextResponse.redirect(url));
}

async function guardAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login screen and the forbidden notice must stay reachable.
  if (pathname === "/admin/login" || pathname === "/admin/forbidden") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) {
    return NextResponse.redirect(loginUrl(request));
  }

  // Signature check only — cheap, and enough to bounce anonymous traffic.
  // Authorisation still happens server-side on every admin surface.
  const secondDot = cookie.indexOf(".", cookie.indexOf(".") + 1);
  const claims = secondDot < 0 ? null : await verifySessionToken(cookie.slice(secondDot + 1));

  if (!claims || !hasRole(claims.role, "STAFF")) {
    return NextResponse.redirect(loginUrl(request));
  }
  return NextResponse.next();
}

function loginUrl(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return url;
}

/** Anonymous, rotating-free visitor id — used only to de-duplicate analytics. */
function withVisitor(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
