import { Trans, useLingui } from "@lingui/react/macro";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import LoadingState from "@/components/common/loading-state";
import TodoDelete from "@/components/todo/todo-delete";
import TodoForm from "@/components/todo/todo-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { APP_LOGO_URL, APP_NAME } from "@/constants/app";
import { TodoStatus } from "@/db/schema/todo";
import { useTRPC } from "@/trpc/react";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.todo.list.queryOptions(),
    );
  },
  pendingComponent: () => {
    const { t } = useLingui();
    return <LoadingState text={t`Loading todos...`} />;
  },
  component: Home,
  head: () => ({
    meta: [
      {
        title: `${APP_NAME} - Modern Full-Stack Todo Application`,
        content:
          "A blazing fast, type-safe todo application built with TanStack Start, tRPC, and PostgreSQL. Manage your tasks efficiently with real-time updates and a beautiful UI.",
        name: "description",
      },
      {
        property: "og:title",
        content: `${APP_NAME} - Modern Full-Stack Todo Application`,
      },
      {
        property: "og:description",
        content:
          "A blazing fast, type-safe todo application built with TanStack Start, tRPC, and PostgreSQL. Manage your tasks efficiently with real-time updates and a beautiful UI.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: APP_LOGO_URL,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: `${APP_NAME} - Modern Full-Stack Todo Application`,
      },
      {
        name: "twitter:description",
        content:
          "A blazing fast, type-safe todo application built with TanStack Start, tRPC, and PostgreSQL.",
      },
      {
        name: "twitter:image",
        content: APP_LOGO_URL,
      },
      {
        name: "keywords",
        content:
          "todo app, task management, productivity, TanStack, tRPC, PostgreSQL, React, TypeScript, full-stack",
      },
    ],
  }),
});

function Home() {
  const { i18n, t } = useLingui();
  const trpc = useTRPC();
  const todosQuery = useSuspenseQuery(trpc.todo.list.queryOptions());
  const todos = todosQuery.data;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString(i18n.locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.NOT_STARTED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case TodoStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case TodoStatus.COMPLETED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.NOT_STARTED:
        return t`Not Started`;
      case TodoStatus.IN_PROGRESS:
        return t`In Progress`;
      case TodoStatus.COMPLETED:
        return t`Completed`;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">
          <Trans>My Todos</Trans>
        </h2>
        <TodoForm>
          <Button variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <Trans>Add Todo</Trans>
          </Button>
        </TodoForm>
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            <Trans>No todos yet</Trans>
          </p>
          <TodoForm>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <Trans>Create your first todo</Trans>
            </Button>
          </TodoForm>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Trans>Task</Trans>
                </TableHead>
                <TableHead className="w-[120px]">
                  <Trans>Status</Trans>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Trans>Active</Trans>
                </TableHead>
                <TableHead className="w-[180px]">
                  <Trans>Created</Trans>
                </TableHead>
                <TableHead className="w-[180px]">
                  <Trans>Updated</Trans>
                </TableHead>
                <TableHead className="w-[150px] text-right">
                  <Trans>Actions</Trans>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/todo/$todoId"
                      params={{ todoId: todo.id }}
                      className="hover:text-primary hover:underline"
                    >
                      {todo.text}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 font-medium text-xs ring-1 ring-gray-500/10 ring-inset ${getStatusColor(
                        todo.status,
                      )}`}
                    >
                      {getStatusLabel(todo.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 font-medium text-xs ${
                        todo.active
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20 ring-inset"
                          : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/10 ring-inset"
                      }`}
                    >
                      {todo.active ? t`Active` : t`Inactive`}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(todo.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(todo.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <Link to="/todo/$todoId" params={{ todoId: todo.id }}>
                          <Eye className="h-3 w-3" />
                          <Trans>View</Trans>
                        </Link>
                      </Button>
                      <TodoForm todo={todo}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Pencil className="h-3 w-3" />
                          <Trans>Edit</Trans>
                        </Button>
                      </TodoForm>
                      <TodoDelete todo={todo}>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Trash2 className="h-3 w-3" />
                          <Trans>Delete</Trans>
                        </Button>
                      </TodoDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
