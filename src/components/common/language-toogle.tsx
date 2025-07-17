import { useLingui } from "@lingui/react";
import { useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setHeader } from "@tanstack/react-start/server";
import { serialize } from "cookie-es";
import { cn } from "@/lib/utils";
import { dynamicActivate, locales } from "@/modules/lingui/i18n";

const updateLanguage = createServerFn({ method: "POST" })
  .validator((locale: string) => locale)
  .handler(({ data }) => {
    setHeader(
      "Set-Cookie",
      serialize("locale", data, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
    );
  });

const LanguageToggle = () => {
  const { i18n } = useLingui();
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "relative flex h-8 items-center rounded-lg bg-background p-1 ring-1 ring-border"
      )}
    >
      {Object.entries(locales).map(([locale, label]) => {
        const isActive = locale === i18n.locale;
        return (
          <button
            className={cn(
              "relative rounded-lg px-3 py-0.5 font-medium text-sm transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-primary"
            )}
            key={locale}
            onClick={async () => {
              try {
                // Run both operations in parallel for better performance
                await Promise.all([
                  updateLanguage({ data: locale }),
                  dynamicActivate(i18n, locale),
                ]);

                // Update html lang attribute for accessibility
                document.documentElement.lang = locale;

                // Optionally refresh the current route to update any translated content
                // This is much gentler than a full page reload
                navigate({ to: window.location.pathname, replace: true });
              } catch (error) {
                console.error(error);
              }
            }}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
