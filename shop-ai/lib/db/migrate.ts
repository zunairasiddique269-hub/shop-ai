import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./client";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
