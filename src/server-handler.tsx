import { i18n } from "@lingui/core";
import {
  defineHandlerCallback,
  renderRouterToStream,
} from "@tanstack/react-router/ssr/server";
import { StartServer } from "@tanstack/react-start/server";
import { setupLocaleFromRequest } from "@/modules/lingui/i18n.server";

export const customHandler = defineHandlerCallback(
  async ({ request, router, responseHeaders }) => {
    await setupLocaleFromRequest(i18n);

    return renderRouterToStream({
      request,
      router,
      responseHeaders,
      children: <StartServer router={router} />,
    });
  }
);
