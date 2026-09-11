import type { ImageType, BaseLink } from "./common";

export type { ImageType };
export type FooterImage = ImageType;
export type FooterLink = BaseLink;
export type IconLink = BaseLink;
export type SocialLink = BaseLink;

export interface FooterColumnItem extends BaseLink {
  Title?: string;
}

export interface FooterColumn {
  title?: string;
  links?: FooterLink[];
  NavLink?: (FooterColumnItem | FooterLink)[];
}

export interface AddressInformationItem {
  __typename?: string;
  officeName?: string;
  Title?: string;
  description?: string;
  Description?: string;
  urlKeyword?: string;
  region?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapLink?: string;
  icon?: ImageType | null;
  Icon?: ImageType | null;
  Link?: BaseLink | null;
}

export type OfficeAddress = AddressInformationItem;

export interface FooterMilestoneTitle {
  CommonTitle?: Array<{
    Title?: string;
    Description?: string;
  }>;
}

export interface FooterMilestoneImage {
  Image?: ImageType | null;
}

export interface FooterViewModel {
  documentId?: string;
  internalName?: string;
  region?: string;
  Logo?: { Image?: ImageType | null } | null;
  logo?: ImageType | null;
  AddressInformation?: AddressInformationItem[];
  addressInformation?: AddressInformationItem[];
  footerlinks?: FooterColumn[];
  footerColumns?: FooterColumn[];
  milestonestitle?: FooterMilestoneTitle | null;
  milestonesTitle?: string;
  milestonesimage?: FooterMilestoneImage[];
  milestonesImages?: ImageType[];
  socialMedia?: IconLink[];
  CopyrightText?: string;
  copyrightText?: string;
  SiteSlog?: string;
  siteSlogan?: string;
  backgroundImage?: ImageType | null;
  BackGroundImage?: { Image?: ImageType | null } | null;
  backgroundImageMobile?: ImageType | null;
  BackGroundImageMobile?: { Image?: ImageType | null } | null;
}

export type FooterData = FooterViewModel;

export interface FootersQueryResponse {
  footers: FooterData[];
}

export interface FooterProps {
  data?:
    | (FooterData & {
        contacticons?: {
          Icon?: ImageType;
        }[];
      })
    | null;
}
