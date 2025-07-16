import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  apiTodoCreateAndUpdate,
  type Todo,
  type TodoCreateAndUpdate,
  TodoStatus,
} from "@/db/schema/todo";
import { useTRPC } from "@/trpc/react";

interface TodoFormProps {
  todo?: Todo;
  children?: React.ReactNode;
}

const TodoForm = ({ todo, children }: TodoFormProps) => {
  const { t } = useLingui();
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<TodoCreateAndUpdate>({
    resolver: zodResolver(apiTodoCreateAndUpdate),
    defaultValues: {
      id: todo?.id,
      text: todo?.text || "",
      description: todo?.description || "",
      status: todo?.status || TodoStatus.NOT_STARTED,
      active: todo?.active ?? true,
    },
  });

  // Create mutation with optimistic updates
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: trpc.todo.list.queryKey(),
          exact: true,
        });

        const previousData = queryClient.getQueryData(
          trpc.todo.list.queryKey(),
        );

        // Generate a temporary ID that works on both server and client
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const optimisticTodo: Todo = {
          id: tempId,
          active: variables.active ?? false,
          ...variables,
          description: variables.description ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        queryClient.setQueryData(trpc.todo.list.queryKey(), (old) => {
          if (!old) return [optimisticTodo];
          return [optimisticTodo, ...old];
        });

        return { previousData, optimisticTodo };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(
          trpc.todo.list.queryKey(),
          context?.previousData,
        );
      },
      onSuccess: (created, _variables, context) => {
        queryClient.setQueryData(trpc.todo.list.queryKey(), (old) => {
          if (!old) return [created];
          return old.map((todo) =>
            todo.id === context?.optimisticTodo.id ? created : todo,
          );
        });
        form.reset();
        setOpen(false);
      },
    }),
  );

  // Update mutation with optimistic updates
  const updateMutation = useMutation(
    trpc.todo.update.mutationOptions({
      onMutate: async (variables) => {
        await queryClient.cancelQueries({
          queryKey: trpc.todo.list.queryKey(),
          exact: true,
        });

        const previousData = queryClient.getQueryData(
          trpc.todo.list.queryKey(),
        );

        queryClient.setQueryData(trpc.todo.list.queryKey(), (old) => {
          if (!old) return previousData;
          return old.map((todo) =>
            todo.id === variables.id
              ? { ...todo, ...variables, updatedAt: new Date() }
              : todo,
          );
        });

        return { previousData };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(
          trpc.todo.list.queryKey(),
          context?.previousData,
        );
      },
      onSuccess: async (updated) => {
        queryClient.setQueryData(trpc.todo.list.queryKey(), (old) => {
          if (!old) return [updated];
          return old.map((todo) => (todo.id === updated.id ? updated : todo));
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.todo.byId.queryKey({
            id: updated.id,
          }),
        });
        setOpen(false);
      },
    }),
  );

  const onSubmit = async (data: TodoCreateAndUpdate) => {
    if (data.id) {
      toast.promise(updateMutation.mutateAsync({ ...data }), {
        loading: t`Updating todo...`,
        success: (updated) => t`"${updated.text}" has been updated`,
        error: (err) => t`Error updating todo: ${err.message}`,
      });
    } else {
      toast.promise(createMutation.mutateAsync(data), {
        loading: t`Creating todo...`,
        success: (created) => t`"${created.text}" has been added to your list`,
        error: (err) => t`Error creating todo: ${err.message}`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {todo ? <Trans>Edit Todo</Trans> : <Trans>Create New Todo</Trans>}
          </DialogTitle>
          <DialogDescription>
            {todo ? (
              <Trans>Make changes to your todo item</Trans>
            ) : (
              <Trans>Add a new task to your todo list</Trans>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans>Task</Trans>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t`Enter task description`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans>Description</Trans>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t`Enter optional description`}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Trans>Status</Trans>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t`Select status`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TodoStatus.NOT_STARTED}>
                        <Trans>Not Started</Trans>
                      </SelectItem>
                      <SelectItem value={TodoStatus.IN_PROGRESS}>
                        <Trans>In Progress</Trans>
                      </SelectItem>
                      <SelectItem value={TodoStatus.COMPLETED}>
                        <Trans>Completed</Trans>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>
                      <Trans>Active</Trans>
                    </FormLabel>
                    <div className="text-muted-foreground text-sm">
                      <Trans>Set whether this todo is active</Trans>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={
                todo ? updateMutation.isPending : createMutation.isPending
              }
            >
              {todo ? <Trans>Update Todo</Trans> : <Trans>Create Todo</Trans>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
