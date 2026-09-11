"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import { getStrapiMediaUrl } from "@/lib/media";

// Static data — will be replaced with GraphQL data later
const introData = {
  backgroundVideo: "/Screen_animation.mp4",
};

export interface IntroSplashProps {
  onComplete: () => void;
  animationTitle?: string | null;
  firstAnimationImage?: { url?: string | null } | null;
  secondAnimationImage?: { url?: string | null } | null;
}

export const IntroSplash = ({
  onComplete,
  animationTitle,
  firstAnimationImage,
  secondAnimationImage,
}: IntroSplashProps) => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const hasCompletedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  const goToNextPhase = useCallback(() => {
    if (hasCompletedRef.current || isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    setPhase((prev) => {
      if (prev === 0) {
        return 1;
      }

      if (prev === 1) {
        hasCompletedRef.current = true;
        completionTimeoutRef.current = window.setTimeout(() => {
          onComplete();
        }, 450);
        return 2;
      }

      return prev;
    });

    transitionTimeoutRef.current = window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, 650);
  }, [onComplete]);

  const handleScrollIndicatorClick = useCallback(() => {
    if (hasCompletedRef.current) return;

    if (phase === 0) {
      goToNextPhase();
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        goToNextPhase();
      }, 720);
      return;
    }

    goToNextPhase();
  }, [goToNextPhase, phase]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("intro-scroll-lock");
    document.documentElement.classList.add("intro-scroll-lock");

    const syncViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewportWidth(width);
      setIsLandscape(height < 768 && window.innerHeight < window.innerWidth);
    };
    syncViewport();

    const handleWheel = (event: WheelEvent) => {
      if (document.body.classList.contains("menu-scroll-lock")) return;
      if (event.deltaY <= 10) return;
      event.preventDefault();
      goToNextPhase();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (document.body.classList.contains("menu-scroll-lock")) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (document.body.classList.contains("menu-scroll-lock")) return;
      if (touchStartYRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;

      if (delta > 30) {
        goToNextPhase();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", syncViewport);
    window.addEventListener("orientationchange", syncViewport);

    return () => {
      document.body.classList.remove("intro-scroll-lock");
      document.documentElement.classList.remove("intro-scroll-lock");

      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
      }
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        window.clearTimeout(autoAdvanceTimeoutRef.current);
      }

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
    };
  }, [goToNextPhase]);

  const textOpacity = phase >= 1 ? 0 : 1;
  const textTranslateY = phase >= 1 ? 90 : 0;

  // Hand transforms: keep desktop exactly as-is, tune smaller breakpoints only.
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isMiniDesktop = viewportWidth >= 1024 && viewportWidth < 1440;

  const leftHandX =
    phase >= 1
      ? isMobile
        ? -15
        : isTablet
          ? -2
          : isMiniDesktop
            ? 1
            : 4
      : isMobile
        ? -25
        : isTablet
          ? -35
          : isMiniDesktop
            ? -23
            : -20;
  const leftHandY =
    phase >= 1
      ? isMobile
        ? -55
        : isTablet
          ? -35
          : isMiniDesktop
            ? -25
            : -8
      : isMobile
        ? -25
        : isTablet
          ? -25
          : isMiniDesktop
            ? -20
            : 8;
  const leftHandRotate = phase >= 1 ? (isMobile ? -14 : isTablet ? -15 : -16) : -16;

  const rightHandX =
    phase >= 1
      ? isMobile
        ? 8
        : isTablet
          ? 1
          : isMiniDesktop
            ? -3
            : -6
      : isMobile
        ? 20
        : isTablet
          ? 35
          : isMiniDesktop
            ? 34
            : 30;
  const rightHandY =
    phase >= 1
      ? isMobile
        ? 50
        : isTablet
          ? 28
          : isMiniDesktop
            ? 28
            : -7
      : isMobile
        ? 20
        : isTablet
          ? 11
          : isMiniDesktop
            ? 10
            : -13;
  const rightHandRotate = phase >= 1 ? (isMobile ? -14 : isTablet ? -15 : -16) : -15;
  const wrapperOpacity = phase >= 2 ? 0 : 1;
  const wrapperTranslateY = phase >= 2 ? -80 : 0;
  const sideOverlayOpacity = phase >= 1 ? 1 : 0;
  const scrollIndicatorOpacity = phase >= 1 ? 0 : 1;

  // Parse title to apply underline to last word
  const currentTitle = animationTitle || "";
  const titleWords = currentTitle ? currentTitle.split(" ") : [];

  const middleIndex = Math.ceil(titleWords.length / 2);

  const firstLine = titleWords.slice(0, middleIndex).join(" ");
  const secondLine = titleWords.slice(middleIndex).join(" ");

  const secondLineWords = secondLine.split(" ");
  const lastWord = secondLineWords.pop();
  const restOfSecondLine = secondLineWords.join(" ");

  const firstImgUrl = firstAnimationImage?.url
    ? getStrapiMediaUrl(firstAnimationImage.url)
    : "";
  const secondImgUrl = secondAnimationImage?.url
    ? getStrapiMediaUrl(secondAnimationImage.url)
    : "";

  return (
    <div className="fixed inset-x-0 bottom-0 top-[60px] lg:top-[100px]! z-[110] lg:top-[86px]">
      <div
        className="absolute inset-0 overflow-hidden bg-[#0F0F0F] z-40"
        style={{
          opacity: wrapperOpacity,
          transform: `translateY(${wrapperTranslateY}px)`,
          transition: "opacity 450ms ease, transform 450ms ease",
        }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={introData.backgroundVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div
          className="absolute bottom-[-3%] left-[-8%] z-[2] w-[60%] h-[74%] md:h-[80%] lg:h-[86%]"
          style={{
            transform: `translate(${leftHandX}%, ${leftHandY}%) rotate(${leftHandRotate}deg)`,
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {firstImgUrl && (
            <Image
              src={firstImgUrl}
              alt="Left hand"
              fill
              sizes="(max-width: 768px) 60vw, (max-width: 1200px) 60vw, 50vw"
              className="object-contain object-left-bottom"
              priority
            />
          )}
        </div>

        <div
          className="absolute top-[-3%] right-[-8%] z-[2] w-[60%] h-[74%] md:h-[80%] lg:h-[86%]"
          style={{
            transform: `translate(${rightHandX}%, ${rightHandY}%) rotate(${rightHandRotate}deg)`,
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {secondImgUrl && (
            <Image
              src={secondImgUrl}
              alt="Right hand"
              fill
              sizes="(max-width: 768px) 60vw, (max-width: 1200px) 60vw, 50vw"
              className="object-contain object-right-top"
              priority
            />
          )}
        </div>

        <div
          className="absolute inset-y-0 left-0 w-[22%] z-[3] pointer-events-none"
          style={{
            opacity: sideOverlayOpacity,
            background: "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0))",
            transition: "opacity 500ms ease",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[22%] z-[3] pointer-events-none"
          style={{
            opacity: sideOverlayOpacity,
            background: "linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0))",
            transition: "opacity 500ms ease",
          }}
        />

        <div
          className="absolute inset-0 z-[4] flex flex-col items-center justify-center"
          style={{
            opacity: textOpacity,
            transform: `translateY(-${textTranslateY}px)`,
            transition: "transform 550ms ease, opacity 550ms ease",
          }}
        >
          <h1 className="text-white text-center font-bold uppercase leading-[1.1]">
            {firstLine && (
              <span className="block font-bold text-[36px] md:text-[60px] lg:text-[80px] xl:text-[100px] 2xl:text-[110px]">
                {firstLine}
              </span>
            )}

            {secondLine && (
              <span className="block font-bold text-[36px] md:text-[60px] lg:text-[80px] xl:text-[100px] 2xl:text-[110px]">
                {restOfSecondLine && <>{restOfSecondLine} </>}
                <span className="relative inline-block">
                  {lastWord}
                  <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-[2px] md:h-[3px] bg-white" />
                </span>
              </span>
            )}
          </h1>
        </div>

        <button
          type="button"
          aria-label="Start intro animation"
          onClick={handleScrollIndicatorClick}
          className={clsx(
            "absolute left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2 cursor-pointer",
            isLandscape ? "bottom-[18px]" : "bottom-8 md:bottom-12",
          )}
          style={{
            opacity: scrollIndicatorOpacity,
            transition: "opacity 250ms ease",
          }}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center animate-bounce">
            <svg
              width="26"
              height="36"
              viewBox="0 0 26 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5833 0H11.25C5.05 0 0 5.05 0 11.25V24.5833C0 30.7833 5.05 35.8333 11.25 35.8333H14.5833C20.7833 35.8333 25.8333 30.7833 25.8333 24.5833V11.25C25.8333 5.05 20.7833 0 14.5833 0ZM18.8 22.1333L13.8 27.1333C13.55 27.3833 13.2333 27.5 12.9167 27.5C12.6 27.5 12.2833 27.3833 12.0333 27.1333L7.03333 22.1333C6.55 21.65 6.55 20.85 7.03333 20.3667C7.51667 19.8833 8.31667 19.8833 8.8 20.3667L11.6667 23.2333V9.58333C11.6667 8.9 12.2333 8.33333 12.9167 8.33333C13.6 8.33333 14.1667 8.9 14.1667 9.58333V23.2333L17.0333 20.3667C17.5167 19.8833 18.3167 19.8833 18.8 20.3667C19.2833 20.85 19.2833 21.65 18.8 22.1333Z"
                fill="white"
                fillOpacity="0.6"
              />
            </svg>
          </div>
          <span className="text-white/70 text-[16px] md:text-[20px] tracking-[3px] uppercase">
            SCROLL DOWN
          </span>
        </button>
      </div>
    </div>
  );
};

export default IntroSplash;
