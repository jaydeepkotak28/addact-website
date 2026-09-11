import { gql } from "graphql-request";

export const MEDIA_FIELDS = `
  fragment MediaFields on UploadFile {
    url
    alternativeText
    width
    height
    name
  }
`;

/**
 * Reusable Media Fragment for Strapi UploadFile
 */
export const MEDIA_FRAGMENT = gql`
  ${MEDIA_FIELDS}
`;
