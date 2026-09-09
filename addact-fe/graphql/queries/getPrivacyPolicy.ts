import { gql } from "graphql-request";
import strapiClient from "@/lib/strapi";
import type {
  DynamicZoneBlock,
  PageHeadingData,
  SeoData,
} from "@/lib/schemas/dynamicZoneSchema";

export interface PrivacyPolicyData {
  privacyPolicy: {
    pageHeading?: {
      PageHeading?: PageHeadingData;
      seo?: SeoData;
    } | null;
    Section?: DynamicZoneBlock[] | null;
  } | null;
}

export const GET_PRIVACY_POLICY = gql`
  query GetPrivacyPolicy {
    privacyPolicy {
      pageHeading {
        PageHeading {
          pageTitle
          slug
        }
        seo {
          metaTitle
          metaDescription
        }
      }
      Section {
        __typename
        ... on ComponentFeatureContent {
          body
        }
      }
    }
  }
`;

export async function getPrivacyPolicy(): Promise<PrivacyPolicyData | null> {
  try {
    const data = await strapiClient.request<PrivacyPolicyData>(GET_PRIVACY_POLICY);
    return data;
  } catch (error) {
    console.error(
      "⚠️ [Strapi] Failed to fetch Privacy Policy (check permissions or API token):",
      error
    );
    return null;
  }
}
