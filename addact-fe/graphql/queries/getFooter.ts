import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";

export interface FooterImage {
  url?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  name?: string;
}

export interface FooterLink {
  id?: string;
  href?: string;
  label?: string;
  target?: string;
  isExternal?: boolean;
}

export interface FooterColumn {
  title?: string;
  links?: FooterLink[];
  NavLink?: Array<{ Title?: string } | FooterLink>;
}

export interface OfficeAddress {
  officeName?: string;
  Title?: string;
  urlKeyword?: string;
  description?: string;
  Description?: string;
  region?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapLink?: string;
  icon?: FooterImage;
  Icon?: FooterImage;
  Link?: {
    href?: string;
    isExternal?: boolean;
    label?: string;
    SubDisc?: string;
    target?: string;
    Icon?: FooterImage;
  };
}

export interface SocialLink {
  id?: string;
  href?: string;
  label?: string;
  target?: string;
  isExternal?: boolean;
  icon?: FooterImage;
  Icon?: FooterImage;
}

export interface FooterData {
  documentId?: string;
  internalName?: string;
  region?: string;
  milestonesTitle?: string;
  milestonestitle?: {
    CommonTitle?: Array<{ Title?: string; Description?: string }>;
  };
  copyrightText?: string;
  CopyrightText?: string;
  siteSlogan?: string;
  SiteSlog?: string;
  logo?: FooterImage;
  Logo?: { Image?: FooterImage };
  backgroundImage?: FooterImage;
  BackGroundImage?: { Image?: FooterImage };
  backgroundImageMobile?: FooterImage;
  BackGroundImageMobile?: { Image?: FooterImage };
  milestonesImages?: FooterImage[];
  milestonesimage?: Array<{ Image?: FooterImage }>;
  addressInformation?: OfficeAddress[];
  AddressInformation?: OfficeAddress[];
  footerColumns?: FooterColumn[];
  footerlinks?: FooterColumn[];
  socialMedia?: SocialLink[];
}

export interface FootersQueryResponse {
  footers: FooterData[];
}

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
        url
        alternativeText
        width
        height
        name
      }
      backgroundImage {
        url
        alternativeText
        width
        height
        name
      }
      backgroundImageMobile {
        url
        alternativeText
        width
        height
        name
      }
      milestonesImages(pagination: { limit: -1 }) {
        url
        alternativeText
        width
        height
        name
      }
      addressInformation(pagination: { limit: -1 }) {
        officeName
        urlKeyword
        description
        region
        address
        phone
        email
        mapLink
        icon {
          url
          alternativeText
          width
          height
          name
        }
      }
      footerColumns(pagination: { limit: -1 }) {
        title
        links(pagination: { limit: -1 }) {
          id
          href
          label
          target
          isExternal
        }
      }
      socialMedia(pagination: { limit: -1 }) {
        id
        href
        label
        target
        isExternal
        icon {
          url
          alternativeText
          width
          height
          name
        }
      }
    }
  }
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
    "GetFooters"
  );
  if (data?.footers && data.footers.length > 0) {
    return normalizeFooter(data.footers[0]);
  }
  // Fallback to global if specific region not found
  if (region !== "global") {
    const fallback = await fetchStrapi<FootersQueryResponse>(
      GET_FOOTER,
      { region: "global" },
      "GetFootersFallback"
    );
    return fallback?.footers?.[0] ? normalizeFooter(fallback.footers[0]) : null;
  }
  return null;
}

export default getFooterData;
