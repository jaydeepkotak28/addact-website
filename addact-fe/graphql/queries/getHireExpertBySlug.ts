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

export interface HireExpertChildItem {
  documentId?: string;
  internalName?: string;
  roleTitle?: string | null;
  experienceLevel?: string | null;
  pageHeading?: PageHeadingStructure | null;
}

export interface HireExpertParentChain {
  internalName?: string;
  roleTitle?: string | null;
  pageHeading?: PageHeadingStructure | null;
  parent?: HireExpertParentChain | null;
}

export interface HireExpertItemData extends StandardPageData {
  documentId?: string;
  internalName?: string;
  roleTitle?: string | null;
  experienceLevel?: string | null;
  pageType?: "Standard" | "Dark" | "Light" | "LegalPolicy" | "FullWidth" | string;
  variant?: "default" | "dark" | "light" | "legal_policy" | string;
  pageHeading?: PageHeadingStructure | null;
  parent?: HireExpertParentChain | null;
  children?: HireExpertChildItem[] | null;
  sections?: any[];
}

export interface GetHireExpertsResponse {
  hireExperts: HireExpertItemData[];
}

export const GET_HIRE_EXPERT_BY_SLUG = gql`
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
  query GetHireExpertBySlug($slug: String, $slugWithSlash: String) {
    hireExperts(
      filters: {
        or: [
          { pageHeading: { PageHeading: { slug: { eq: $slug } } } }
          { pageHeading: { PageHeading: { slug: { eq: $slugWithSlash } } } }
        ]
      }
    ) {
      documentId
      internalName
      roleTitle
      experienceLevel
      pageType
      variant
      pageHeading {
        ...PageHeadingFields
      }
      parent {
        internalName
        roleTitle
        pageHeading {
          ...PageHeadingFields
        }
        parent {
          internalName
          roleTitle
          pageHeading {
            ...PageHeadingFields
          }
          parent {
            internalName
            roleTitle
            pageHeading {
              ...PageHeadingFields
            }
            parent {
              internalName
              roleTitle
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
        roleTitle
        experienceLevel
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
 * Fetch a multi-layer hire expert role by slug with recursive parent and child hierarchies
 */
export const getHireExpertBySlug = cache(async (slug: string): Promise<HireExpertItemData | null> => {
  const cleanSlug = slug.replace(/^\/+/, "");
  const slugWithSlash = `/${cleanSlug}`;

  try {
    const data = await fetchStrapi<GetHireExpertsResponse>(
      GET_HIRE_EXPERT_BY_SLUG,
      { slug: cleanSlug, slugWithSlash },
      {
        queryName: "GetHireExpertBySlug",
        tags: ["hire-experts", `hire-expert:${cleanSlug}`],
        revalidate: 60,
      }
    );

    return data?.hireExperts?.[0] || null;
  } catch (error) {
    console.error(`[getHireExpertBySlug] Error fetching hire expert for slug "${slug}":`, error);
    return null;
  }
});

export default getHireExpertBySlug;
