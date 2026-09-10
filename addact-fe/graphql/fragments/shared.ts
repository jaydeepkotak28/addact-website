import { gql } from "graphql-request";

/**
 * Reusable Fragment for 'shared.link' component
 */
export const LINK_FRAGMENT = gql`
  fragment LinkFields on ComponentSharedLink {
    href
    label
    target
    isExternal
  }
`;

/**
 * Reusable Fragment for 'shared.title' component
 */
export const TITLE_FRAGMENT = gql`
  fragment TitleFields on ComponentSharedTitle {
    title
  }
`;
