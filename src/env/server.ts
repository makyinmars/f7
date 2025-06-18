import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
