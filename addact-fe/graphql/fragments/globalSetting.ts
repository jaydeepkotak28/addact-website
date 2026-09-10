import { gql } from "graphql-request";

export const GLOBAL_SETTING_FRAGMENT = gql`
  fragment GlobalSettingFields on GlobalSetting {
    documentId
    themeColors {
      brandBlue
      darkBackground
      lightBackground
      cardBackground
      textPrimary
      textMuted
    }
    typographyLayout {
      headingFont
      bodyFont
      defaultBorderRadius
      containerMaxWidth
    }
    brandAssets {
      headerLogo {
        url
        alternativeText
        width
        height
      }
      footerLogo {
        url
        alternativeText
        width
        height
      }
      favicon {
        url
      }
    }
    siteInfo {
      copyrightText
      supportEmail
      socialLinks {
        platform
        url
      }
    }
  }
`;
