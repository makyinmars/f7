import type { I18n } from "@lingui/core";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod/v4";
import { auth } from "@/auth/server";
import { db } from "@/db";

export const createTRPCContext = async (opts: {
  i18n?: I18n;
  headers: Headers;
  req: Request;
}) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });
  return {
    db,
    i18n: opts?.i18n,
    session,
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

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next();
});
