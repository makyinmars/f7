import type { I18n } from "@lingui/core";
import {
  getCookies,
  getRequest,
  getRequestHeaders,
  setResponseHeader,
} from "@tanstack/react-start/server";
import { serialize } from "cookie-es";
import { defaultLocale, dynamicActivate, isLocaleValid } from "./i18n";

function getLocaleFromRequest() {
  const request = getRequest();
  const headers = getRequestHeaders();
  const cookies = getCookies();

  const url = new URL(request.url);
  const queryLocale = url.searchParams.get("locale") ?? "";

  if (isLocaleValid(queryLocale)) {
    setResponseHeader(
      "Set-Cookie",
      serialize("locale", queryLocale, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
    );

    return queryLocale;
  }

  if (cookies.locale && isLocaleValid(cookies.locale)) {
    return cookies.locale;
  }

  // Mostly used for API requests
  const acceptLanguage = headers.get("accept-language");
  if (acceptLanguage && isLocaleValid(acceptLanguage)) {
    return acceptLanguage;
  }

  setResponseHeader(
    "Set-Cookie",
    serialize("locale", defaultLocale, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    })
  );

  return defaultLocale;
}

export async function setupLocaleFromRequest(i18n: I18n) {
  await dynamicActivate(i18n, getLocaleFromRequest());
}
