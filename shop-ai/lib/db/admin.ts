import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { adminUsers } from "./schema";

// Server-only. Thin query layer over the adminUsers table Stage 4A already
// defined in schema.ts. Password hashing/verification lives in
// lib/auth/password.ts, not here — this file only ever moves an
// already-hashed string in and out of the database.

export type AdminUser = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
};

function toAdminUser(row: typeof adminUsers.$inferSelect): AdminUser {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    role: row.role,
  };
}

export async function getAdminByEmail(email: string): Promise<AdminUser | undefined> {
  const [row] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return row ? toAdminUser(row) : undefined;
}

export type CreateAdminUserInput = {
  email: string;
  passwordHash: string;
  name: string;
  role?: string;
};

// Used only by lib/db/seed-admin.ts (the dev/setup script). No UI ever
// calls this — Stage 4B ships no "create another admin" screen.
export async function createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
  const [row] = await db
    .insert(adminUsers)
    .values({
      email: input.email.toLowerCase().trim(),
      passwordHash: input.passwordHash,
      name: input.name,
      role: input.role ?? "admin",
    })
    .returning();
  return toAdminUser(row);
}

export async function updateAdminPasswordHash(
  email: string,
  passwordHash: string,
): Promise<AdminUser | undefined> {
  const [row] = await db
    .update(adminUsers)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .returning();
  return row ? toAdminUser(row) : undefined;
}
