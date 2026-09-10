import { gql } from "graphql-request";

/**
 * Reusable GraphQL Fragment for 'content-relation.content-relation'
 */
export const CONTENT_RELATION_FRAGMENT = gql`
  fragment ContentRelationFields on ComponentContentRelationContentRelation {
    content {
      internalName
      Body {
        title
        description
      }
    }
  }
`;

/**
 * Reusable GraphQL Fragment for 'feature.promo'
 */
export const PROMO_FRAGMENT = gql`
  fragment PromoFields on ComponentFeaturePromo {
    variant
    anchorId
    title
    subTitle
    description
    image {
      ...MediaFields
    }
  }
`;

/**
 * Reusable GraphQL Fragment for 'content-relation.promo-relation'
 */
export const PROMO_RELATION_FRAGMENT = gql`
  fragment PromoRelationFields on ComponentContentRelationPromoRelation {
    promos {
      internalName
      promo {
        variant
        anchorId
        title
        subTitle
        description
        image {
          ...MediaFields
        }
      }
    }
  }
`;

/**
 * Reusable GraphQL Fragment for 'feature.content'
 */
export const FEATURE_CONTENT_FRAGMENT = gql`
  fragment FeatureContentFields on ComponentFeatureContent {
    body
  }
`;

/**
 * Reusable GraphQL Fragment for 'content-relation.banner-relation'
 */
export const BANNER_RELATION_FRAGMENT = gql`
  fragment BannerRelationFields on ComponentContentRelationBannerRelation {
    banner {
      ...BannerFields
    }
  }
`;
