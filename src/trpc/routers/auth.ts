import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../init";
import type { RouterOutput } from "../utils";

export type AuthSessionProcedure = RouterOutput["auth"]["getSession"];

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
} satisfies TRPCRouterRecord;
