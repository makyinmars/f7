import { i18n } from "@lingui/core";
import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { setupLocaleFromRequest } from "@/modules/lingui/i18n.server";
import { createTRPCContext } from "@/trpc/init";
import { trpcRouter } from "@/trpc/router";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: "/api/trpc",
    createContext: async (opts) => {
      await setupLocaleFromRequest(i18n);
      return createTRPCContext({
        i18n,
        headers: opts.req.headers,
        req: opts.req,
      });
    },
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
