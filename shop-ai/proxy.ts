import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

// Next.js 16 renamed "middleware" to "proxy" (functionality unchanged) —
// see node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md.
// This file must live at the project root, next to app/.
//
// This is an OPTIMISTIC check only, per Next's authentication guide
// (node_modules/next/dist/docs/01-app/02-guides/authentication.md): it reads
// and verifies the signed cookie to redirect unauthenticated visitors before
// any page code runs, but the real authorization checks live in
// lib/auth/dal.ts, used by every /admin page and every admin API route.
// Even if this file were misconfigured or skipped, those checks alone are
// enough to keep the admin area and its APIs secure.

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Already signed in — no reason to show the login form again.
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Any other /admin/* route requires a valid session.
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
