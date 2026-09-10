import { gql } from "graphql-request";

/**
 * Reusable Media Fragment for Strapi UploadFile
 */
export const MEDIA_FRAGMENT = gql`
  fragment MediaFields on UploadFile {
    url
    alternativeText
    width
    height
  }
`;
