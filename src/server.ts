import type { Register } from "@tanstack/react-router";
import type { RequestHandler } from "@tanstack/react-start/server";
import { createStartHandler } from "@tanstack/react-start/server";
import { customHandler } from "./server-handler";

const fetch = createStartHandler(customHandler);

export default {
  fetch: fetch as RequestHandler<Register>,
} as const;
