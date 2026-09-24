import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_SESSION_COOKIE } from "@/lib/auth/session";

// POST /api/customer/logout
// Clears only the customer session cookie — never touches
// ADMIN_SESSION_COOKIE. Sessions are stateless JWTs (see
// lib/auth/session.ts), so this invalidates the session in the current
// browser only.
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
