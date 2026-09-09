import type { Metadata } from "next";
import type { SeoData } from "@/lib/schemas/dynamicZoneSchema";

/**
 * Reusable SEO Metadata Generator for Next.js App Router
 * Transforms Strapi SEO component data into Next.js Metadata object.
 * If SEO data or component is null, returns an empty object without static fallbacks.
 */
export function generateStrapiMetadata(seo?: SeoData | null): Metadata {
  if (!seo) {
    return {};
  }

  const metadata: Metadata = {};

  if (seo.metaTitle) {
    metadata.title = seo.metaTitle;
  }

  if (seo.metaDescription) {
    metadata.description = seo.metaDescription;
  }

  if (seo.metaRobots) {
    metadata.robots = seo.metaRobots;
  }

  if (seo.canonicalURL) {
    metadata.alternates = {
      canonical: seo.canonicalURL,
    };
  }

  // OpenGraph
  const hasOg = Boolean(
    seo.ogTitle ||
    seo.ogDescription ||
    seo.ogImage?.url
  );

  if (hasOg) {
    metadata.openGraph = {
      ...(seo.ogTitle ? { title: seo.ogTitle } : {}),
      ...(seo.ogDescription ? { description: seo.ogDescription } : {}),
      ...(seo.ogImage?.url
        ? {
            images: [
              {
                url: seo.ogImage.url,
                width: seo.ogImage.width || undefined,
                height: seo.ogImage.height || undefined,
                alt: seo.ogImage.alternativeText || undefined,
              },
            ],
          }
        : {}),
    };
  }

  // Twitter
  const hasTwitter = Boolean(
    seo.twitterCardTitle ||
    seo.ogImage?.url
  );

  if (hasTwitter) {
    metadata.twitter = {
      card: "summary_large_image",
      ...(seo.twitterCardTitle ? { title: seo.twitterCardTitle } : {}),
      ...(seo.ogImage?.url ? { images: [seo.ogImage.url] } : {}),
    };
  }

  // Additional metadata
  const otherTags: Record<string, string> = {};
  if (seo.languageTag) {
    otherTags["content-language"] = seo.languageTag;
  }
  if (seo.structuredData) {
    otherTags["structured-data"] =
      typeof seo.structuredData === "string"
        ? seo.structuredData
        : JSON.stringify(seo.structuredData);
  }

  if (Object.keys(otherTags).length > 0) {
    metadata.other = otherTags;
  }

  return metadata;
}

export default generateStrapiMetadata;
