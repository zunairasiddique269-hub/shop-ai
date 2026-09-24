import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// Deliberately NOT marked "server-only": this module is imported both by
// Node.js route handlers/Server Components AND by proxy.ts (Next.js 16's
// renamed middleware, which now defaults to the Node.js runtime — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// It never touches the database or bcrypt, so it's safe in both places.
//
// Sessions are stateless signed JWTs stored in an httpOnly cookie (the
// pattern Next.js's own auth guide recommends — see
// node_modules/next/dist/docs/01-app/02-guides/authentication.md). This is a
// deliberate, honest trade-off for a project at this stage: it's simple and
// secure against tampering/forgery, but logging out only clears the cookie
// in the current browser — a stolen token stays valid until it expires
// (7 days) since there is no server-side session store to revoke against.

export const ADMIN_SESSION_COOKIE = "shopai_admin_session";
const SESSION_DURATION = "7d";

export type AdminSessionPayload = {
  adminId: number;
  email: string;
  name: string;
  role: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is not set (or is too short). Copy .env.example to .env and set SESSION_SECRET to a long random string, e.g. the output of `openssl rand -base64 32`.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: AdminSessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload } satisfies AdminSessionPayload & JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.adminId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    // Expired, malformed, or signed with a different secret.
    return null;
  }
}

// --- Customer sessions ---
//
// A separate, parallel system from the admin session above — different
// cookie name, different payload shape, and its own create/verify
// functions — so a customer token can never be mistaken for (or upgraded
// into) an admin one. Both share the same SESSION_SECRET and getSecretKey(),
// the same signing algorithm, and the same 7-day SESSION_DURATION; nothing
// about the admin functions above was changed to add this.

export const CUSTOMER_SESSION_COOKIE = "shopai_customer_session";

export type CustomerSessionPayload = {
  customerId: number;
  email: string;
  name: string;
};

export async function createCustomerSessionToken(
  payload: CustomerSessionPayload,
): Promise<string> {
  return new SignJWT({ ...payload } satisfies CustomerSessionPayload & JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifyCustomerSessionToken(
  token: string,
): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.customerId !== "number" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      customerId: payload.customerId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    // Expired, malformed, or signed with a different secret.
    return null;
  }
}
