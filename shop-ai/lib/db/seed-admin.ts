import { db } from "./client";
import { adminUsers } from "./schema";
import { hashPassword } from "../auth/password";

// Creates (or updates) the initial admin account from environment
// variables. Never hard-codes a real password — ADMIN_EMAIL and
// ADMIN_PASSWORD must be set in .env (see .env.example). Re-running this
// script with a changed ADMIN_PASSWORD updates the existing account's
// password, which is convenient in development but is exactly why this is
// documented as a dev/setup script, not something exposed in any UI.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `${name} is not set. Copy .env.example to .env and set ${name} (see the "Admin auth" section of .env.example), then re-run \`npm run db:seed-admin\`.`,
    );
  }
  return value.trim();
}

async function main() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Store Admin";

  if (password.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 8 characters. Update it in .env and re-run this script.",
    );
  }

  console.log(`Seeding admin account for ${email}...`);
  const passwordHash = await hashPassword(password);

  await db
    .insert(adminUsers)
    .values({ email, passwordHash, name, role: "admin" })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash, name, updatedAt: new Date() },
    });

  console.log(
    `Done. You can now log in at /admin/login with the email and password from your .env file.`,
  );
}

main()
  .catch((error) => {
    console.error("Admin seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
