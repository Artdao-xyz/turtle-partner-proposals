import type { Metadata } from "next";

const SITE_NAME = "Turtle Partner Proposals";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://turtle-partner-proposals.vercel.app";
}

/** Convert heroImage from frontmatter to absolute URL for OG. */
export function getAbsoluteOgImageUrl(heroImage: string | undefined): string | undefined {
  if (!heroImage?.trim()) return undefined;
  const base = getBaseUrl();
  if (heroImage.startsWith("blob:")) {
    const path = heroImage.slice(5);
    return `${base}/api/hub/blob?path=${encodeURIComponent(path)}`;
  }
  if (heroImage.startsWith("http")) return heroImage;
  const path = heroImage.startsWith("/") ? heroImage : `/hub/images/${heroImage}`;
  return `${base}${path}`;
}

export function buildArticleMetadata({
  title,
  subtitle,
  heroImage,
  slug,
  articlePath,
  isDraft = false,
}: {
  title: string;
  subtitle?: string;
  heroImage?: string;
  slug?: string;
  articlePath?: string;
  isDraft?: boolean;
}): Metadata {
  const base = getBaseUrl();
  const fullTitle = `${title}${isDraft ? " (Draft)" : ""} | ${SITE_NAME}`;
  const description = subtitle?.trim() || undefined;
  const ogImage = getAbsoluteOgImageUrl(heroImage);
  const resolvedPath = articlePath ?? (slug ? `/resource-hub/${slug}` : undefined);
  const url = resolvedPath ? `${base}${resolvedPath}` : undefined;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description: description ?? undefined,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description ?? undefined,
      images: ogImage ? [ogImage] : ["/opengraph-image"],
    },
    ...(isDraft && { robots: { index: false, follow: false } }),
  };
}

export function buildHubListingMetadata(): Metadata {
  const title = `Resource Hub | ${SITE_NAME}`;
  const description =
    "Research, benchmarks, and guides for DeFi incentive programs and liquidity campaigns.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${getBaseUrl()}/resource-hub`,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
