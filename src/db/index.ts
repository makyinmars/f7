import type { Logger } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { serverEnv } from "@/env/server";
import * as authSchema from "./schema/auth";
import * as todoSchema from "./schema/todo";

const schema = { ...authSchema, ...todoSchema };

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log(`-> Query: ${query}  Params: ${JSON.stringify(params)} \n`);
  }
}

const pool = new pg.Pool({ connectionString: serverEnv.DATABASE_URL });
const db = drizzle(pool, { schema, logger: new MyLogger() });

export { db, pool };

export type DB = typeof db;
