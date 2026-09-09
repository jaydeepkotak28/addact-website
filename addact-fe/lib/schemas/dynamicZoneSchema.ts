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
 * SEO Component Schema
 */
export const SeoSchema = z
  .object({
    metaTitle: z.string().nullable().optional(),
    metaDescription: z.string().nullable().optional(),
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
