import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Todo } from "@/db/schema/todo";
import { useTRPC } from "@/trpc/react";

interface TodoDeleteProps {
  todo: Todo;
  children?: React.ReactNode;
}

const TodoDelete = ({ todo, children }: TodoDeleteProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const location = useLocation();

  // Check if we're on a todo detail page
  const isOnTodoDetailPage = location.pathname.startsWith("/todo/");

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
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
          return old.filter((item) => item.id !== variables.id);
        });

        return { previousData };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(
          trpc.todo.list.queryKey(),
          context?.previousData,
        );
      },
      onSuccess: (_deleted) => {
        // Navigate to home if we're on a todo detail page
        if (isOnTodoDetailPage) {
          router.navigate({ to: "/" });
        }
        // Toast is handled by toast.promise below
      },
    }),
  );

  const handleDelete = () => {
    toast.promise(deleteMutation.mutateAsync({ id: todo.id }), {
      loading: "Deleting todo...",
      success: (deleted) => `"${deleted.text}" has been removed from your list`,
      error: (err) => `Error deleting todo: ${err.message}`,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the todo
            "{todo.text}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TodoDelete;
