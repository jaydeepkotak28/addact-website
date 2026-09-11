import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";

import type {
  ImageType,
  FooterImage,
  FooterLink,
  FooterColumn,
  OfficeAddress,
  SocialLink,
  AddressInformationItem,
  FooterMilestoneTitle,
  FooterMilestoneImage,
  FooterViewModel,
  FooterData,
  FootersQueryResponse,
  FooterProps,
} from "@/types/footer";

export type {
  ImageType,
  FooterImage,
  FooterLink,
  FooterColumn,
  OfficeAddress,
  SocialLink,
  AddressInformationItem,
  FooterMilestoneTitle,
  FooterMilestoneImage,
  FooterViewModel,
  FooterData,
  FootersQueryResponse,
  FooterProps,
};

import { MEDIA_FIELDS } from "@/graphql/fragments/media";
import {
  LINK_FIELDS,
  OFFICE_ADDRESS_FIELDS,
  FOOTER_COLUMN_FIELDS,
} from "@/graphql/fragments/shared";

export const GET_FOOTER = gql`
  query GetFooters($region: String) {
    footers(filters: { region: { eq: $region } }) {
      documentId
      internalName
      region
      milestonesTitle
      copyrightText
      siteSlogan
      logo {
        ...MediaFields
      }
      backgroundImage {
        ...MediaFields
      }
      backgroundImageMobile {
        ...MediaFields
      }
      milestonesImages(pagination: { limit: -1 }) {
        ...MediaFields
      }
      addressInformation(pagination: { limit: -1 }) {
        ...OfficeAddressFields
      }
      footerColumns(pagination: { limit: -1 }) {
        ...FooterColumnFields
      }
      socialMedia(pagination: { limit: -1 }) {
        ...LinkFields
      }
    }
  }
  ${MEDIA_FIELDS}
  ${LINK_FIELDS}
  ${OFFICE_ADDRESS_FIELDS}
  ${FOOTER_COLUMN_FIELDS}
`;

function normalizeFooter(footer: FooterData): FooterData {
  if (!footer) return footer;

  const addrInfo = (footer.addressInformation || []).map((a: OfficeAddress) => ({
    ...a,
    Title: a.officeName || a.Title,
    Description: a.description || a.Description,
    urlKeyword: a.urlKeyword || 'default',
    Icon: a.icon || a.Icon,
    Link: {
      href: a.email ? `mailto:${a.email}` : a.phone ? `tel:${a.phone.replace(/[^+\d]/g, '')}` : '/',
      isExternal: false,
      label: a.officeName || 'Contact',
      target: '_self',
      Icon: a.icon || a.Icon,
    }
  }));

  const footerLinksGroup = (footer.footerColumns || []).map((col) => ({
    NavLink: [
      { Title: col.title },
      ...(col.links || []).map(l => ({
        id: l.id,
        href: l.href,
        label: l.label,
        target: l.target,
        isExternal: l.isExternal
      }))
    ]
  }));

  return {
    ...footer,
    Logo: { Image: footer.logo },
    BackGroundImage: { Image: footer.backgroundImage },
    BackGroundImageMobile: { Image: footer.backgroundImageMobile },
    CopyrightText: footer.copyrightText,
    SiteSlog: footer.siteSlogan,
    milestonestitle: {
      CommonTitle: [{ Title: footer.milestonesTitle || 'Certified Success & milestones' }]
    },
    milestonesimage: (footer.milestonesImages || []).map(img => ({ Image: img })),
    AddressInformation: addrInfo,
    addressInformation: addrInfo,
    footerlinks: footerLinksGroup,
    footerColumns: footer.footerColumns,
    socialMedia: (footer.socialMedia || []).map(s => ({
      ...s,
      Icon: s.icon || s.Icon
    }))
  };
}

export async function getFooterData(region: string = "global"): Promise<FooterData | null> {
  const data = await fetchStrapi<FootersQueryResponse>(
    GET_FOOTER,
    { region },
    {
      queryName: "GetFooters",
      tags: ["footer", "global", `footer:${region}`],
      revalidate: 60,
    }
  );
  if (data?.footers && data.footers.length > 0) {
    return normalizeFooter(data.footers[0]);
  }
  // Fallback to global if specific region not found
  if (region !== "global") {
    const fallback = await fetchStrapi<FootersQueryResponse>(
      GET_FOOTER,
      { region: "global" },
      {
        queryName: "GetFootersFallback",
        tags: ["footer", "global"],
        revalidate: 60,
      }
    );
    return fallback?.footers?.[0] ? normalizeFooter(fallback.footers[0]) : null;
  }
  return null;
}

export default getFooterData;
