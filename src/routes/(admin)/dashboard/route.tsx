import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(admin)/dashboard")({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(
      context.trpc.auth.getSession.queryOptions()
    );

    if (!auth?.session) {
      throw redirect({
        to: "/auth",
      });
    }

    return {
      auth,
    };
  },
});
