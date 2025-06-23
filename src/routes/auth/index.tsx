import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { apiUserLogin, type LoginForm } from "@/db/schema/auth";
import { useLogin } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLingui();
  const { loginWithCredentials, loginWithSocial } = useLogin();

  const form = useForm<LoginForm>({
    resolver: zodResolver(apiUserLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    toast.promise(
      loginWithCredentials.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: false,
      }),
      {
        loading: t`Logging in...`,
        success: t`Welcome back!`,
        error: (err) =>
          t`Login failed: ${err.message || "Invalid credentials"}`,
      },
    );
  };

  const handleGoogleLogin = () => {
    loginWithSocial.mutate({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
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
                <Trans>Welcome back</Trans>
              </CardTitle>
              <CardDescription>
                <Trans>Login with your Google account</Trans>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={loginWithSocial.isPending}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <title>Google</title>
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <Trans>Login with Google</Trans>
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                  <span className="relative z-10 bg-card px-2 text-muted-foreground">
                    <Trans>Or continue with</Trans>
                  </span>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
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
                              type="email"
                              placeholder={t`m@example.com`}
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
                          <div className="flex items-center">
                            <FormLabel>
                              <Trans>Password</Trans>
                            </FormLabel>
                            <Link
                              to="/"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              <Trans>Forgot your password?</Trans>
                            </Link>
                          </div>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginWithCredentials.isPending}
                    >
                      <Trans>Login</Trans>
                    </Button>
                  </form>
                </Form>
                <div className="text-center text-sm">
                  <Trans>Don't have an account?</Trans>{" "}
                  <Link to="/" className="underline underline-offset-4">
                    <Trans>Sign up</Trans>
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
  );
}
