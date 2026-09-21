import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/session";

// POST /api/admin/logout
// Deletes the session cookie. Since sessions are stateless JWTs (see
// lib/auth/session.ts), this invalidates the session in the current
// browser only — it does not revoke the token itself.
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
