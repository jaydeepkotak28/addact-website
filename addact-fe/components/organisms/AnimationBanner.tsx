"use client";

import { useState, useEffect, useCallback } from "react";
import IntroSplash from "./IntroSplash";
import HomeBanner, { type AnimationBanner as AnimationBannerData } from "./HomeBanner";

export interface AnimationBannerProps {
  data?: AnimationBannerData;
}

const AnimationBanner = ({ data }: AnimationBannerProps) => {
  const [isIntroVisible, setIsIntroVisible] = useState(true);

  useEffect(() => {
    // Disable browser scroll restoration so refresh always starts at top.
    if (typeof window !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIsIntroVisible(false);
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {isIntroVisible && (
        <IntroSplash
          onComplete={handleIntroComplete}
          animationTitle={data?.animationTitle ?? undefined}
          firstAnimationImage={data?.firstAnimationImage ?? undefined}
          secondAnimationImage={data?.secondAnimationImage ?? undefined}
        />
      )}

      <HomeBanner data={data} />
    </>
  );
};

export default AnimationBanner;
