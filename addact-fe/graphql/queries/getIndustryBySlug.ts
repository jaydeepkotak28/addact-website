import { gql } from "graphql-request";
import { cache } from "react";
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
  AI_ECOSYSTEMS_RELATION_FRAGMENT,
  WHO_WE_ARE_RELATION_FRAGMENT,
  WHY_ADDACT_RELATION_FRAGMENT,
} from "../fragments/dynamicZone";
import type {
  PageHeadingStructure,
  StandardPageData,
} from "@/lib/schemas/dynamicZoneSchema";

export interface IndustryChildItem {
  documentId?: string;
  internalName?: string;
  industryTitle?: string | null;
  pageHeading?: PageHeadingStructure | null;
}

export interface IndustryParentChain {
  internalName?: string;
  industryTitle?: string | null;
  pageHeading?: PageHeadingStructure | null;
  parent?: IndustryParentChain | null;
}

export interface IndustryItemData extends StandardPageData {
  documentId?: string;
  internalName?: string;
  industryTitle?: string | null;
  pageType?: "Standard" | "Dark" | "Light" | "LegalPolicy" | "FullWidth" | string;
  variant?: "default" | "dark" | "light" | "legal_policy" | string;
  pageHeading?: PageHeadingStructure | null;
  parent?: IndustryParentChain | null;
  children?: IndustryChildItem[] | null;
  sections?: any[];
}

export interface GetIndustriesResponse {
  industries: IndustryItemData[];
}

export const GET_INDUSTRY_BY_SLUG = gql`
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
  ${AI_ECOSYSTEMS_RELATION_FRAGMENT}
  ${WHO_WE_ARE_RELATION_FRAGMENT}
  ${WHY_ADDACT_RELATION_FRAGMENT}
  query GetIndustryBySlug(
    $slug: String
    $slugWithSlash: String
    $baseSlug: String
    $baseSlugWithSlash: String
  ) {
    industries(
      filters: {
        or: [
          { pageHeading: { PageHeading: { slug: { eq: $slug } } } }
          { pageHeading: { PageHeading: { slug: { eq: $slugWithSlash } } } }
          { pageHeading: { PageHeading: { slug: { eq: $baseSlug } } } }
          { pageHeading: { PageHeading: { slug: { eq: $baseSlugWithSlash } } } }
        ]
      }
    ) {
      documentId
      internalName
      industryTitle
      pageType
      variant
      pageHeading {
        ...PageHeadingFields
      }
      parent {
        internalName
        industryTitle
        pageHeading {
          ...PageHeadingFields
        }
        parent {
          internalName
          industryTitle
          pageHeading {
            ...PageHeadingFields
          }
          parent {
            internalName
            industryTitle
            pageHeading {
              ...PageHeadingFields
            }
            parent {
              internalName
              industryTitle
              pageHeading {
                ...PageHeadingFields
              }
            }
          }
        }
      }
      children {
        documentId
        internalName
        industryTitle
        pageHeading {
          ...PageHeadingFields
        }
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
        ... on ComponentContentRelationAiEcosystemsRelation {
          ...AiEcosystemsRelationFields
        }
        ... on ComponentContentRelationWhoWeAreRelation {
          ...WhoWeAreRelationFields
        }
        ... on ComponentContentRelationWhyAddactRelation {
          ...WhyAddactRelationFields
        }
      }
    }
  }
`;

/**
 * Fetch a multi-layer industry page by slug with recursive parent and child hierarchies
 */
export const getIndustryBySlug = cache(async (slug: string): Promise<IndustryItemData | null> => {
  const cleanSlug = slug.replace(/^\/+/, "");
  const slugWithSlash = `/${cleanSlug}`;

  // Extract base slug without 'industries/' prefix if applicable
  const baseSlug = cleanSlug.startsWith("industries/")
    ? cleanSlug.replace(/^industries\//, "")
    : cleanSlug;
  const baseSlugWithSlash = `/${baseSlug}`;

  try {
    const data = await fetchStrapi<GetIndustriesResponse>(
      GET_INDUSTRY_BY_SLUG,
      {
        slug: cleanSlug,
        slugWithSlash,
        baseSlug,
        baseSlugWithSlash,
      },
      {
        queryName: "GetIndustryBySlug",
        tags: ["industries", `industry:${cleanSlug}`],
        revalidate: 60,
      }
    );

    return data?.industries?.[0] || null;
  } catch (error) {
    console.error(`[getIndustryBySlug] Error fetching industry for slug "${slug}":`, error);
    return null;
  }
});

export default getIndustryBySlug;
