import type { ImageType, BaseLink, BaseCard } from "./common";

export type HeaderImage = ImageType;
export type HeaderLink = BaseLink;
export type HeaderCard = BaseCard;

export interface HeaderSubLayer2 {
  id?: string;
  label?: string;
  link?: HeaderLink | null;
  card?: HeaderCard | null;
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface HeaderSubLayer {
  id?: string;
  label?: string;
  link?: HeaderLink | null;
  card?: HeaderCard | null;
  subLayers?: HeaderSubLayer2[];
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface HeaderMenuItem {
  id?: string;
  label?: string;
  link?: HeaderLink | null;
  card?: HeaderCard | null;
  subLayers?: HeaderSubLayer[];
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface AddactHeaderData {
  documentId?: string;
  internalName?: string;
  region?: string;
  logo?: HeaderImage | null;
  contactButton?: HeaderCard | null;
  menu?: HeaderMenuItem[];
  additionalText?: string;
  contactDetails?: HeaderLink[];
}

export interface HeadersQueryResponse {
  headers: AddactHeaderData[];
}

export interface HeaderProps {
  headerData?: AddactHeaderData | null;
  transparentHeader?: boolean;
}
