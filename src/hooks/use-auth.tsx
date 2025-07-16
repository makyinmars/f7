import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { ErrorContext } from "better-auth/react";
import type { SocialProvider } from "better-auth/social-providers";
import { authClient } from "@/auth/client";
import { useTRPC } from "@/trpc/react";

const _authQueryKeys = {
  session: ["session"],
};

export const useSession = () => {
  const session = authClient.useSession();
  return session;
};

export const useLogin = () => {
  const router = useRouter();
  const loginWithCredentials = useMutation({
    mutationFn: async ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe: boolean;
    }) => {
      return await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });
    },
    onSuccess(response) {
      if (response.data?.user.id) {
        router.navigate({ to: "/dashboard" });
      }
    },
  });

  const loginWithSocial = useMutation({
    mutationFn: async ({
      provider,
      callbackURL,
    }: {
      provider: SocialProvider;
      callbackURL: string;
    }) =>
      await authClient.signIn.social({
        provider,
        callbackURL: callbackURL || "/",
      }),
  });

  return {
    loginWithCredentials,
    loginWithSocial,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const trpc = useTRPC();
  return useMutation({
    mutationFn: async () => await authClient.signOut(),
    onSettled: async () => {
      await queryClient.invalidateQueries(trpc.auth.getSession.queryFilter());
      await router.navigate({ to: "/" });
    },
  });
};

export const useRegister = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: ErrorContext) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) =>
      await authClient.signUp.email(
        { email, password, name },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: (error: ErrorContext) => {
            onError(error);
          },
        },
      ),
  });
};

export const useAuthHelpers = () => {
  const forgotPassword = useMutation({
    mutationFn: async ({ email }: { email: string }) =>
      await authClient.forgetPassword({ email, redirectTo: "/reset-password" }),
  });

  const resetPassword = useMutation({
    mutationFn: async ({
      newPassword,
      token,
    }: {
      newPassword: string;
      token: string;
    }) => await authClient.resetPassword({ newPassword, token }),
  });

  return {
    forgotPassword,
    resetPassword,
  };
};
