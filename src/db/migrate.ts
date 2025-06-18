import "dotenv/config";

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from "./index";

async function main() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

await main();
