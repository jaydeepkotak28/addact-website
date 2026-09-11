import React from "react";
import AnimationBanner from "@/components/organisms/AnimationBanner";
import type { AnimationBannerBlockData } from "@/lib/schemas/dynamicZoneSchema";
import {
  normalizeMedia,
  normalizeLink,
  normalizeTitle,
  normalizeCollection,
} from "@/lib/normalizers";

export interface AnimationBannerBlockProps extends AnimationBannerBlockData {
  className?: string;
  id?: string;
}

export const AnimationBannerBlock: React.FC<AnimationBannerBlockProps> = (props) => {
  const normalizedBannerImage = normalizeMedia(props.bannerImage);
  const normalizedFirstAnimationImage = normalizeMedia(props.firstAnimationImage);
  const normalizedSecondAnimationImage = normalizeMedia(props.secondAnimationImage);
  const normalizedBannerLink = normalizeLink(props.bannerLink);
  const normalizedSubTitles = normalizeCollection(props.bannerSubTitle, normalizeTitle);

  const bannerData = {
    ...props,
    animationTitle: props.animationTitle,
    bannerImage: normalizedBannerImage ? { url: normalizedBannerImage.url } : undefined,
    firstAnimationImage: normalizedFirstAnimationImage ? { url: normalizedFirstAnimationImage.url } : undefined,
    secondAnimationImage: normalizedSecondAnimationImage ? { url: normalizedSecondAnimationImage.url } : undefined,
    bannerLink: normalizedBannerLink
      ? {
          label: normalizedBannerLink.label,
          href: normalizedBannerLink.href,
          isExternal: Boolean(normalizedBannerLink.isExternal),
          target: normalizedBannerLink.target,
        }
      : undefined,
    bannerSubTitle: normalizedSubTitles.map((item) => ({ Title: item.title, title: item.title })),
  };

  return <AnimationBanner data={bannerData} />;
};

export default AnimationBannerBlock;
