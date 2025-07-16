/// <reference types="vite/client" />

import type { I18n } from "@lingui/core";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouteContext,
  useRouter,
} from "@tanstack/react-router";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ThemeProvider } from "next-themes";
import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { APP_LOGO_URL, APP_NAME } from "@/constants/app";
import appCss from "@/styles/app.css?url";
import type { TRPCRouter } from "@/trpc/router";
import { seo } from "@/utils/seo";

interface MyRouterContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
  i18n: I18n;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

function ErrorComponent({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="flex min-h-96 items-center justify-center">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>{error.message}</p>
          <Button
            variant="outline"
            onClick={() => router.invalidate()}
            className="w-full"
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-96 items-center justify-center">
      <Alert className="max-w-lg">
        <AlertTitle>Page Not Found</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>The page you're looking for doesn't exist.</p>
          <Button asChild className="w-full">
            <Link to="/">Go Home</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: `${APP_NAME} - Modern Full-Stack Todo Application`,
        description:
          "A blazing fast, type-safe todo application built with TanStack Start, tRPC, and PostgreSQL. Manage your tasks efficiently with real-time updates and a beautiful UI.",
        keywords:
          "todo app, task management, productivity, TanStack, tRPC, PostgreSQL, React, TypeScript, full-stack",
        image: APP_LOGO_URL,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#10b981" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  wrapInSuspense: true,
});

function RootComponent() {
  const { i18n } = useRouteContext({ from: "__root__" });
  return (
    <RootDocument locale={i18n.locale}>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <TanStackRouterDevtools position="bottom-right" />
          <Toaster richColors={true} />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}
