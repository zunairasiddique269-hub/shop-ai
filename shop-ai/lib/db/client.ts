import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Server-only. This file must never be imported from a "use client"
// component — it opens a real TCP connection to Postgres via the `postgres`
// package, which relies on Node.js APIs that don't exist in the browser.
// Client components that need product/category data go through the
// /api/* route handlers instead (see context/StoreProvider.tsx).

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and point it at your Postgres instance.",
  );
}

// Reuse a single connection across hot-reloads in dev so `next dev` doesn't
// open a new pool on every file save.
const globalForDb = globalThis as unknown as {
  shopaiQueryClient?: ReturnType<typeof postgres>;
};

const queryClient =
  globalForDb.shopaiQueryClient ??
  postgres(process.env.DATABASE_URL, { max: 10 });

if (process.env.NODE_ENV !== "production") {
  globalForDb.shopaiQueryClient = queryClient;
}

export const db = drizzle(queryClient, { schema });
