import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCustomerByEmail } from "@/lib/db/customer";
import { verifyPassword } from "@/lib/auth/password";
import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken } from "@/lib/auth/session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches session.ts

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// POST /api/customer/login
// Public (this IS the auth check). Never reveals whether the email or the
// password was the wrong one, to avoid leaking which emails have accounts —
// mirrors app/api/admin/login/route.ts's behavior.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !isNonEmptyString(body.email) || !isNonEmptyString(body.password)) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const invalidCredentials = () =>
    NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const normalizedEmail = body.email.trim().toLowerCase();
  const customer = await getCustomerByEmail(normalizedEmail);
  if (!customer) {
    return invalidCredentials();
  }

  const passwordMatches = await verifyPassword(body.password, customer.passwordHash);
  if (!passwordMatches) {
    return invalidCredentials();
  }

  const token = await createCustomerSessionToken({
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return NextResponse.json({
    customer: { id: customer.id, email: customer.email, name: customer.name },
  });
}
