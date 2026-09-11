"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStrapiMediaUrl } from "@/lib/media";

import type {
  CapabilityLink,
  CapabilityImage,
  CapabilityItem,
  OurCapabilitiesData,
  OurCapabilitiesProps,
} from "@/types";

export type {
  CapabilityLink,
  CapabilityImage,
  CapabilityItem,
  OurCapabilitiesData,
  OurCapabilitiesProps,
};

const ArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.82112 5.72616L18.2737 5.72617L18.2737 17.1787"
      stroke="#3C4CFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.72632 18.274L17.8015 6.19882"
      stroke="#3C4CFF"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getLinkTarget = (target?: string | null) => {
  return target === "_blank" || target === "blank" ? "_blank" : "_self";
};

const cleanDescription = (desc?: string | null): string => {
  if (!desc) return "";
  return desc.replace(/^<p>/i, "").replace(/<\/p>$/i, "").trim();
};

export const OurCapabilities = ({ data, className = "" }: OurCapabilitiesProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [heights, setHeights] = useState<number[]>([]);
  const [mobileHeights, setMobileHeights] = useState<number[]>([]);
  const { heading, capabilities } = data || {};
  const headingText = typeof heading === "string" ? heading : heading?.title || "";

  useEffect(() => {
    const measured = contentRefs.current.map((el) =>
      el ? el.scrollHeight : 0
    );
    const mobileMeasured = mobileContentRefs.current.map((el) =>
      el ? el.scrollHeight : 0
    );

    setHeights(measured);
    setMobileHeights(mobileMeasured);
  }, [activeIndex, capabilities]);

  const handleTabClick = (index: number) => {
    setActiveIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  const visibleDesktopIndex = hoveredIndex ?? activeIndex;

  if (!capabilities || capabilities.length === 0) {
    return null;
  }

  return (
    <section className={`-mt-0.5 bg-white pb-6 md:pb-0 overflow-x-hidden ${className}`}>
      <div className="container-main">
        {/* Mobile heading */}
        {headingText && (
          <h2 className="!pb-5 !text-[28px] !text-[#0F0F0F] lg:hidden font-semibold!">
            {headingText}
          </h2>
        )}

        {/* Desktop / Tablet layout */}
        <div className="hidden lg:flex gap-2 lg:gap-4 2xl:gap-6">
          {/* Left side — Heading + Tabs */}
          <div className="w-full md:w-[55%] lg:w-[60%] max-w-[1059px]">
            {headingText && (
              <h2 className="!text-[28px] md:!text-[40px] 2xl:!text-[60px] !pb-4 xl:!pb-10 !text-[#0F0F0F] font-semibold!">
                {headingText}
              </h2>
            )}

            {capabilities.map((item, index) => {
              const isOpen = visibleDesktopIndex === index;
              const linkKey = item?.link?.id || item?.id || index;
              const itemDesc = cleanDescription(item.description);

              return (
                <div
                  key={linkKey}
                  className="border-t border-[#e0e0e0] last:border-b"
                >
                  <div className="pl-5 2xl:pl-6">
                    <div
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setActiveIndex(index);
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="w-full text-left py-5 2xl:py-7"
                    >
                      <Link
                        href={item?.link?.href || "#"}
                        target={
                          item?.link?.target ? `_${item.link.target.replace(/^_/, "")}` : "_self"
                        }
                        rel={
                          item?.link?.target === "_blank" || item?.link?.isExternal
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="!text-[20px] lg:!text-[24px] 2xl:!text-[36px] !font-medium transition-colors duration-300 text-[#0F0F0F] hover:text-[#3C4CFF] inline-flex items-center gap-2"
                      >
                        {item?.title}
                        <span
                          className={`flex-shrink-0 transition-opacity duration-300 ${
                            isOpen ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <ArrowIcon />
                        </span>
                      </Link>
                    </div>

                    {/* Expandable content */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-in-out"
                      style={{
                        maxHeight: isOpen
                          ? `${heights[index] || 600}px`
                          : "0px",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div
                        ref={(el) => {
                          contentRefs.current[index] = el;
                        }}
                      >
                        <p className="text-[#0F0F0F] !text-[18px] !lg:text-[20px] !2xl:text-[22px] leading-8 pb-4 2xl:pb-6">
                          {itemDesc}
                        </p>

                        {/* Services grid */}
                        {item?.sublinks && item?.sublinks?.length > 0 && (
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 2xl:gap-y-4 pb-6 2xl:pb-8">
                            {item?.sublinks?.map((sublink, subIdx) => (
                              <Link
                                key={sublink?.id || subIdx}
                                href={sublink?.href || "#"}
                                target={getLinkTarget(sublink?.target)}
                                rel={
                                  sublink?.isExternal
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="flex items-center gap-2 text-[#0F0F0F] hover:text-[#3C4CFF] transition-colors"
                              >
                                <span className="flex-shrink-0">
                                  <ArrowIcon />
                                </span>
                                <span className="!text-[18px] !lg:text-[20px] !2xl:text-[22px] font-medium">
                                  {sublink?.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side — Image */}
          <div className="w-full md:w-[45%] lg:flex-1 lg:min-w-0 lg:mr-[calc(50%-50vw)] flex justify-end items-end">
            <div className="relative w-full max-w-[677px] h-[520px] lg:h-[620px] xl:h-[700px] 2xl:h-[820px] overflow-hidden rounded-tl-[240px]">
              {capabilities?.map((item, index) => {
                const linkKey = item?.link?.id || item?.id || index;
                const rawUrl = item?.image?.url || "";
                const imgUrl = rawUrl ? getStrapiMediaUrl(rawUrl) : "";

                return (
                  <div
                    key={linkKey}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      visibleDesktopIndex === index
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {imgUrl && (
                      <Image
                        src={imgUrl}
                        alt={item?.image?.alternativeText || item?.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 45vw, 50vw"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile layout — Accordion */}
        <div className="mt-4 block lg:hidden">
          {capabilities?.map((item, index) => {
            const isActive = activeIndex === index;
            const linkKey = item?.link?.id || item?.id || index;
            const itemDesc = cleanDescription(item.description);
            const rawUrl = item?.image?.url || "";
            const imgUrl = rawUrl ? getStrapiMediaUrl(rawUrl) : "";

            return (
              <div
                key={linkKey}
                className="border-y border-[#D9D9D9] first:border-t-0 last:border-b-0"
              >
                {isActive && imgUrl && (
                  <div className="relative mb-5 mt-5 aspect-[247/200] w-full overflow-hidden rounded-tl-[72px]">
                    <Image
                      src={imgUrl}
                      alt={item?.image?.alternativeText || item.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}

                <button
                  onClick={() => handleTabClick(index)}
                  className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
                >
                  <h3 className="!text-[18px] !font-medium !leading-[1.35] text-[#0F0F0F]">
                    {item.title}
                  </h3>
                  <svg
                    className={`ml-4 h-5 w-5 shrink-0 text-[#3C4CFF] transition-transform duration-300 ${
                      isActive ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: isActive
                      ? `${mobileHeights[index] || 900}px`
                      : "0px",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <div
                    ref={(el) => {
                      mobileContentRefs.current[index] = el;
                    }}
                    className="pb-6"
                  >
                    <p className="pb-5 text-[14px] leading-[1.8] text-[#0F0F0F]">
                      {itemDesc}
                    </p>

                    {item?.sublinks && item.sublinks.length > 0 && (
                      <div className="flex flex-col gap-4 pb-6">
                        {item.sublinks.map((sublink, subIdx) => (
                          <Link
                            key={sublink?.id || subIdx}
                            href={sublink?.href || "#"}
                            target={getLinkTarget(sublink?.target)}
                            rel={
                              sublink?.isExternal
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="flex items-center gap-3 text-[#0F0F0F] hover:text-[#3C4CFF] transition-colors"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                              <ArrowIcon />
                            </span>
                            <span className="text-[14px] font-medium leading-[1.45]">
                              {sublink?.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {item?.link?.href && (
                      <Link
                        href={item.link.href}
                        target={getLinkTarget(item?.link?.target)}
                        rel={
                          getLinkTarget(item?.link?.target) === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="inline-flex items-center gap-3 rounded-[6px] border border-[#3C4CFF] px-4 py-2 text-[16px] font-semibold leading-none text-[#3C4CFF] transition-colors duration-300 hover:bg-[#3C4CFF] hover:text-white"
                      >
                        {item.link.label || "Learn More"}
                        <svg
                          width="18"
                          height="18"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurCapabilities;
