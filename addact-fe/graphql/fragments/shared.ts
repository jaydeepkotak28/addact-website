import { gql } from "graphql-request";
import { MEDIA_FIELDS } from "./media";

export { MEDIA_FIELDS };

/**
 * String fragment definition for 'shared.link'
 * Reusable across all queries: Header, Footer, Banner, CTA, Capabilities, Video, etc.
 */
export const LINK_FIELDS = `
  fragment LinkFields on ComponentSharedLink {
    id
    href
    label
    target
    isExternal
    subDisc
    icon {
      ...MediaFields
    }
  }
`;

/**
 * String fragment definition for 'shared.title'
 */
export const TITLE_FIELDS = `
  fragment TitleFields on ComponentSharedTitle {
    title
    tag
  }
`;

/**
 * String fragment definition for 'shared.card'
 */
export const CARD_FIELDS = `
  fragment CardFields on ComponentSharedCard {
    title
    description
    image {
      ...MediaFields
    }
    link {
      ...LinkFields
    }
  }
`;

/**
 * String fragment definition for 'shared.office-address'
 */
export const OFFICE_ADDRESS_FIELDS = `
  fragment OfficeAddressFields on ComponentSharedOfficeAddress {
    officeName
    urlKeyword
    description
    region
    address
    phone
    email
    mapLink
    icon {
      ...MediaFields
    }
  }
`;

/**
 * String fragment definition for 'shared.footer-column'
 */
export const FOOTER_COLUMN_FIELDS = `
  fragment FooterColumnFields on ComponentSharedFooterColumn {
    title
    links(pagination: { limit: -1 }) {
      ...LinkFields
    }
  }
`;

/**
 * Bundled core fragments for easy one-line interpolation without duplicates
 */
export const SHARED_CORE_FRAGMENTS = `
  ${MEDIA_FIELDS}
  ${LINK_FIELDS}
  ${TITLE_FIELDS}
  ${CARD_FIELDS}
`;

export const LINK_FRAGMENT = gql`
  ${LINK_FIELDS}
`;

export const TITLE_FRAGMENT = gql`
  ${TITLE_FIELDS}
`;

export const CARD_FRAGMENT = gql`
  ${CARD_FIELDS}
`;

export const OFFICE_ADDRESS_FRAGMENT = gql`
  ${OFFICE_ADDRESS_FIELDS}
`;

export const FOOTER_COLUMN_FRAGMENT = gql`
  ${FOOTER_COLUMN_FIELDS}
`;
