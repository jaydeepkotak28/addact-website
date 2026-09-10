import { gql } from "graphql-request";
import { MEDIA_FRAGMENT } from "./media";
import { LINK_FRAGMENT, TITLE_FRAGMENT } from "./shared";

/**
 * Reusable Core CTA Entity Fragment ('api::cta.cta')
 * Uses ...MediaFields, ...LinkFields, and ...TitleFields
 */
export const CTA_FIELDS_FRAGMENT = gql`
  fragment CtaFields on Cta {
    documentId
    internalName
    title {
      ...TitleFields
    }
    description
    image {
      ...MediaFields
    }
    link {
      ...LinkFields
    }
  }
`;
