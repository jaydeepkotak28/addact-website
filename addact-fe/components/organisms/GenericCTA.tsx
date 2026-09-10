"use client";

import React from "react";
import Link from "next/link";
import { openContactDrawer, shouldOpenContactDrawer } from "@/lib/contactDrawer";
import { getStrapiMediaUrl } from "@/lib/media";
import DynamicTitle from "../atoms/DynamicTitle";
import type { CTAProps, CtaTitle } from "@/types/cta";

export type { CTAProps };

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

  // SharedTitle object: { title, tag }
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

  const sectionMinHeight = "450px";

  const href = (link as any)?.href || (link as any)?.url || "#";
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

  return (
    <section
      className={`relative w-full bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        minHeight: sectionMinHeight,
      }}
    >
      {/* Dark overlay for text contrast if background image exists */}
      {imageUrl && <div className="absolute inset-0 bg-black/40 z-0" />}

      {/* Content wrapper with same minHeight */}
      <div
        className="relative container-main flex py-[30px] z-10"
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
              className="mb-[15px] text-[16px] md:text-[18px] text-white/90 leading-relaxed [&_p]:mb-[10px] [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}

          {label &&
            (useContactDrawer ? (
              <button
                type="button"
                onClick={handleBannerCtaClick}
                className="text-[15px] bg-[#3C4CFF] hover:bg-[#3440CB] text-white text-base font-[600] rounded-lg transition h-[41px] inline-flex items-center justify-center px-[16px] mt-[20px] w-fit"
              >
                {label}
              </button>
            ) : (
              <Link
                href={href}
                target={target}
                rel={isExternal ? "noopener noreferrer" : undefined}
                style={{ width: "fit-content" }}
                className="text-[15px] bg-[#3C4CFF] hover:bg-[#3440CB] text-white text-base font-[600] rounded-lg transition h-[41px] inline-flex items-center justify-center px-[16px] mt-[20px]"
              >
                {label}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default GenericCTA;
