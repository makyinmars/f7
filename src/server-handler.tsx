import { i18n } from "@lingui/core";
import { defaultStreamHandler, defineHandlerCallback } from "@tanstack/react-start/server";
import { setupLocaleFromRequest } from "@/modules/lingui/i18n.server";

export const customHandler = defineHandlerCallback(async (ctx) => {
  await setupLocaleFromRequest(i18n);

  return defaultStreamHandler(ctx);
});
