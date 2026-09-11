import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { GLOBAL_SETTING_FRAGMENT } from "../fragments/globalSetting";
import type { StrapiMedia } from "@/lib/schemas/dynamicZoneSchema";

export interface GlobalSettingData {
  globalSetting: {
    documentId?: string;
    themeColors?: {
      brandBlue?: string;
      darkBackground?: string;
      lightBackground?: string;
      cardBackground?: string;
      textPrimary?: string;
      textMuted?: string;
    } | null;
    typographyLayout?: {
      headingFont?: string;
      bodyFont?: string;
      defaultBorderRadius?: string;
      containerMaxWidth?: string;
    } | null;
    brandAssets?: {
      headerLogo?: StrapiMedia | null;
      footerLogo?: StrapiMedia | null;
      favicon?: { url?: string } | null;
    } | null;
    siteInfo?: {
      copyrightText?: string;
      supportEmail?: string;
      socialLinks?: Array<{
        platform?: string;
        url?: string;
      }>;
    } | null;
  } | null;
}

export const GET_GLOBAL_SETTING = gql`
  ${GLOBAL_SETTING_FRAGMENT}
  query GetGlobalSetting {
    globalSetting {
      ...GlobalSettingFields
    }
  }
`;

export async function getGlobalSetting(): Promise<GlobalSettingData | null> {
  return fetchStrapi<GlobalSettingData>(
    GET_GLOBAL_SETTING,
    undefined,
    {
      queryName: "GetGlobalSetting",
      tags: ["globalSetting", "global"],
      revalidate: 60,
    }
  );
}
