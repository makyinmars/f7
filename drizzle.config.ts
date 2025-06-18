import { defineConfig } from "drizzle-kit";
import { databasePrefix } from "@/constants/utils";
import { serverEnv } from "@/env/server";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  tablesFilter: [`${databasePrefix}_*`],
  verbose: true,
  strict: true,
  casing: "snake_case",
});
