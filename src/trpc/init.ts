import type { I18n } from "@lingui/core";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v4";
import { db } from "@/db";
import { configureZodLocaleStatic } from "@/utils/zod-i18n";

export const createTRPCContext = async (opts?: { i18n?: I18n }) => {
  // Configure Zod locale based on the i18n context
  if (opts?.i18n?.locale) {
    await configureZodLocaleStatic(opts.i18n.locale);
  }

  return {
    db,
    i18n: opts?.i18n,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
