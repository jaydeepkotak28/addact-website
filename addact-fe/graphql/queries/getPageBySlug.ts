import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { MEDIA_FRAGMENT } from "../fragments/media";
import { LINK_FRAGMENT, TITLE_FRAGMENT } from "../fragments/shared";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import { BANNER_FIELDS_FRAGMENT } from "../fragments/banner";
import {
  PROMO_RELATION_FRAGMENT,
  CONTENT_RELATION_FRAGMENT,
  BANNER_RELATION_FRAGMENT,
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
  ${MEDIA_FRAGMENT}
  ${LINK_FRAGMENT}
  ${TITLE_FRAGMENT}
  ${PAGE_HEADING_FRAGMENT}
  ${BANNER_FIELDS_FRAGMENT}
  ${PROMO_RELATION_FRAGMENT}
  ${CONTENT_RELATION_FRAGMENT}
  ${BANNER_RELATION_FRAGMENT}
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
        ... on ComponentContentRelationBannerRelation {
          ...BannerRelationFields
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
