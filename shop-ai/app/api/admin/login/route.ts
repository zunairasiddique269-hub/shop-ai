import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminByEmail } from "@/lib/db/admin";
import { verifyPassword } from "@/lib/auth/password";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/auth/session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches session.ts

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// POST /api/admin/login
// Public (unauthenticated by definition — this IS the auth check). Never
// reveals whether the email or the password was the wrong one, to avoid
// leaking which admin emails exist.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const invalidCredentials = () =>
    NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );

  const admin = await getAdminByEmail(body.email);
  if (!admin) {
    return invalidCredentials();
  }

  const passwordMatches = await verifyPassword(body.password, admin.passwordHash);
  if (!passwordMatches) {
    return invalidCredentials();
  }

  const token = await createSessionToken({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  });
}
