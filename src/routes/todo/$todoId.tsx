import { Suspense } from "react";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import LoadingState from "@/components/common/loading-state";
import { APP_NAME } from "@/constants/app";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
  component: () => {
    const LazyTodoDetail = lazyRouteComponent(
      () => import("@/components/todo/todo-detail"),
    );
    return (
      <Suspense fallback={<TodoDetailSkeleton />}>
        <LazyTodoDetail />
      </Suspense>
    );
  },
});

function TodoDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-64" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
