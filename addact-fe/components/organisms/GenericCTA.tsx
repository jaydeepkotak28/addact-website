"use client";

import React, { type CSSProperties } from "react";
import Link from "next/link";
import { openContactDrawer, shouldOpenContactDrawer } from "@/lib/contactDrawer";
import { getStrapiMediaUrl } from "@/lib/media";
import DynamicTitle from "../atoms/DynamicTitle";
import { RightArrowIcon } from "../atoms/icons";
import type { CTAProps } from "@/types/cta";

export type { CTAProps };

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const getHeadingData = (
  rawTitle?: CTAProps["title"]
): { text: string; tag?: string } => {
  if (!rawTitle) return { text: "" };

  if (typeof rawTitle === "string") {
    return { text: rawTitle, tag: "h2" };
  }

  if (Array.isArray(rawTitle)) {
    const first = rawTitle[0];
    if (!first) return { text: "" };
    if (typeof first === "string") return { text: first, tag: "h2" };
    if ("title" in first && typeof first.title === "string") {
      return { text: first.title, tag: (first as any).tag || "h2" };
    }
    if ("h1" in first) return { text: first.h1 || "", tag: "h1" };
    if ("h2" in first) return { text: first.h2 || "", tag: "h2" };
    if ("h3" in first) return { text: first.h3 || "", tag: "h3" };
    if ("h4" in first) return { text: (first as any).h4 || "", tag: "h4" };
    if ("h5" in first) return { text: (first as any).h5 || "", tag: "h5" };
    if ("h6" in first) return { text: (first as any).h6 || "", tag: "h6" };
    return { text: "" };
  }

  if ("title" in rawTitle && typeof rawTitle.title === "string") {
    return { text: rawTitle.title, tag: (rawTitle as any).tag || "h2" };
  }

  return { text: "" };
};

const getDescriptionHtml = (desc?: CTAProps["description"]): string => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (Array.isArray(desc)) {
    const first = desc[0];
    if (first?.children && Array.isArray(first.children)) {
      return first.children.map((c) => c.text || "").join(" ");
    }
  }
  return "";
};

export const GenericCTA: React.FC<CTAProps> = ({
  internalName = "",
  variant,
  hasIcon,
  title,
  description,
  image,
  link,
  className = "",
}) => {
  const { text: headingText, tag: headingTag } = getHeadingData(title);
  const descriptionHtml = getDescriptionHtml(description);

  const rawImageUrl = image?.url || "";
  const imageUrl = rawImageUrl ? getStrapiMediaUrl(rawImageUrl) : "";

  const href = (link as any)?.href || (link as any)?.url || "";
  const label = link?.label || "";
  const isExternal = Boolean(link?.isExternal);
  const target = isExternal ? "_blank" : (link?.target as string) || "_self";

  const useContactDrawer = !isExternal && shouldOpenContactDrawer(href);

  const handleBannerCtaClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!useContactDrawer) {
      return;
    }

    event.preventDefault();
    openContactDrawer();
  };

  const normalizedName = (internalName || "").toLowerCase().trim();

  // Variant 1: CTA 2 (Centered layout, white button with arrow icon)
  const isCta2 =
    variant === "cta-center" ||
    variant === "banner2" ||
    variant === "cta2" ||
    normalizedName.includes("cta 2") ||
    normalizedName.includes("cta-2") ||
    normalizedName.includes("cta2");

  // Variant 2: Home CTA / CTA Logo (Left-aligned, Figma SVG triangle decoration, gradient, white button with arrow icon)
  const isHome =
    variant === "cta-logo" ||
    variant === "home" ||
    variant === "banner1" ||
    normalizedName === "home cta" ||
    normalizedName.startsWith("home-cta");

  // Determine whether to display the RightArrowIcon
  // In existing website: Home CTA and CTA 2 have the icon; generic CTAs do not.
  const showIcon =
    hasIcon !== undefined ? hasIcon : isHome || isCta2;

  // --------------------------------------------------------------------------
  // VARIANT 1: CTA 2 (Centered layout)
  // --------------------------------------------------------------------------
  if (isCta2) {
    return (
      <section data-ref="cta-banner2" className={className}>
        <div
          className="text-white bg-center bg-cover bg-no-repeat w-full h-full shadow-md"
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
        >
          <div className="container-main">
            <div className="flex flex-col justify-center items-center py-24 text-center">
              {headingText && (
                <DynamicTitle
                  title={headingText}
                  tag={headingTag}
                  defaultTag="h2"
                  className="!text-[28px] md:!text-[40px] 2xl:!text-[60px] leading-[85px] font-bold"
                />
              )}

              {descriptionHtml && (
                <div
                  className="mt-4 text-[16px] md:text-[18px] text-white/90 max-w-2xl leading-relaxed [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              )}

              {label &&
                (useContactDrawer ? (
                  <button
                    type="button"
                    onClick={handleBannerCtaClick}
                    className="mt-12 bg-white text-[#3C4CFF] text-[16px] lg:text-lg px-4 py-2 lg:px-5 lg:py-4 rounded hover:bg-gray-200 flex items-center gap-5 font-semibold cursor-pointer transition"
                  >
                    {label}
                    {showIcon && <RightArrowIcon />}
                  </button>
                ) : (
                  <Link href={href || "#"} target={target}>
                    <button
                      type="button"
                      className="mt-12 bg-white text-[#3C4CFF] text-[16px] lg:text-lg px-4 py-2 lg:px-5 lg:py-4 rounded hover:bg-gray-200 flex items-center gap-5 font-semibold cursor-pointer transition"
                    >
                      {label}
                      {showIcon && <RightArrowIcon />}
                    </button>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 2: Home CTA (Left-aligned, Figma SVG triangle decoration & gradient)
  // --------------------------------------------------------------------------
  if (isHome) {
    const bgVars: CSSVars = {
      "--cta-bg-mobile": imageUrl ? `url(${imageUrl})` : "none",
      "--cta-bg-desktop": imageUrl ? `url(${imageUrl})` : "none",
    };

    return (
      <section className={`relative overflow-hidden ${className}`}>
        <div
          className="cta-bg relative text-white w-full h-full shadow-md bg-no-repeat bg-cover bg-center"
          style={bgVars}
        >
          {/* Figma backdrop blur geometric triangle decoration */}
          <div className="absolute -bottom-10 right-0 hidden md:block pointer-events-none z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="619"
              height="480"
              viewBox="0 0 619 480"
              fill="none"
              className="w-[619px] h-auto"
            >
              <foreignObject
                x="-13.3538"
                y="-13.3538"
                width="725.11"
                height="679.708"
              >
                <div
                  style={{
                    backdropFilter: "blur(6.68px)",
                    clipPath: "url(#bgblur_0_18204_4552_clip_path)",
                    height: "100%",
                    width: "100%",
                  }}
                />
              </foreignObject>
              <g data-figma-bg-blur-radius="13.3538">
                <path
                  d="M698.403 653H570.205L348.23 146.156L126.256 653H0L294.615 0H402.831L698.403 653Z"
                  fill="white"
                  fillOpacity="0.02"
                />
                <path
                  d="M402.615 0.333984L697.885 652.666H570.423L348.536 146.022L348.23 145.324L347.925 146.022L126.038 652.666H0.517578L294.831 0.333984H402.615Z"
                  stroke="white"
                  strokeOpacity="0.7"
                  strokeWidth="0.667689"
                />
              </g>
              <defs>
                <clipPath
                  id="bgblur_0_18204_4552_clip_path"
                  transform="translate(13.3538 13.3538)"
                >
                  <path d="M698.403 653H570.205L348.23 146.156L126.256 653H0L294.615 0H402.831L698.403 653Z" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="container-main relative">
            <div className="absolute inset-0 bg-linear-to-r from-[#0f0f0f] from-[38.053%] via-[rgba(15,15,15,0.7)] via-[58.884%] to-[rgba(15,15,15,0)] to-[80.044%] z-10" />

            <div className="relative z-20 pt-[40px] pb-[150px] md:py-[90px] banner-content-space">
              {headingText && (
                <DynamicTitle
                  title={headingText}
                  tag={headingTag}
                  defaultTag="h2"
                  className="!text-[28px] md:!text-[40px] 2xl:!text-[60px] md:w-[550px] lg:!w-[800px] 2xl:leading-[85px] font-bold"
                />
              )}

              {descriptionHtml && (
                <div
                  className="mt-4 text-[16px] md:text-[18px] text-white/90 max-w-xl leading-relaxed [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              )}

              {label &&
                (useContactDrawer ? (
                  <button
                    type="button"
                    onClick={handleBannerCtaClick}
                    className="mt-[24px] md:mt-12 bg-white text-[#3C4CFF] text-[16px] lg:text-lg px-4 py-2 lg:px-5 lg:py-4 rounded-[8px] md:rounded-[10px] hover:bg-[#3C4CFF] hover:text-white flex items-center gap-5 font-semibold cursor-pointer transition"
                  >
                    {label}
                    {showIcon && <RightArrowIcon />}
                  </button>
                ) : (
                  <Link href={href || "#"} target={target}>
                    <button
                      type="button"
                      className="mt-[24px] md:mt-12 bg-white text-[#3C4CFF] text-[16px] lg:text-lg px-4 py-2 lg:px-5 lg:py-4 rounded-[8px] md:rounded-[10px] hover:bg-[#3C4CFF] hover:text-white flex items-center gap-5 font-semibold cursor-pointer transition"
                    >
                      {label}
                      {showIcon && <RightArrowIcon />}
                    </button>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          .cta-bg {
            background-image: var(--cta-bg-mobile) !important;
          }

          @media (min-width: 768px) {
            .cta-bg {
              background-image: var(--cta-bg-desktop) !important;
            }
          }
        `}</style>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 3: Standard / Generic CTA (For all inner pages: AboutUs, Services, Industry)
  // Left-aligned, Blue Button, NO ICON by default
  // --------------------------------------------------------------------------
  const sectionMinHeight = "450px";

  return (
    <section
      className={`relative w-full bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        minHeight: sectionMinHeight,
      }}
    >
      <div
        className="relative container-main flex py-[30px]"
        style={{ minHeight: sectionMinHeight }}
      >
        <div className="flex flex-col w-full justify-end lg:justify-center text-white max-w-xl text-left">
          {headingText && (
            <DynamicTitle
              title={headingText}
              tag={headingTag}
              defaultTag="h2"
              className="mb-[15px] font-bold text-[28px] md:text-[38px] leading-tight"
            />
          )}

          {descriptionHtml && (
            <div
              className="mb-[15px] text-[16px] md:text-[18px] text-white/90 leading-relaxed [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}

          {label &&
            (useContactDrawer ? (
              <button
                type="button"
                onClick={handleBannerCtaClick}
                className="text-[15px] bg-[#3C4CFF] hover:bg-[#3440CB] text-white text-base font-[600] rounded-lg transition h-[41px] inline-flex items-center justify-center px-[16px] mt-[20px] w-fit cursor-pointer"
              >
                {label}
                {showIcon && <RightArrowIcon className="ml-2 w-4 h-4" />}
              </button>
            ) : (
              <Link
                href={href || "#"}
                target={target}
                rel={isExternal ? "noopener noreferrer" : undefined}
                style={{ width: "fit-content" }}
                className="text-[15px] bg-[#3C4CFF] hover:bg-[#3440CB] text-white text-base font-[600] rounded-lg transition h-[41px] inline-flex items-center justify-center px-[16px] mt-[20px] cursor-pointer"
              >
                {label}
                {showIcon && <RightArrowIcon className="ml-2 w-4 h-4" />}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default GenericCTA;
