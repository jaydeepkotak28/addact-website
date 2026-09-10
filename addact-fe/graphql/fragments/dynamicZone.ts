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
      url
      alternativeText
      width
      height
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
          url
          alternativeText
          width
          height
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
 * Composite Dynamic Zone Section Query Part
 * Compose your page's Dynamic Zone fragments here.
 */
export const DYNAMIC_ZONE_SECTION_FRAGMENT = gql`
  ${CONTENT_RELATION_FRAGMENT}
  ${PROMO_RELATION_FRAGMENT}
  ${PROMO_FRAGMENT}
  ${FEATURE_CONTENT_FRAGMENT}
  fragment DynamicZoneSectionFields on ComponentContentRelationContentRelation {
    ...ContentRelationFields
  }
`;

