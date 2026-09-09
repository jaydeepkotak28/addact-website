import { z } from "zod";

/**
 * Zod Schema for 'feature.content' CKEditor component
 */
export const ContentBlockSchema = z.object({
  __typename: z.literal("ComponentFeatureContent").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  body: z.string().nullable().optional(),
});

export type ContentBlockData = z.infer<typeof ContentBlockSchema>;

/**
 * Zod Schema for 'content-relation.content-relation' component
 */
export const ContentRelationBlockSchema = z.object({
  __typename: z.literal("ComponentContentRelationContentRelation").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  content: z
    .object({
      internalName: z.string().nullable().optional(),
      Body: z
        .object({
          title: z.string().nullable().optional(),
          description: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    })
    .nullable()
    .optional(),
});

export type ContentRelationBlockData = z.infer<typeof ContentRelationBlockSchema>;

/**
 * Generic Dynamic Zone Block Schema
 * Captures __typename and any component-specific props
 */
export const DynamicZoneBlockSchema = z
  .object({
    __typename: z.string(),
    id: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

export type DynamicZoneBlock = z.infer<typeof DynamicZoneBlockSchema>;

/**
 * Dynamic Zone Array Schema (Sections)
 */
export const DynamicZoneSectionsSchema = z.array(DynamicZoneBlockSchema);

export type DynamicZoneSections = z.infer<typeof DynamicZoneSectionsSchema>;

/**
 * SEO Media / Image Schema
 */
export const SeoImageSchema = z
  .object({
    url: z.string().optional(),
    alternativeText: z.string().nullable().optional(),
    width: z.number().nullable().optional(),
    height: z.number().nullable().optional(),
  })
  .nullable()
  .optional();

export type SeoImageData = z.infer<typeof SeoImageSchema>;

/**
 * Full SEO Component Schema (matches Strapi site-settings.seo)
 */
export const SeoSchema = z
  .object({
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
    ogTitle: z.string().nullable().optional(),
    ogDescription: z.string().nullable().optional(),
    ogImage: SeoImageSchema,
    metaRobots: z.string().nullable().optional(),
    twitterCardTitle: z.string().nullable().optional(),
    canonicalURL: z.string().nullable().optional(),
    structuredData: z.any().optional(),
    languageTag: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export type SeoData = z.infer<typeof SeoSchema>;

/**
 * Page Heading Component Schema
 */
export const PageHeadingSchema = z
  .object({
    pageTitle: z.string().optional(),
    slug: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export type PageHeadingData = z.infer<typeof PageHeadingSchema>;

/* =========================================================================
 * 1. COMPONENT KEY-VALUE MAP (Single Source of Truth)
 * ========================================================================= */

/**
 * Key-Value Pair Map of Strapi Dynamic Zone Components.
 * Key: Component __typename (from GraphQL)
 * Value: Component Data / Props Interface
 * 
 * Best Practice: Jab bhi naya component banayein, bas ek line yahan add karein.
 */
export interface DynamicZoneComponentMap {
  ComponentFeatureContent: ContentBlockData;
  "feature.content": ContentBlockData;
  ComponentContentRelationContentRelation: ContentRelationBlockData;
  "content-relation.content-relation": ContentRelationBlockData;
  // Future components:
  // ComponentHeroHero: HeroBlockData;
  // ComponentFeatureAccordion: AccordionBlockData;
  [componentTypename: string]: any;
}

/**
 * Base block interface for any Strapi Dynamic Zone Component
 */
export interface BaseDynamicZoneBlock {
  __typename: string;
  id?: string | number;
  [key: string]: any;
}

/**
 * Auto-derived Union of all known Dynamic Zone Blocks
 * Derived directly from DynamicZoneComponentMap for 100% DRY compliance.
 */
export type KnownDynamicZoneBlock = DynamicZoneComponentMap[keyof DynamicZoneComponentMap];

export type AnyDynamicZoneBlock =
  | (DynamicZoneBlock & Partial<ContentRelationBlockData> & Partial<ContentBlockData>)
  | KnownDynamicZoneBlock
  | BaseDynamicZoneBlock;

/**
 * Generic Dynamic Zone Type
 * Represents any dynamic zone in Strapi (e.g. Section, heroZone, footerBlocks, sidebar)
 */
export type DynamicZone<TBlock = AnyDynamicZoneBlock> = TBlock[] | null;

/* =========================================================================
 * 2. PAGE STRUCTURE & DYNAMIC ZONES MAP
 * ========================================================================= */

/**
 * Page Structure Component (page-structure.page)
 * Common heading and SEO wrapper for all Strapi pages.
 */
export interface PageHeadingStructure {
  PageHeading?: PageHeadingData;
  seo?: SeoData;
}

/**
 * Key-Value Pair Map for a page containing multiple dynamic zones.
 */
export interface DynamicZonesMap {
  Section?: DynamicZone;
  heroZone?: DynamicZone;
  bannerZone?: DynamicZone;
  footerZone?: DynamicZone;
  [zoneName: string]: DynamicZone | undefined;
}

/**
 * Reusable & Extensible Page Content Interface
 * Supports:
 * - Common `pageHeading` & `Section`
 * - Multiple Dynamic Zones (via index signature or generic TExtra)
 * - Custom page fields returned by Strapi
 */
export interface StandardPageData<
  TPrimarySection = AnyDynamicZoneBlock,
  TExtra = Record<string, any>
> {
  pageHeading?: PageHeadingStructure | null;
  Section?: DynamicZone<TPrimarySection>;
  // Allows any additional dynamic zones or custom fields
  [key: string]: any;
}

/**
 * Helper for pages with multiple explicitly typed Dynamic Zones
 */
export type MultiDynamicZonePage<
  TZones extends Record<string, DynamicZone<any>>,
  TExtra = Record<string, any>
> = {
  pageHeading?: PageHeadingStructure | null;
} & TZones & TExtra;

/* =========================================================================
 * 3. STRAPI PAGES MAP (Key-Value Pair for all 20+ Pages)
 * ========================================================================= */

export interface StrapiPagesMap {
  termsAndCondition: StandardPageData;
  privacyPolicy: StandardPageData;
  home: StandardPageData;
  aboutUs: StandardPageData;
  blog: StandardPageData;
  career: StandardPageData;
  caseStudy: StandardPageData;
  contactUs: StandardPageData;
  aiService: StandardPageData;
  developmentService: StandardPageData;
  digitalMarketingService: StandardPageData;
  qaTestingAndSupport: StandardPageData;
  projectCostEstimator: StandardPageData;
  brandGuideline: StandardPageData;
  pressRelease: StandardPageData;
  video: StandardPageData;
  webinar: StandardPageData;
  sitemapPage: StandardPageData;
  thankYou: StandardPageData;
  [pageKey: string]: StandardPageData;
}

/**
 * Generic response helper for Strapi page queries
 * Example: export type TermsConditionsData = StrapiPageResponse<"termsAndCondition">;
 */
export type StrapiPageResponse<
  Key extends string,
  TPageData = StandardPageData
> = {
  [K in Key]: TPageData | null;
};

/* =========================================================================
 * 4. SMART UTILITY FUNCTIONS (Zero Boilerplate)
 * ========================================================================= */

/**
 * Smart Heading Extractor
 * Automatically extracts the best title for a page based on:
 * 1. Relation Body title inside Dynamic Zone (if available)
 * 2. PageHeading component (pageHeading.PageHeading.pageTitle)
 * 3. Fallback string
 */
export function getPageHeading(
  page?: StandardPageData | null,
  fallback = ""
): string {
  if (!page) return fallback;

  // Priority 1: Relation content title
  const relationTitle = page.Section?.find(
    (s: any) => s?.content?.Body?.title
  )?.content?.Body?.title;

  if (relationTitle && typeof relationTitle === "string" && relationTitle.trim()) {
    return relationTitle.trim();
  }

  // Priority 2: Strapi PageHeading component
  const pageTitle = page.pageHeading?.PageHeading?.pageTitle;
  if (pageTitle && typeof pageTitle === "string" && pageTitle.trim()) {
    return pageTitle.trim();
  }

  return fallback;
}

