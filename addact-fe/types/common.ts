/**
 * Shared Common Types & Interfaces across the application
 */

export interface ImageType {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  name?: string | null;
}

export type StrapiImageType = ImageType;
export type StrapiMedia = ImageType;

/**
 * Reusable Base Link Component Interface ('shared.link')
 * Contains: id, href, label, target, isExternal, subDisc, and icon
 */
export interface BaseLink {
  id?: string | number | null;
  href?: string | null;
  label?: string | null;
  target?: string | null;
  isExternal?: boolean | null;
  subDisc?: string | null;
  SubDisc?: string | null;
  icon?: ImageType | null;
  Icon?: ImageType | null;
}

export type SharedLink = BaseLink;

/**
 * Reusable Base Title Component Interface ('shared.title')
 */
export interface BaseTitle {
  title?: string | null;
  tag?: "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | null;
}

export type SharedTitle = BaseTitle;

/**
 * Reusable Base Card Component Interface ('shared.card')
 */
export interface BaseCard {
  title?: string | null;
  description?: string | null;
  image?: ImageType | null;
  Image?: ImageType | null;
  link?: BaseLink | null;
  Link?: BaseLink | null;
}

export type SharedCard = BaseCard;

/**
 * ─── Generic Utility Types ─────────────────────────────────────────────────────
 */

export type Nullable<T> = T | null | undefined;
export type Maybe<T> = T | null | undefined;

export type WithId<T = {}> = T & {
  id?: string | number | null;
  documentId?: string | null;
};

export type WithLink<T = {}> = T & {
  link?: BaseLink | null;
};

export type WithImage<T = {}> = T & {
  image?: ImageType | null;
};

export type WithClass<T = {}> = T & {
  className?: string;
};

export type GenericBlockProps<T = {}> = WithClass<T & { id?: string | number }>;

export interface GenericListProps<T> {
  items?: T[] | null;
  className?: string;
  itemClassName?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyFallback?: React.ReactNode;
}

export type { StrapiCollectionResponse, StrapiSingleResponse } from "./api";
