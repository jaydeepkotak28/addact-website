"use client";

import React from "react";
import { openContactDrawer, shouldOpenContactDrawer } from "@/lib/contactDrawer";
import Image from "next/image";
import Link from "next/link";

import type { HeroBannerProps } from "@/types";

export type { HeroBannerProps };

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "",
  description = "",
  backgroundImageUrl = "",
  isVideo = false,
  videoUrl = "",
  button,
  showSearchbox = false,
  showAnchorLinks = false,
  isTextAlignCenter = false,
  chipsText = [],
  anchorLinks = [],
  logoUrl,
  className = "",
}) => {
  const shouldRenderVideo = isVideo && Boolean(videoUrl);
  const textAlignmentClasses = isTextAlignCenter ? "text-center items-center" : "text-left";

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -130; // Adjust for sticky header height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const target = button?.isExternal ? "_blank" : "_self";
  const useContactDrawer = !button?.isExternal && shouldOpenContactDrawer(button?.url || "");
  const handleBannerCtaClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!useContactDrawer) {
      return;
    }

    event.preventDefault();
    openContactDrawer();
  };

  return (
    <section className={`relative text-white overflow-hidden ${className}`}>
      {/* Background Image or Video */}
      {shouldRenderVideo ? (
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      ) : backgroundImageUrl ? (
        <Image
          src={backgroundImageUrl}
          alt={title || "Hero Image"}
          fill
          className="object-cover object-center z-0"
          fetchPriority="high"
        />
      ) : null}

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] z-0"></div>

      {/* Content */}
      <div className="relative container-main mt-[68px] lg:mt-[120px] min-h-[400px] lg:min-h-[500px] 2xl:min-h-[659px] flex flex-col lg:justify-center justify-end h-full mb-[40px] lg:mb-0 z-10">
        <div
          className={`max-w-[95%] ${textAlignmentClasses} ${isTextAlignCenter ? "mx-auto" : ""}`}
        >
          {/* Optional Logo */}
          {logoUrl && (
            <div className="mb-4 inline-block">
              <Image
                src={logoUrl}
                alt="Banner Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
          )}

          {/* Chips / Badges */}
          {chipsText && chipsText.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-4 ${isTextAlignCenter ? "justify-center" : "justify-start"}`}>
              {chipsText.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30"
                >
                  {chip.title}
                </span>
              ))}
            </div>
          )}

          <h1
            className={`text-white mb-[20px] md:mb-[15px] !font-bold !text-[33px] md:!text-[45px] leading-[55px] 2xl:!text-[60px] !2xl:leading-[63px] xl:max-w-[60%] ${isTextAlignCenter ? "mx-auto" : ""}`}
          >
            {title}
          </h1>

          {description && (
            <div
              className={`text-white text-[16px] leading-[25px] lg:text-[17px] lg:leading-[30px] font-normal mt-0 xl:max-w-[50%] ${isTextAlignCenter ? "mx-auto text-center" : ""}`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {button?.label && button?.url && (
            <div className={`mt-[30px] md:mt-10 ${isTextAlignCenter ? "flex justify-center" : ""}`}>
              {useContactDrawer ? (
                <button
                  onClick={handleBannerCtaClick}
                  className="inline-flex items-center gap-3 rounded-[6px] bg-[#3C4CFF] px-6 py-3 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#2d3be6] md:px-8 md:py-4 md:text-[20px]"
                >
                  <span>{button.label}</span>
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
              ) : button.url.includes("#") ? (
                <button
                  onClick={() => {
                    const targetId = button.url.replace("#", "");
                    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-block bg-[#3C4CFF] hover:bg-[#3440CB] text-white px-[10px] py-[10px] rounded-md font-[600] transition text-lg text-[16px] md:text-[15px]"
                >
                  {button.label}
                </button>
              ) : (
                <Link
                  href={button.url}
                  target={target}
                  className="inline-block bg-[#3C4CFF] hover:bg-[#3440CB] text-white px-[10px] py-[10px] rounded-md font-semibold transition text-lg text-[15px]"
                >
                  {button.label}
                </Link>
              )}
            </div>
          )}

          {/* Search Box */}
          {showSearchbox && (
            <div className={`mt-[25px] md:mt-[30px] w-full max-w-[480px] ${isTextAlignCenter ? "mx-auto" : ""}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem("search") as HTMLInputElement;
                  if (input?.value?.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`;
                  }
                }}
                className="relative flex items-center w-full"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Search articles, services, topics..."
                  className="w-full rounded-[6px] bg-white px-5 py-3.5 pr-12 text-[15px] text-gray-800 placeholder-gray-400 outline-none shadow-lg focus:ring-2 focus:ring-[#3C4CFF] transition-all"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#3C4CFF] transition-colors"
                >
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
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Dynamic Anchor Links from CMS */}
        {showAnchorLinks && anchorLinks && anchorLinks.length > 0 && (
          <div className="container-main absolute bottom-[14px] left-0 hidden lg:flex flex-wrap gap-[50px] justify-start text-white text-[16px] sm:text-base font-medium custom-links">
            {anchorLinks.map((link, idx) => {
              const href = link.href || "";
              const isAnchor = href.startsWith("#");

              return (
                <a
                  key={idx}
                  href={href}
                  target={link.target || "_self"}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (isAnchor) {
                      handleScroll(e, href.replace(/^#/, ""));
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}

            <style jsx>{`
              .custom-links a {
                position: relative;
                padding-bottom: 6px;
              }

              .custom-links a::after {
                content: "";
                position: absolute;
                bottom: -13px;
                left: 0;
                width: 100%;
                height: 5px;
                background: #3c4cff;
                border-radius: 10px 10px 0 0;
                z-index: 3;
                opacity: 0;
                transition: opacity 0.3s ease;
              }

              .custom-links a:hover::after {
                opacity: 1;
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
