import { gql } from "graphql-request";

/**
 * Reusable Core Banner Entity Fragment
 * Uses ...MediaFields, ...LinkFields, and ...TitleFields
 */
export const BANNER_FIELDS_FRAGMENT = gql`
  fragment BannerFields on Banner {
    documentId
    internalName
    bannerTitle
    bannerDescription
    bannerImage {
      ...MediaFields
    }
    bannerLink {
      ...LinkFields
    }
    showSearchbox
    bannerLogo {
      ...MediaFields
    }
    videoLink
    isVideo
    isTextAlignCenter
    chipsText {
      ...TitleFields
    }
    anchorLinks {
      ...LinkFields
    }
  }
`;
