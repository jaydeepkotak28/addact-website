"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { openContactDrawer, shouldOpenContactDrawer } from "@/lib/contactDrawer";

export interface AnimationBanner {
  bannerTitle?: string | null;
  bannerSubTitle?: Array<{ Title?: string | null; title?: string | null }> | null;
  bannerDescription?: string | null;
  bannerLink?: {
    label?: string | null;
    href?: string | null;
    isExternal?: boolean | null;
    target?: string | null;
  } | null;
  bannerImage?: {
    url?: string | null;
  } | null;
  animationTitle?: string | null;
  firstAnimationImage?: { url?: string | null } | null;
  secondAnimationImage?: { url?: string | null } | null;
}

export interface HomeBannerProps {
  data?: AnimationBanner;
}

const HomeBanner = ({ data }: HomeBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animState, setAnimState] = useState<"visible" | "exit" | "enter">("visible");

  // Use data from props
  const staticTitle = data?.bannerTitle || "";
  const rotatingTexts =
    data?.bannerSubTitle?.map((item) => item?.Title || item?.title || "") || [];
  const description = data?.bannerDescription || "";
  const buttonLabel = data?.bannerLink?.label || "";
  const buttonLink = data?.bannerLink?.href || "/";
  const buttonTarget = data?.bannerLink?.isExternal ? "_blank" : "_self";
  const useContactDrawer = !data?.bannerLink?.isExternal && shouldOpenContactDrawer(buttonLink);
  const backgroundImage = data?.bannerImage?.url || "";

  const handleBannerCtaClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!useContactDrawer) {
      return;
    }

    event.preventDefault();
    openContactDrawer();
  };

  const rotateText = useCallback(() => {
    if (rotatingTexts.length === 0) return;
    setAnimState("exit");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
      setAnimState("enter");
      setTimeout(() => {
        setAnimState("visible");
      }, 50);
    }, 400);
  }, [rotatingTexts.length]);

  useEffect(() => {
    if (rotatingTexts.length <= 1) return;
    const interval = setInterval(rotateText, 2000);
    return () => clearInterval(interval);
  }, [rotateText, rotatingTexts.length]);

  return (
    <section className="relative mt-[60px] flex w-full min-h-[780px] items-start overflow-hidden md:min-h-[600px] md:items-center lg:h-screen lg:mt-[100px]">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-x-0 bottom-0 top-[43%] z-0 md:inset-0">
          <Image
            src={backgroundImage}
            alt="Hero Banner"
            fill
            className="object-cover object-[72%_top] md:object-center"
            fetchPriority="high"
            loading="eager"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-[1] hidden bg-black/40 md:block" />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.92)_34%,rgba(0,0,0,0.7)_52%,rgba(0,0,0,0.08)_100%)] md:hidden" />

      {/* Content */}
      <div className="relative z-10 w-full pt-15 pb-12 md:py-0 container-main">
        <div className="max-w-[900px] 2xl:max-w-[1100px]">
          {/* Title */}
          <h1 className="uppercase text-white font-bold mb-6 md:mb-8 2xl:mb-10">
            {/* Static line */}
            <span className="block font-bold text-[#FFFFFFB2] text-[25px] leading-[1.1] md:text-[55px] lg:text-[70px]! 2xl:text-[75px]">
              {staticTitle}
            </span>

            {/* Rotating line with underline */}
            <span className="mt-1 block h-[60px] overflow-hidden md:mt-2 md:h-[80px] lg:h-[96px] xl:h-[105px] 2xl:h-[125px] relative">
              <span
                className={`block text-[25px] leading-[1.1] md:text-[55px] lg:text-[70px]! 2xl:text-[75px] roller-text ${
                  animState === "exit"
                    ? "roller-exit"
                    : animState === "enter"
                      ? "roller-enter"
                      : "roller-visible"
                }`}
              >
                <span className="font-bold text-white inline-block border-b-[2px] md:border-b-[3px] border-white">
                  {rotatingTexts[currentIndex]}
                </span>
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-[340px] text-white !text-[14px] leading-[1.55] md:mb-10 md:max-w-[500px] md:text-[20px] md:leading-[1.7] lg:!text-[24px] 2xl:mb-12 2xl:max-w-[550px]">
            {description}
          </p>

          {/* CTA Button */}
          {useContactDrawer ? (
            <button
              type="button"
              onClick={handleBannerCtaClick}
              className="inline-flex items-center gap-3 rounded-[6px] bg-[#3C4CFF] px-6 py-3 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#2d3be6] md:px-8 md:py-4 md:text-[20px]"
              aria-label={buttonLabel}
            >
              {buttonLabel}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <Link
              href={buttonLink}
              target={buttonTarget}
              className="inline-flex items-center gap-3 rounded-lg bg-[#3C4CFF] px-6 py-3 text-[18px] font-semibold text-white transition-all duration-300 hover:bg-[#2d3be6] md:px-8 md:py-4 md:text-[20px]"
            >
              {buttonLabel}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        .roller-text {
          transition:
            transform 400ms ease-in-out,
            opacity 400ms ease-in-out;
        }
        .roller-visible {
          transform: translateY(0);
          opacity: 1;
        }
        .roller-exit {
          transform: translateY(-100%);
          opacity: 0;
        }
        .roller-enter {
          transform: translateY(100%);
          opacity: 0;
          transition: none;
        }
      `}</style>
    </section>
  );
};

export default HomeBanner;
