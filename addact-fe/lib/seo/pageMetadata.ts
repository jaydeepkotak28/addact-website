import type { Metadata } from "next";
import { generateStrapiMetadata } from "@/lib/seo";

export interface PageMetadataDefaults {
  fallbackTitle?: string;
  fallbackDescription?: string;
  siteName?: string;
}

export interface PageLikeData {
  internalName?: string;
  pageHeading?: {
    PageHeading?: {
      pageTitle?: string;
      slug?: string;
    };
    seo?: any;
  } | null;
}

/**
 * Universal Page Metadata Generator for Next.js App Router
 * 
 * Automatically resolves page SEO from Strapi pageHeading, falls back to
 * pageTitle or internalName, and applies sensible defaults.
 * 
 * @example
 * export async function generateMetadata(): Promise<Metadata> {
 *   const page = await getPageBySlug("about");
 *   return generatePageMetadata(page, { fallbackTitle: "About Us" });
 * }
 */
export function generatePageMetadata(
  page?: PageLikeData | null,
  defaults: PageMetadataDefaults = {}
): Metadata {
  const siteName = defaults.siteName || "Addact Technologies";
  const defaultFallback = defaults.fallbackTitle || siteName;

  if (!page) {
    return {
      title: defaultFallback,
      description: defaults.fallbackDescription,
    };
  }

  const seo = page.pageHeading?.seo;
  const pageHeadingTitle = page.pageHeading?.PageHeading?.pageTitle;
  const computedFallbackTitle = pageHeadingTitle || page.internalName || defaultFallback;

  const strapiMeta = generateStrapiMetadata(seo);

  const title = seo?.metaTitle || computedFallbackTitle;
  const description = seo?.metaDescription || strapiMeta.description || defaults.fallbackDescription;

  return {
    ...strapiMeta,
    title,
    ...(description ? { description } : {}),
  };
}

export default generatePageMetadata;
