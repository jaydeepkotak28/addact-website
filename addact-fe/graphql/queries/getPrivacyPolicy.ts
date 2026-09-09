import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { PAGE_HEADING_FRAGMENT } from "../fragments/pageHeading";
import { CONTENT_RELATION_FRAGMENT } from "../fragments/dynamicZone";
import type { StandardPageData } from "@/lib/schemas/dynamicZoneSchema";
 
export interface PrivacyPolicyData {
  privacyPolicy: StandardPageData | null;
}

export const GET_PRIVACY_POLICY = gql`
  ${PAGE_HEADING_FRAGMENT}
  ${CONTENT_RELATION_FRAGMENT}
  query GetPrivacyPolicy {
    privacyPolicy {
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
 * Reusable Query Function for Privacy Policy
 */
export async function getPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
  return fetchStrapi<PrivacyPolicyData>(
    GET_PRIVACY_POLICY,
    undefined,
    "GetPrivacyPolicy"
  );
}
