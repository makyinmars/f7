import { i18n } from "@lingui/core";
import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { dynamicActivate } from "./modules/lingui/i18n";

// The lang should be set by the server
const currentLocale = document.documentElement.lang;
await dynamicActivate(i18n, currentLocale);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  );
});
