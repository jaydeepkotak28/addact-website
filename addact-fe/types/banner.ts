import type { SharedTitle, SharedLink } from "@/lib/schemas/dynamicZoneSchema";

/**
 * Reusable CTA Button for Banners
 */
export interface HeroBannerButton {
  label: string;
  url: string;
  isExternal?: boolean;
}

/**
 * Global Hero Banner Props Interface
 * Reusable across HeroBanner organism, Dynamic Zone blocks, and all page banners.
 */
export interface HeroBannerProps {
  title?: string;
  description?: string;
  backgroundImageUrl?: string;
  isVideo?: boolean;
  videoUrl?: string;
  button?: HeroBannerButton;
  showSearchbox?: boolean;
  showAnchorLinks?: boolean;
  isTextAlignCenter?: boolean;
  chipsText?: SharedTitle[] | null;
  anchorLinks?: SharedLink[] | null;
  logoUrl?: string | null;
  className?: string;
}
