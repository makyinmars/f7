import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  apiTodoCreate,
  apiTodoUpdate,
  todo,
  todoInsert,
  todoUpdate,
} from "@/db/schema";
import { publicProcedure } from "../init";
import type { RouterOutput } from "../utils";

export type TodoListProcedure = RouterOutput["todo"]["list"];

export const todoRouter = {
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.todo.findMany({
      orderBy: desc(todo.createdAt),
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const foundTodo = await ctx.db.query.todo.findFirst({
        where: eq(todo.id, input.id),
      });

      if (!foundTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      return foundTodo;
    }),
  create: publicProcedure
    .input(apiTodoCreate)
    .mutation(async ({ input, ctx }) => {
      const parsed = todoInsert.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid input",
        });
      }

      const [created] = await ctx.db
        .insert(todo)
        .values({
          ...parsed.data,
        })
        .returning();

      return created;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deleted] = await ctx.db
        .delete(todo)
        .where(eq(todo.id, input.id))
        .returning();
      return deleted;
    }),
  update: publicProcedure
    .input(apiTodoUpdate)
    .mutation(async ({ input, ctx }) => {
      const parsed = todoUpdate.safeParse(input);

      if (!parsed.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid input",
        });
      }

      const [updated] = await ctx.db
        .update(todo)
        .set({
          ...parsed.data,
        })
        .where(eq(todo.id, parsed.data.id as string))
        .returning();

      return updated;
    }),
} satisfies TRPCRouterRecord;
