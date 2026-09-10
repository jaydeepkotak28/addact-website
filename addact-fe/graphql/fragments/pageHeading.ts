import { gql } from "graphql-request";

/**
 * Reusable GraphQL Fragment for Strapi 'page-structure.page'
 * Uses ...MediaFields for ogImage
 */
export const PAGE_HEADING_FRAGMENT = gql`
  fragment PageHeadingFields on ComponentPageStructurePage {
    PageHeading {
      pageTitle
      slug
    }
    seo {
      metaTitle
      metaDescription
      ogTitle
      ogDescription
      metaRobots
      twitterCardTitle
      canonicalURL
      structuredData
      languageTag
      ogImage {
        ...MediaFields
      }
    }
  }
`;
