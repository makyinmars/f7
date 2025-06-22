import { i18n } from "@lingui/core";
import { StartClient } from "@tanstack/react-start";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { dynamicActivate } from "./modules/lingui/i18n";
import { createRouter } from "./router";
import { configureZodLocaleStatic } from "./utils/zod-i18n";

// The lang should be set by the server
const currentLocale = document.documentElement.lang;
await dynamicActivate(i18n, currentLocale);

// Configure Zod with the current locale
await configureZodLocaleStatic(currentLocale);

const router = createRouter({ i18n });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient router={router} />
    </StrictMode>,
  );
});
