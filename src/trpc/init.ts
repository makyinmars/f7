import type { I18n } from "@lingui/core";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v4";
import { db } from "@/db";

export const createTRPCContext = async (opts?: { i18n?: I18n }) => {
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
