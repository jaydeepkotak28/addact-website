import { z } from "zod";

/**
 * Shared Strapi Media Schema & Type
 */
export const StrapiMediaSchema = z.object({
  url: z.string().nullable().optional(),
  alternativeText: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
});

export type StrapiMedia = z.infer<typeof StrapiMediaSchema>;

/**
 * Common Props for all Promo-based Organism Components
 * (AboutUsContent, WeAreAddact, etc.)
 */
export interface BasePromoProps {
  subtitle?: string | null;
  subTitle?: string | null;
  title?: string | null;
  content?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
  anchorId?: string | null;
  className?: string;
  [key: string]: any;
}

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
 * Zod Schema for 'feature.promo' component
 */
export const PromoBlockSchema = z.object({
  __typename: z.literal("ComponentFeaturePromo").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  variant: z
    .enum([
      "about_us_content",
      "our_vision_mission",
      "we_are_addact",
      "stacked_image_bottom",
      "stacked-image-bottom",
      "image-right",
      "image-left",
    ])
    .optional(),
  anchorId: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  subTitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  image: z
    .object({
      url: z.string(),
      alternativeText: z.string().nullable().optional(),
      width: z.number().nullable().optional(),
      height: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type PromoBlockData = z.infer<typeof PromoBlockSchema>;

export const PromoItemSchema = z.object({
  internalName: z.string().nullable().optional(),
  promo: PromoBlockSchema.nullable().optional(),
});

export type PromoItemData = z.infer<typeof PromoItemSchema>;

/**
 * Zod Schema for 'content-relation.promo-relation' component
 * Supports multiple promo relations (promos array) or single (promo)
 */
export const PromoRelationBlockSchema = z.object({
  __typename: z.literal("ComponentContentRelationPromoRelation").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  promos: z.array(PromoItemSchema).nullable().optional(),
  promo: PromoItemSchema.nullable().optional(),
});

export type PromoRelationBlockData = z.infer<typeof PromoRelationBlockSchema>;

/**
 * Shared Link Component Schema ('shared.link')
 */
export const SharedLinkSchema = z.object({
  href: z.string().default("/"),
  label: z.string().default("Read Now"),
  target: z.enum(["_self", "_blank", "_parent", "_top"]).default("_self"),
  isExternal: z.boolean().default(false),
  subDisc: z.string().nullable().optional(),
  icon: StrapiMediaSchema.nullable().optional(),
});

export type SharedLink = z.infer<typeof SharedLinkSchema>;

/**
 * Shared Title Component Schema ('shared.title')
 */
export const SharedTitleSchema = z.object({
  title: z.string().nullable().optional(),
  tag: z.enum(["H1", "H2", "H3", "H4", "H5", "H6"]).nullable().optional(),
});

export type SharedTitle = z.infer<typeof SharedTitleSchema>;

/**
 * Core Banner Entity Schema (matches Strapi 'api::banner.banner')
 * Reuses StrapiMedia, SharedLink, and SharedTitle field types.
 */
export const BannerSchema = z.object({
  documentId: z.string().optional(),
  internalName: z.string().optional(),
  bannerTitle: z.string().nullable().optional(),
  bannerDescription: z.string().nullable().optional(),
  bannerImage: StrapiMediaSchema.nullable().optional(),
  bannerLink: SharedLinkSchema.nullable().optional(),
  showSearchbox: z.boolean().default(false).optional(),
  bannerLogo: StrapiMediaSchema.nullable().optional(),
  videoLink: z.string().nullable().optional(),
  isVideo: z.boolean().default(false).optional(),
  isTextAlignCenter: z.boolean().default(false).optional(),
  chipsText: z.array(SharedTitleSchema).nullable().optional(),
  anchorLinks: z.array(SharedLinkSchema).nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
});

export type BannerData = z.infer<typeof BannerSchema>;

/**
 * Zod Schema for 'content-relation.banner-relation' component
 * Reuses BannerData schema and type.
 */
export const BannerRelationBlockSchema = z.object({
  __typename: z.literal("ComponentContentRelationBannerRelation").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  banner: BannerSchema.nullable().optional(),
});

export type BannerRelationBlockData = z.infer<typeof BannerRelationBlockSchema>;

/**
 * Core CTA Entity Schema (matches Strapi 'api::cta.cta')
 */
export const CtaSchema = z.object({
  documentId: z.string().optional(),
  internalName: z.string().nullable().optional(),
  title: SharedTitleSchema.nullable().optional(),
  description: z.any().nullable().optional(),
  image: StrapiMediaSchema.nullable().optional(),
  link: SharedLinkSchema.nullable().optional(),
});

export type CtaData = z.infer<typeof CtaSchema>;

/**
 * Zod Schema for 'content-relation.cta-relation' component
 */
export const CtaRelationBlockSchema = z.object({
  __typename: z.literal("ComponentContentRelationCtaRelation").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  cta: CtaSchema.nullable().optional(),
});

export type CtaRelationBlockData = z.infer<typeof CtaRelationBlockSchema>;


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
  ComponentContentRelationPromoRelation: PromoRelationBlockData;
  "content-relation.promo-relation": PromoRelationBlockData;
  ComponentContentRelationBannerRelation: BannerRelationBlockData;
  "content-relation.banner-relation": BannerRelationBlockData;
  ComponentContentRelationCtaRelation: CtaRelationBlockData;
  "content-relation.cta-relation": CtaRelationBlockData;
  ComponentFeaturePromo: PromoBlockData;
  "feature.promo": PromoBlockData;
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
  | (DynamicZoneBlock &
      Partial<ContentRelationBlockData> &
      Partial<ContentBlockData> &
      Partial<PromoRelationBlockData> &
      Partial<BannerRelationBlockData> &
      Partial<CtaRelationBlockData>)
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
  section?: DynamicZone<TPrimarySection>;
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
 * 1. Relation Body title or Promo title inside Dynamic Zone (if available)
 * 2. PageHeading component (pageHeading.PageHeading.pageTitle)
 * 3. Fallback string
 */
export function getPageHeading(
  page?: StandardPageData | null,
  fallback = ""
): string {
  if (!page) return fallback;

  // Priority 1: Relation content title (Content Relation or Promo Relation)
  const sections = page.Section || page.section;
  const relationBlock = sections?.find(
    (s: any) =>
      s?.content?.Body?.title ||
      s?.promo?.promo?.title ||
      s?.promos?.[0]?.promo?.title ||
      s?.title
  );

  const title =
    (relationBlock as any)?.content?.Body?.title ||
    (relationBlock as any)?.promo?.promo?.title ||
    (relationBlock as any)?.promos?.[0]?.promo?.title ||
    (relationBlock as any)?.title;

  if (title && typeof title === "string" && title.trim()) {
    return title.trim();
  }

  // Priority 2: Strapi PageHeading component
  const pageTitle = page.pageHeading?.PageHeading?.pageTitle;
  if (pageTitle && typeof pageTitle === "string" && pageTitle.trim()) {
    return pageTitle.trim();
  }

  return fallback;
}

