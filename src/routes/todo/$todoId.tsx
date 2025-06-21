import { createFileRoute } from "@tanstack/react-router";
import LoadingState from "@/components/common/loading-state";
import TodoDetail from "@/components/todo/todo-detail";
import { APP_NAME } from "@/constants/app";

export const Route = createFileRoute("/todo/$todoId")({
  loader: async ({ context, params }) => {
    const { todoId } = params;

    // Validate UUID format on client side
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(todoId)) {
      throw new Error(`Invalid todo ID format: ${todoId}`);
    }

    try {
      const todo = await context.queryClient.ensureQueryData(
        context.trpc.todo.byId.queryOptions(
          {
            id: todoId,
          },
          {
            enabled: !!todoId,
          },
        ),
      );
      return { todo };
    } catch (_error) {
      throw new Error(`Todo not found or invalid: ${todoId}`);
    }
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
    const isInvalidFormat = error.message.includes("Invalid todo ID format");
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-semibold text-2xl">
            {isInvalidFormat ? "Invalid Todo ID" : "Todo Not Found"}
          </h2>
          <p className="text-muted-foreground">
            {isInvalidFormat
              ? "The todo ID provided is not in the correct format."
              : error.message}
          </p>
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
  component: TodoDetail,
});
