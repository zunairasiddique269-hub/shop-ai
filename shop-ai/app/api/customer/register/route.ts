import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCustomer, getCustomerByEmail } from "@/lib/db/customer";
import { hashPassword } from "@/lib/auth/password";
import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken } from "@/lib/auth/session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches session.ts

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// POST /api/customer/register
// Public. Creates a customer account, then immediately signs the new
// customer in (same behavior a typical storefront sign-up flow expects).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    !isNonEmptyString(body.name) ||
    !isNonEmptyString(body.email) ||
    typeof body.password !== "string" ||
    body.password.length < 8
  ) {
    return NextResponse.json(
      {
        error:
          "Please provide your name, a valid email, and a password of at least 8 characters.",
      },
      { status: 400 },
    );
  }

  const normalizedEmail = body.email.trim().toLowerCase();

  const existing = await getCustomerByEmail(normalizedEmail);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(body.password);
  const customer = await createCustomer({
    email: normalizedEmail,
    passwordHash,
    name: body.name.trim(),
  });

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
