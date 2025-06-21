import { QueryCache, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createIsomorphicFn, createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  isNonJsonSerializable,
  loggerLink,
  splitLink,
  type TRPCClientErrorLike,
} from "@trpc/client";
import type { TRPCCombinedDataTransformer } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson, { SuperJSON } from "superjson";
import { clientEnv } from "@/env/client";
import { TRPCProvider } from "./react";
import type { TRPCRouter } from "./router";
import { FIVE_MINUTES_CACHE } from "@/constants/utils";

export const transformer: TRPCCombinedDataTransformer = {
  input: {
    serialize: (obj) => {
      if (isNonJsonSerializable(obj)) {
        return obj;
      }
      return SuperJSON.serialize(obj);
    },
    deserialize: (obj) => {
      if (isNonJsonSerializable(obj)) {
        return obj;
      }
      return SuperJSON.deserialize(obj);
    },
  },
  output: SuperJSON,
};

export const getRequestHeaders = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    const headers = new Headers(request?.headers);

    return Object.fromEntries(headers);
  },
);

const headers = createIsomorphicFn()
  .client(() => ({}))
  .server(() => getRequestHeaders());

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    if (clientEnv.VITE_PUBLIC_URL) return clientEnv.VITE_PUBLIC_URL;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    splitLink({
      condition: (op) => isNonJsonSerializable(op.input),
      true: httpLink({
        url: getUrl(),
        transformer,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
        headers,
      }),
      false: httpBatchLink({
        url: getUrl(),
        transformer,
        headers,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    }),
  ],
});

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
      queries: {
        staleTime: FIVE_MINUTES_CACHE,
        retry(failureCount, _err) {
          const err = _err as unknown as TRPCClientErrorLike<TRPCRouter>;
          const code = err?.data?.code;
          if (
            code === "BAD_REQUEST" ||
            code === "FORBIDDEN" ||
            code === "UNAUTHORIZED"
          ) {
            return false;
          }
          const MAX_QUERY_RETRIES = 0;
          return failureCount < MAX_QUERY_RETRIES;
        },
      },
    },
    queryCache: new QueryCache(),
  });
};
export const createServerHelpers = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  });
  return serverHelpers;
};

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </TRPCProvider>
  );
}
