export interface Image {
  alternativeText?: string | null;
  height?: number | null;
  name?: string | null;
  url?: string | null;
  width?: number | null;
}

export interface Link {
  id?: string | number;
  href?: string | null;
  label?: string | null;
  target?: string | null;
  isExternal?: boolean | null;
  SubDisc?: string | null;
  subDisc?: string | null;
  Icon?: Image | null;
  icon?: any;
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

export interface AiLogoItem {
  tooltip?: string | null;
  toolTip?: string | null;
  Image?: Image | null;
  image?: {
    url?: string | null;
    alternativeText?: string | null;
  } | null;
}

export interface AIEcoSystemData {
  documentId?: string;
  internalName?: string | null;
  title?: string | null;
  description?: string | null;
  tagLine?: string | null;
  link?: Link | null;
  firstImage?: Image | null;
  secondImage?: Image | null;
  bgImage?: Image | null;
  image?: Image | null;
  firstLayerlogos?: AiLogoItem[] | null;
  secondLayerlogos?: AiLogoItem[] | null;
  firstLayerLogos?: any[] | null;
  secondLayerLogos?: any[] | null;
}

export interface AIEcoSystem {
  AIEcoSystem?: AIEcoSystemData | null;
  aiEcoSystem?: AIEcoSystemData | null;
}

export interface HomeItems {
  documentId?: string;
  animationBanner?: AnimationBanner;
  whoarewe?: unknown;
  ourCapabilitiy?: unknown;
  aiEcoSystem?: AIEcoSystemData | null;
  industry?: unknown;
  whyaddact?: unknown;
  ourprocess?: unknown;
  cta?: unknown;
}

