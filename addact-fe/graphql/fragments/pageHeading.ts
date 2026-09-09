import { gql } from "graphql-request";

/**
 * Reusable GraphQL Fragment for Strapi 'page-structure.page'
 * Used across all single and collection type pages that have pageHeading & SEO.
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
        url
        alternativeText
        width
        height
      }
    }
  }
`;
