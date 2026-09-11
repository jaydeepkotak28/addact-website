import type { StrapiMedia, SharedLink, SharedTitle } from "@/lib/schemas/dynamicZoneSchema";

export type CTAImageType = StrapiMedia;
export type CTALinkType = SharedLink;

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
  internalName?: string;
  variant?: "home" | "banner1" | "banner2" | "cta2" | "generic" | "default" | string;
  hasIcon?: boolean;
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
