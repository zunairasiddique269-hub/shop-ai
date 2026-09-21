import bcrypt from "bcryptjs";

// Server-only in spirit, but — matching lib/db/client.ts's convention —
// deliberately NOT guarded with the literal "server-only" package, because
// lib/db/seed-admin.ts imports this from a plain `tsx` script outside of
// Next's bundler, where that guard throws unconditionally. Never import
// this from a "use client" component.

const SALT_ROUNDS = 12;

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export async function verifyPassword(
  plainTextPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, passwordHash);
}
