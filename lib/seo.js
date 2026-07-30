// /lib/seo.js
export const defaultSEO = {
  title: "Smart Family Life by Lobbium",
  description:
    "Clever sparen, Alltag organisieren und Kinder fördern – mit Lobbium. Spartipps, Alltag & Bildungsideen für Familien.",
  url: "https://www.lobbium.com",
  image: "/logo.png",
  keywords:
    "Familienleben, Spartipps, Kinder, Finanzen, Erziehung, Alltag, Bildung, Nachhaltigkeit",
};

export function generateMetadata({ title, description, path }) {
  const fullTitle = title
    ? `${title} | Smart Family Life by Lobbium`
    : defaultSEO.title;

  const fullUrl = `${defaultSEO.url}${path || ""}`;
  const metaDescription = description || defaultSEO.description;

  return {
    metadataBase: new URL(defaultSEO.url),
    title: fullTitle,
    description: metaDescription,
    keywords: defaultSEO.keywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: fullUrl,
      images: [defaultSEO.image],
      type: "website",
      siteName: "Smart Family Life",
      locale: "de_DE",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [defaultSEO.image],
    },
  };
}