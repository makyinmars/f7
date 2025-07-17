import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod/v4";
import {
  apiTodoCreate,
  apiTodoUpdate,
  todo,
  todoInsert,
  todoUpdate,
} from "@/db/schema";
import { createErrors } from "../errors";
import { publicProcedure } from "../init";
import type { RouterOutput } from "../utils";

export type TodoListProcedure = RouterOutput["todo"]["list"];

export const todoRouter = {
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.todo.findMany({
      orderBy: desc(todo.createdAt),
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.uuid("Invalid todo ID format") }))
    .query(async ({ input, ctx }) => {
      const errors = createErrors(ctx.i18n);
      const foundTodo = await ctx.db.query.todo.findFirst({
        where: eq(todo.id, input.id),
      });

      if (!foundTodo) {
        throw errors.todoNotFound();
      }

      return foundTodo;
    }),
  create: publicProcedure
    .input(apiTodoCreate)
    .mutation(async ({ input, ctx }) => {
      const errors = createErrors(ctx.i18n);
      const parsed = todoInsert.safeParse(input);

      if (!parsed.success) {
        throw errors.invalidInput();
      }

      try {
        const [created] = await ctx.db
          .insert(todo)
          .values({
            ...parsed.data,
          })
          .returning();

        return created;
      } catch (_error) {
        throw errors.todoCreateFailed();
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.uuid("Invalid todo ID format") }))
    .mutation(async ({ input, ctx }) => {
      const errors = createErrors(ctx.i18n);

      try {
        const [deleted] = await ctx.db
          .delete(todo)
          .where(eq(todo.id, input.id))
          .returning();
        return deleted;
      } catch (_error) {
        throw errors.todoDeleteFailed();
      }
    }),
  update: publicProcedure
    .input(apiTodoUpdate)
    .mutation(async ({ input, ctx }) => {
      const errors = createErrors(ctx.i18n);
      const parsed = todoUpdate.safeParse(input);

      if (!parsed.success) {
        throw errors.invalidInput();
      }

      try {
        const [updated] = await ctx.db
          .update(todo)
          .set({
            ...parsed.data,
          })
          .where(eq(todo.id, parsed.data.id as string))
          .returning();

        return updated;
      } catch (_error) {
        throw errors.todoUpdateFailed();
      }
    }),
} satisfies TRPCRouterRecord;
