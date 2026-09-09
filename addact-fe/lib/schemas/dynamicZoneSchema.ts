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
