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
} from "../fragments/dynamicZone";
import type {
  PageHeadingStructure,
  StandardPageData,
  StrapiMedia,
} from "@/lib/schemas/dynamicZoneSchema";

export interface ServiceChildItem {
  documentId?: string;
  internalName?: string;
  pageHeading?: PageHeadingStructure | null;
}

export interface ServiceParentChain {
  internalName?: string;
  pageHeading?: PageHeadingStructure | null;
  parent?: ServiceParentChain | null;
}

export interface ServiceItemData extends StandardPageData {
  documentId?: string;
  internalName?: string;
  pageType?: "Standard" | "Dark" | "Light" | "LegalPolicy" | "FullWidth" | string;
  variant?: "default" | "dark" | "light" | "legal_policy" | string;
  pageHeading?: PageHeadingStructure | null;
  parent?: ServiceParentChain | null;
  children?: ServiceChildItem[] | null;
  sections?: any[];
}

export interface GetServicesResponse {
  services: ServiceItemData[];
}

export const GET_SERVICE_BY_SLUG = gql`
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
  query GetServiceBySlug($slug: String, $slugWithSlash: String) {
    services(
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
      parent {
        internalName
        pageHeading {
          ...PageHeadingFields
        }
        parent {
          internalName
          pageHeading {
            ...PageHeadingFields
          }
          parent {
            internalName
            pageHeading {
              ...PageHeadingFields
            }
            parent {
              internalName
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
      }
    }
  }
`;

/**
 * Fetch a multi-layer service by slug with recursive parent and child hierarchies
 */
export const getServiceBySlug = cache(async (slug: string): Promise<ServiceItemData | null> => {
  const cleanSlug = slug.replace(/^\/+/, "");
  const slugWithSlash = `/${cleanSlug}`;

  try {
    const data = await fetchStrapi<GetServicesResponse>(
      GET_SERVICE_BY_SLUG,
      { slug: cleanSlug, slugWithSlash },
      {
        queryName: "GetServiceBySlug",
        tags: ["services", `service:${cleanSlug}`],
        revalidate: 60,
      }
    );

    return data?.services?.[0] || null;
  } catch (error) {
    console.error(`[getServiceBySlug] Error fetching service for slug "${slug}":`, error);
    return null;
  }
});
