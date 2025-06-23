import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string(),
    PUBLIC_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
