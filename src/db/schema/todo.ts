import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod/v4";
import { timestamps } from "../utils";

export enum TodoStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export const todoStatusSchema = pgEnum("status", TodoStatus);

export const todo = pgTable("todo", {
  id: uuid().defaultRandom().primaryKey(),
  text: text("text").notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  status: todoStatusSchema("status").default(TodoStatus.NOT_STARTED).notNull(),
  ...timestamps,
});

export const todoInsert = createInsertSchema(todo, {
  status: z.enum(TodoStatus),
});

export const apiTodoCreate = todoInsert.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const todoUpdate = createUpdateSchema(todo, {
  status: z.enum(TodoStatus),
});

export const apiTodoUpdate = todoUpdate.omit({
  createdAt: true,
  updatedAt: true,
});

export const apiTodoCreateAndUpdate = apiTodoCreate.extend({
  id: z.uuid().optional(),
  text: z.string().min(3).max(250),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const apiTodoId = apiTodoCreateAndUpdate.pick({
  id: true,
});

export type Todo = typeof todo.$inferSelect;
export type TodoCreate = z.infer<typeof apiTodoCreate>;
export type TodoUpdate = z.infer<typeof apiTodoUpdate>;
export type TodoCreateAndUpdate = z.infer<typeof apiTodoCreateAndUpdate>;
