import type { I18n } from "@lingui/core";
import { TRPCError } from "@trpc/server";

/**
 * Helper function to create translated tRPC errors
 */
export function createTranslatedError(
  i18n: I18n | undefined,
  code: "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "UNAUTHORIZED",
  fallbackMessage: string
) {
  // Use the fallback message as the translation key and fallback
  const message = i18n?._(fallbackMessage) ?? fallbackMessage;

  return new TRPCError({
    code,
    message,
  });
}

/**
 * Predefined error creators with i18n support
 */
export const createErrors = (i18n: I18n | undefined) => ({
  todoNotFound: () =>
    createTranslatedError(i18n, "NOT_FOUND", "Todo not found"),

  invalidInput: () =>
    createTranslatedError(i18n, "BAD_REQUEST", "Invalid input"),

  todoDeleteFailed: () =>
    createTranslatedError(
      i18n,
      "INTERNAL_SERVER_ERROR",
      "Failed to delete todo"
    ),

  todoUpdateFailed: () =>
    createTranslatedError(
      i18n,
      "INTERNAL_SERVER_ERROR",
      "Failed to update todo"
    ),

  todoCreateFailed: () =>
    createTranslatedError(
      i18n,
      "INTERNAL_SERVER_ERROR",
      "Failed to create todo"
    ),
});
