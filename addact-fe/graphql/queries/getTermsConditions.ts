import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import { CONTENT_RELATION_FRAGMENT } from "../fragments/dynamicZone";
import type { StandardPageData } from "@/lib/schemas/dynamicZoneSchema";
 
export interface TermsConditionsData {
  termsAndCondition: StandardPageData | null;
}

export const GET_TERMS_CONDITIONS = gql`
  ${PAGE_HEADING_FRAGMENT}
  ${CONTENT_RELATION_FRAGMENT}
  query GetTermsConditions {
    termsAndCondition {
      pageHeading {
        ...PageHeadingFields
      }
      Section {
        __typename
        ... on ComponentContentRelationContentRelation {
          ...ContentRelationFields
        }
      }
    }
  }
`;

/**
 * Reusable Query Function for Terms and Conditions
 */
export async function getTermsConditions(): Promise<TermsConditionsData | null> {
  return fetchStrapi<TermsConditionsData>(
    GET_TERMS_CONDITIONS,
    undefined,
    "GetTermsConditions"
  );
}
