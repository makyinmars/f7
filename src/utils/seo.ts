import {
  APP_LOGO_URL,
  APP_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
} from "@/constants/app";

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export const seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = APP_LOGO_URL,
  url,
  type = "website",
}: SEOConfig) => {
  const fullTitle = title ? `${APP_NAME} - ${title}` : APP_NAME;

  const tags = [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "keywords", content: keywords },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@f7stack" },
    { name: "twitter:creator", content: "@f7stack" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },

    // OpenGraph tags (use 'property' not 'name')
    { property: "og:type", content: type },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:site_name", content: APP_NAME },

    // Add canonical URL if provided
    ...(url ? [{ property: "og:url", content: url }] : []),
  ];

  return tags;
};
