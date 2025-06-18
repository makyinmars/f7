import { createTRPCRouter } from "./init";
import { todoRouter } from "./routers/todo";

export const trpcRouter = createTRPCRouter({
  todo: todoRouter,
});
export type TRPCRouter = typeof trpcRouter;
