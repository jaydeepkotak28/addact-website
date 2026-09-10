import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import {
  PROMO_RELATION_FRAGMENT,
  CONTENT_RELATION_FRAGMENT,
  PROMO_FRAGMENT,
  FEATURE_CONTENT_FRAGMENT,
} from "../fragments/dynamicZone";
import type { StandardPageData } from "@/lib/schemas/dynamicZoneSchema";

export interface PageItemData extends StandardPageData {
  documentId?: string;
  internalName?: string;
  pageType?: "Standard" | "LegalPolicy" | "FullWidth" | string;
  sections?: any[];
}

export interface GetPageBySlugResponse {
  pages: PageItemData[];
}

export const GET_PAGE_BY_SLUG = gql`
  ${PAGE_HEADING_FRAGMENT}
  ${PROMO_RELATION_FRAGMENT}
  ${CONTENT_RELATION_FRAGMENT}
  ${PROMO_FRAGMENT}
  ${FEATURE_CONTENT_FRAGMENT}
  query GetPageBySlug($slug: String!, $slugWithSlash: String!) {
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
        ... on ComponentFeaturePromo {
          ...PromoFields
        }
        ... on ComponentFeatureContent {
          ...FeatureContentFields
        }
      }
    }
  }
`;

/**
 * Universal Query function to fetch any Dynamic Page by its slug
 */
export async function getPageBySlug(slug: string): Promise<PageItemData | null> {
  const cleanSlug = slug.replace(/^\/+/, "");
  const slugWithSlash = `/${cleanSlug}`;

  const data = await fetchStrapi<GetPageBySlugResponse>(
    GET_PAGE_BY_SLUG,
    { slug: cleanSlug, slugWithSlash },
    "GetPageBySlug"
  );

  return data?.pages?.[0] || null;
}
