import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { MEDIA_FIELDS } from "../fragments/media";
import { LINK_FIELDS, TITLE_FIELDS } from "../fragments/shared";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import { BANNER_FIELDS_FRAGMENT } from "../fragments/banner";
import { CTA_FIELDS_FRAGMENT } from "../fragments/cta";
import {
  PROMO_RELATION_FRAGMENT,
  CONTENT_RELATION_FRAGMENT,
  BANNER_RELATION_FRAGMENT,
  CTA_RELATION_FRAGMENT,
  CAPABILITIES_RELATION_FRAGMENT,
  VIDEO_RELATION_FRAGMENT,
  ANIMATION_BANNER_FRAGMENT,
  TESTIMONIAL_RELATION_FRAGMENT,
} from "../fragments/dynamicZone";
import type { StandardPageData } from "@/lib/schemas/dynamicZoneSchema";

export interface PageItemData extends StandardPageData {
  documentId?: string;
  internalName?: string;
  pageType?: "Standard" | "Dark" | "Light" | "LegalPolicy" | "FullWidth" | string;
  variant?: "default" | "dark" | "light" | "legal_policy" | string;
  sections?: any[];
}

export interface GetPageBySlugResponse {
  pages: PageItemData[];
}

export const GET_PAGE_BY_SLUG = gql`
  ${MEDIA_FIELDS}
  ${LINK_FIELDS}
  ${TITLE_FIELDS}
  ${PAGE_HEADING_FRAGMENT}
  ${BANNER_FIELDS_FRAGMENT}
  ${CTA_FIELDS_FRAGMENT}
  ${PROMO_RELATION_FRAGMENT}
  ${CONTENT_RELATION_FRAGMENT}
  ${BANNER_RELATION_FRAGMENT}
  ${CTA_RELATION_FRAGMENT}
  ${CAPABILITIES_RELATION_FRAGMENT}
  ${VIDEO_RELATION_FRAGMENT}
  ${ANIMATION_BANNER_FRAGMENT}
  ${TESTIMONIAL_RELATION_FRAGMENT}
  query GetPageBySlug($slug: String, $slugWithSlash: String) {
    pages(
      filters: {
        or: [
          { pageHeading: { PageHeading: { slug: { eq: $slug } } } }
          { pageHeading: { PageHeading: { slug: { eq: $slugWithSlash } } } }
        ]
      }
    ) {
      documentId
      internalName
      pageType
      variant
      pageHeading {
        ...PageHeadingFields
      }
      sections {
        __typename
        ... on ComponentContentRelationPromoRelation {
          ...PromoRelationFields
        }
        ... on ComponentContentRelationContentRelation {
          ...ContentRelationFields
        }
        ... on ComponentContentRelationBannerRelation {
          ...BannerRelationFields
        }
        ... on ComponentContentRelationCtaRelation {
          ...CtaRelationFields
        }
        ... on ComponentContentRelationCapabilitiesRelation {
          ...CapabilitiesRelationFields
        }
        ... on ComponentMediaRelationVideoRelation {
          ...VideoRelationFields
        }
        ... on ComponentAiAnimationBanner {
          ...AnimationBannerFields
        }
        ... on ComponentContentRelationTestimonialRelation {
          ...TestimonialRelationFields
        }
      }
    }
  }
`;

import { cache } from "react";

/**
 * Universal Query function to fetch any Dynamic Page by its slug
 * Memoized with React cache() to prevent duplicate requests between generateMetadata and Page components.
 */
export const getPageBySlug = cache(async (slug: string): Promise<PageItemData | null> => {
  const cleanSlug = slug.replace(/^\/+/, "");
  const slugWithSlash = `/${cleanSlug}`;

  const data = await fetchStrapi<GetPageBySlugResponse>(
    GET_PAGE_BY_SLUG,
    { slug: cleanSlug, slugWithSlash },
    {
      queryName: "GetPageBySlug",
      tags: ["pages", "page", `page:${cleanSlug || "home"}`],
      revalidate: 60,
    }
  );

  return data?.pages?.[0] || null;
});
