import { createTRPCRouter } from "./init";
import { authRouter } from "./routers/auth";
import { todoRouter } from "./routers/todo";

export const trpcRouter = createTRPCRouter({
  auth: authRouter,
  todo: todoRouter,
});
export type TRPCRouter = typeof trpcRouter;
