import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { customers } from "./schema";

// Server-only. Thin query layer over the customers table (Stage 5A schema).
// Password hashing/verification lives in lib/auth/password.ts, not here —
// this file only ever moves an already-hashed string in and out of the
// database. No signup/login/session logic lives here either; that comes in
// a later stage.

export type Customer = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
};

function toCustomer(row: typeof customers.$inferSelect): Customer {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
  };
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const normalizedEmail = email.trim().toLowerCase();
  const [row] = await db
    .select()
    .from(customers)
    .where(eq(customers.email, normalizedEmail))
    .limit(1);
  return row ? toCustomer(row) : undefined;
}

export async function getCustomerById(id: number): Promise<Customer | undefined> {
  const [row] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return row ? toCustomer(row) : undefined;
}

export type CreateCustomerInput = {
  email: string;
  passwordHash: string;
  name: string;
};

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const [row] = await db
    .insert(customers)
    .values({
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
      name: input.name,
    })
    .returning();
  return toCustomer(row);
}
