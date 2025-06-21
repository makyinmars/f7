import type { I18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  createRouter as createTanstackRouter,
  ErrorComponent,
} from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import LoadingState from "./components/common/loading-state";
import NotFound from "./components/common/not-found";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import * as TanstackQuery from "./trpc/root-provider";

// Create a new router instance
export const createRouter = ({ i18n }: { i18n: I18n }) => {
  const queryClient = TanstackQuery.createQueryClient();
  const serverHelpers = TanstackQuery.createServerHelpers({
    queryClient,
  });
  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: {
        queryClient,
        trpc: serverHelpers,
        i18n,
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultStaleTime: 0,
      defaultPreload: "intent",
      defaultViewTransition: true,
      defaultPendingComponent: () => <LoadingState text="Loading..." />,
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <I18nProvider i18n={i18n}>
            <TanstackQuery.Provider queryClient={queryClient}>
              {props.children}
            </TanstackQuery.Provider>
          </I18nProvider>
        );
      },
    }),
    queryClient,
  );

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
