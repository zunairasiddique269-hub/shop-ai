import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken, type AdminSessionPayload } from "./session";

// Server-only Data Access Layer for admin auth, following the pattern in
// Next.js's own App Router authentication guide (node_modules/next/dist/docs/
// 01-app/02-guides/authentication.md): a single cached verifySession-style
// function that every Server Component / Route Handler goes through, rather
// than each page re-implementing its own cookie check.
//
// proxy.ts performs a separate, "optimistic" check for the same cookie so
// unauthenticated visitors get redirected before any page code runs at all.
// That check is a fast first line of defense, not the source of truth —
// this file (used inside pages, layouts, and API routes) is.

// Cached per request: multiple Server Components reading the session in the
// same render pass only decode the cookie once.
export const getAdminSession = cache(
  async (): Promise<AdminSessionPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  },
);

// For Server Components / layouts / pages under /admin: redirects to the
// login page if there's no valid session, otherwise returns it.
export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

// For Route Handlers (app/api/**): there's no redirect() equivalent that
// makes sense for a fetch() caller, so this returns either the verified
// session or a ready-to-return 401 JSON response. Route handlers call it as:
//
//   const auth = await requireAdminApi();
//   if ("response" in auth) return auth.response;
//   const { session } = auth;
export async function requireAdminApi(): Promise<
  { session: AdminSessionPayload } | { response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      response: NextResponse.json(
        { error: "Not authenticated. Please log in to the admin dashboard." },
        { status: 401 },
      ),
    };
  }
  return { session };
}
