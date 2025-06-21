import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import LoadingState from "@/components/common/loading-state";
import { APP_NAME } from "@/constants/app";

export const Route = createFileRoute("/todo/$todoId")({
  loader: async ({ context, params }) => {
    const { todoId } = params;

    const todo = await context.queryClient.ensureQueryData(
      context.trpc.todo.byId.queryOptions({
        id: todoId,
      }),
    );
    return { todo };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${APP_NAME} - Todo ${loaderData?.todo.text || "Todo item"}`,
        description: `Managing todo: ${loaderData?.todo.text || "Todo item"}`,
      },
    ],
  }),
  errorComponent: ({ error }) => {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">Todo Not Found</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  },
  notFoundComponent: () => {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">Todo Not Found</h2>
          <p className="text-muted-foreground">
            The todo you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  },
  pendingComponent: () => <LoadingState text="Loading todo details..." />,
  component: lazyRouteComponent(() => import("@/components/todo/todo-detail")),
});
