import { gql } from "graphql-request";
import { MEDIA_FIELDS } from "./media";

export const GLOBAL_SETTING_FIELDS = `
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
        ...MediaFields
      }
      footerLogo {
        ...MediaFields
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

export const GLOBAL_SETTING_FRAGMENT = gql`
  ${MEDIA_FIELDS}
  ${GLOBAL_SETTING_FIELDS}
`;
