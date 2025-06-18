import type { inferRouterOutputs } from "@trpc/server";
import type { TRPCRouter } from "./router";

export type RouterOutput = inferRouterOutputs<TRPCRouter>;
