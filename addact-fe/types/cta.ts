import type { StrapiMedia, SharedLink, SharedTitle } from "@/lib/schemas/dynamicZoneSchema";

export type CTAImageType = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type CTALinkType = {
  label: string;
  href: string;
  target?: string | null;
  isExternal?: boolean;
};

export type CtaTitle =
  | SharedTitle
  | { h1?: string }
  | { h2?: string }
  | { h3?: string }
  | { h4?: string }
  | { h5?: string }
  | { h6?: string }
  | string;

export interface CTAProps {
  title?: CtaTitle | CtaTitle[] | null;
  description?:
    | string
    | {
        type?: string;
        children?: { text: string }[];
      }[]
    | null;
  image?: CTAImageType | StrapiMedia | null;
  link?: CTALinkType | SharedLink | null;
  className?: string;
}
