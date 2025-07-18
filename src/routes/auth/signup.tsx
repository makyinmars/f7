import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ContentLayout from "@/components/common/content-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiUserSignup, type UserSignup } from "@/db/schema/auth";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { useTRPC } from "@/trpc/react";

export const Route = createFileRoute("/auth/signup")({
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(
      context.trpc.auth.getSession.queryOptions()
    );

    if (auth?.session) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();
  const { loginWithSocial } = useLogin();
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<UserSignup>({
    resolver: zodResolver(apiUserSignup),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const register = useRegister({
    onSuccess: async () => {
      toast.success(
        t`Account created successfully! Please check your email to verify your account.`
      );
      form.reset();
      await queryClient.invalidateQueries(trpc.auth.getSession.queryFilter());
      await router.navigate({
        to: "/dashboard",
      });
    },
    onError: (error) => {
      toast.error(t`Registration failed: Please try again`);
      console.error("Registration error:", error);
    },
  });

  const onSubmit = async (data: UserSignup) => {
    try {
      await register.mutateAsync(data);
    } catch {}
  };

  const handleGoogleSignup = async () => {
    await loginWithSocial.mutateAsync({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <ContentLayout>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            className="flex items-center gap-2 self-center font-medium"
            to="/"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  <Trans>Create an account</Trans>
                </CardTitle>
                <CardDescription>
                  <Trans>Sign up with your Google account or email</Trans>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      className="w-full"
                      disabled={loginWithSocial.isPending}
                      onClick={handleGoogleSignup}
                      variant="outline"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Google</title>
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <Trans>Sign up with Google</Trans>
                    </Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                      <Trans>Or continue with</Trans>
                    </span>
                  </div>
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Trans>Full Name</Trans>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t`John Doe`}
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Trans>Email</Trans>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t`m@example.com`}
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Trans>Password</Trans>
                            </FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full"
                        disabled={register.isPending}
                        type="submit"
                      >
                        <Trans>Create account</Trans>
                      </Button>
                    </form>
                  </Form>
                  <div className="text-center text-sm">
                    <Trans>Already have an account?</Trans>{" "}
                    <Link className="underline underline-offset-4" to="/auth">
                      <Trans>Sign in</Trans>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-balance text-center text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
              <Trans>By clicking continue, you agree to our</Trans>{" "}
              <Link to="/">
                <Trans>Terms of Service</Trans>
              </Link>{" "}
              <Trans>and</Trans>{" "}
              <Link to="/">
                <Trans>Privacy Policy</Trans>
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
