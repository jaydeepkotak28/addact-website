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

  const button = bannerLink?.href
    ? {
        label: bannerLink.label || "Read Now",
        url: bannerLink.href,
        isExternal: bannerLink.target === "_blank" || Boolean(bannerLink.isExternal),
      }
    : undefined;

  return (
    <HeroBanner
      title={bannerTitle || internalName || ""}
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
