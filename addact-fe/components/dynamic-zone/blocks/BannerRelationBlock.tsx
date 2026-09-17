import React from "react";
import HeroBanner from "@/components/organisms/HeroBanner";
import type { BannerRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface BannerRelationBlockProps extends BannerRelationBlockData {
  className?: string;
  showAnchorLinks?: boolean;
}

export const BannerRelationBlock: React.FC<BannerRelationBlockProps> = ({
  banner,
  className = "",
  showAnchorLinks = true,
}) => {
  if (!banner) return null;

  const {
    bannerTitle,
    bannerDescription,
    bannerImage,
    bannerLink,
    bannerLogo,
    showSearchbox,
    videoLink,
    isVideo,
    isTextAlignCenter,
    chipsText,
    anchorLinks,
    internalName,
  } = banner;

  const hasTitle = Boolean(bannerTitle?.trim());
  const hasDescription = Boolean(bannerDescription?.trim());
  const hasImage = Boolean(bannerImage?.url);
  const hasVideo = Boolean(videoLink?.trim());
  const hasLink = Boolean(bannerLink?.href?.trim());
  const hasChips = Boolean(chipsText && chipsText.length > 0);
  const hasAnchorLinks = Boolean(anchorLinks && anchorLinks.length > 0);

  // Strict null guard: If no content from BE, render nothing
  if (
    !hasTitle &&
    !hasDescription &&
    !hasImage &&
    !hasVideo &&
    !hasLink &&
    !hasChips &&
    !hasAnchorLinks
  ) {
    return null;
  }

  const button = bannerLink?.href?.trim()
    ? {
        label: bannerLink.label || "Read Now",
        url: bannerLink.href,
        isExternal: bannerLink.target === "_blank" || Boolean(bannerLink.isExternal),
      }
    : undefined;

  return (
    <HeroBanner
      title={bannerTitle || ""}
      description={bannerDescription || ""}
      backgroundImageUrl={bannerImage?.url || ""}
      isVideo={Boolean(isVideo)}
      videoUrl={videoLink || ""}
      button={button}
      showSearchbox={Boolean(showSearchbox)}
      showAnchorLinks={showAnchorLinks}
      isTextAlignCenter={Boolean(isTextAlignCenter)}
      chipsText={chipsText}
      anchorLinks={anchorLinks}
      logoUrl={bannerLogo?.url}
      className={className}
    />
  );
};

export default BannerRelationBlock;
