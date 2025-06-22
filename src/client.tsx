import { i18n } from "@lingui/core";
import { StartClient } from "@tanstack/react-start";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { dynamicActivate } from "./modules/lingui/i18n";
import { createRouter } from "./router";

// The lang should be set by the server
const currentLocale = document.documentElement.lang;
await dynamicActivate(i18n, currentLocale);

const router = createRouter({ i18n });

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient router={router} />
    </StrictMode>,
  );
});
