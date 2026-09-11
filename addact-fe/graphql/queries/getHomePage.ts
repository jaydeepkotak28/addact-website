export interface Image {
  alternativeText?: string | null;
  height?: number | null;
  name?: string | null;
  url: string;
  width?: number | null;
}

export interface Link {
  id?: string;
  href: string;
  label?: string | null;
  target?: string | null;
  isExternal?: boolean | null;
  SubDisc?: string | null;
  Icon?: Image | null;
}

export interface TitleItem {
  Title?: string | null;
  title?: string | null;
}

export interface AnimationBanner {
  animationTitle?: string | null;
  firstAnimationImage?: Image | null;
  secondAnimationImage?: Image | null;
  bannerTitle?: string | null;
  bannerDescription?: string | null;
  bannerSubTitle?: TitleItem[] | null;
  bannerImage?: Image | null;
  bannerLink?: Link | null;
}

export interface HomeItems {
  documentId?: string;
  animationBanner?: AnimationBanner;
  whoarewe?: unknown;
  ourCapabilitiy?: unknown;
  aiEcoSystem?: unknown;
  industry?: unknown;
  whyaddact?: unknown;
  ourprocess?: unknown;
  cta?: unknown;
}
