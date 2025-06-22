import * as z from "zod/v4";

/**
 * Configure Zod with the appropriate locale
 * @param locale - The locale code ('en' or 'fr')
 */
export async function configureZodLocale(locale: string) {
  try {
    // Dynamically import the locale
    const { default: localeConfig } = await import(
      `zod/v4/locales/${locale}.js`
    );

    // Configure Zod with the locale
    z.config(localeConfig());

    return true;
  } catch (error) {
    console.error(`Failed to load Zod locale for ${locale}:`, error);

    // Fallback to English if locale loading fails
    if (locale !== "en") {
      const { default: enConfig } = await import("zod/v4/locales/en.js");
      z.config(enConfig());
    }

    return false;
  }
}

/**
 * Static imports for better performance on initial load
 */
export async function configureZodLocaleStatic(locale: string) {
  if (locale === "fr") {
    const fr = await import("zod/v4/locales/fr.js");
    z.config(fr.default());
  } else {
    const en = await import("zod/v4/locales/en.js");
    z.config(en.default());
  }
}
