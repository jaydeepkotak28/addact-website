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
 * Composite Dynamic Zone Section Query Part
 * Compose your page's Dynamic Zone fragments here.
 */
export const DYNAMIC_ZONE_SECTION_FRAGMENT = gql`
  ${CONTENT_RELATION_FRAGMENT}
  fragment DynamicZoneSectionFields on ComponentContentRelationContentRelation {
    ...ContentRelationFields
  }
`;
