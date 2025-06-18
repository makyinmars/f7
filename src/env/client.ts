import { createEnv } from "@t3-oss/env-core";
// import { z } from "zod/v4";

export const clientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    // VITE_PUBLIC_SERVER_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,

  emptyStringAsUndefined: true,
});
