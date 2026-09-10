import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import { PROMO_RELATION_FRAGMENT } from "../fragments/dynamicZone";
import type { StandardPageData } from "@/lib/schemas/dynamicZoneSchema";

export interface AboutUsData {
  aboutUs: StandardPageData | null;
}

export const GET_ABOUT_US = gql`
  ${PAGE_HEADING_FRAGMENT}
  ${PROMO_RELATION_FRAGMENT}
  query GetAboutUs {
    aboutUs {
      pageHeading {
        ...PageHeadingFields
      }
      section {
        __typename
        ... on ComponentContentRelationPromoRelation {
          ...PromoRelationFields
        }
      }
    }
  }
`;

/**
 * Query function for About Us page
 */
export async function getAboutUs(): Promise<AboutUsData | null> {
  return fetchStrapi<AboutUsData>(
    GET_ABOUT_US,
    undefined,
    "GetAboutUs"
  );
}
