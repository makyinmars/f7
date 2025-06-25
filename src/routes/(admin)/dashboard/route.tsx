import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/dashboard')({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(
      context.trpc.auth.getSession.queryOptions()
    )

    return {
      auth
    }
  },
})
