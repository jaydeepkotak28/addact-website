"use client";
import type {
  AddactHeaderData,
  HeaderCard,
  HeaderLink,
  HeaderMenuItem,
  HeaderSubLayer,
} from "@/graphql/queries/addact-header";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// import {
//   openContactDrawer,
//   shouldOpenContactDrawer,
// } from "@/lib/contactDrawer";
import { ChevronRightIcon } from "../atom/icons";

interface HeaderProps {
  headerData?: AddactHeaderData | null;
  transparentHeader?: boolean;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getMenuLabel(item: HeaderMenuItem): string {
  return item.link?.label ?? "";
}

function getMenuHref(item: HeaderMenuItem): string {
  return item.link?.href ?? "#";
}

function hasDropdown(item: HeaderMenuItem): boolean {
  return !!(item.subLayers && item.subLayers.length > 0);
}

function formatContactHref(href: string): string {
  if (!href || href === "#") return "#";
  const h = href.trim();
  if (
    h.startsWith("mailto:") ||
    h.startsWith("tel:") ||
    h.startsWith("http") ||
    h.startsWith("/") ||
    h.startsWith("#")
  ) {
    return h;
  }
  // If it contains @, treat as email
  if (h.includes("@")) return `mailto:${h}`;
  // If it's purely numbers, plus, space, etc., treat as phone
  if (/^[\d+ \-()]+$/.test(h)) return `tel:${h.replace(/\s+/g, "")}`;
  return h;
}

// ─── Featured Card ────────────────────────────────────────────────────────────────────────────

function FeaturedCard({ card, className }: { card: HeaderCard; className?: string }) {
  const lnk = card.link;
  const imgUrl = card.image?.url;

  return (
    <div
      className={`relative h-[276px] bg-[#3C4CFF] rounded-2xl text-white overflow-hidden flex font-montserrat group/card ${className ?? "w-[474px]"}`}
    >
      {/* Background Image or Circles */}
      {imgUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imgUrl}
            alt={card.image?.alternativeText || ""}
            fill
            className="object-cover opacity-40 group-hover/card:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#3C4CFF] via-transparent to-transparent" />
        </div>
      )}

      {/* Content container-main */}
      <div className="relative z-10 flex flex-col justify-between p-[30px] flex-1 min-w-0">
        <h3 className="text-[30px]! font-medium leading-[45px]! line-clamp-3! w-[312px]">
          {card.title ?? "Featured Article"}
        </h3>
        {lnk && (
          <Link
            href={lnk.href ?? "#"}
            target={lnk.isExternal ? "_blank" : "_self"}
            aria-label={lnk.label ?? card.title ?? "Read more"}
            className="inline-flex items-center bg-white text-[#3C4CFF] px-5 py-[17px] rounded-[8px] font-semibold text-[18px] hover:bg-gray-100 transition-all w-fit shadow-lg shadow-black/20 group/btn"
          >
            {lnk.label ?? "Read More"}

            <ChevronRightIcon className="group-hover/btn:translate-x-1 transition-transform ml-[20px]" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Dropdown Content ─────────────────────────────────────────────────────────
function DropdownContent({
  item,
  additionalText,
  isLastItem,
  contactDetails = [],
}: {
  item: HeaderMenuItem;
  additionalText?: string;
  isLastItem?: boolean;
  contactDetails?: HeaderLink[];
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const subs = item.subLayers ?? [];
  const activeSub: HeaderSubLayer | undefined = subs[activeIdx];
  const anyHasLevel3 = subs.some((s) => (s.subLayers?.length ?? 0) > 0);

  // ── Layout A: Has subLayers with Level 3 → sidebar + right content (Services) ──
  if (subs.length > 0 && anyHasLevel3) {
    const hasLevel3 = (activeSub?.subLayers?.length ?? 0) > 0;
    const showCard = activeSub?.isCardShow && activeSub.card;

    return (
      <div className="flex w-full items-stretch min-h-[336px]">
        {/* Sidebar */}
        <div
          className="w-[clamp(280px,34vw,533px)] shrink-0 flex flex-col border-r border-[#2E2E2E]"
          style={{ background: "#0F0F0F" }}
        >
          {subs.map((sub, idx) => {
            const label = sub.link?.label ?? `Category ${idx + 1}`;
            const isActive = activeIdx === idx;
            return (
              <Link
                href={sub.link?.href ?? "#"}
                target={sub.link?.isExternal ? "_blank" : "_self"}
                aria-label={`Navigate to ${label} page`}
                key={sub.id ?? idx}
                onMouseEnter={() => {
                  setActiveIdx(idx);
                }}
                className={`w-full text-left text-white px-5 py-7.5 text-[20px] font-medium font-montserrat transition-all flex justify-between items-center gap-2 border-b h-[84px] border-[#2E2E2E] ${
                  isActive ? "bg-[#3C4CFF]" : ""
                }`}
              >
                <span className="flex-1 leading-snug">{label}</span>
                <ChevronRight
                  size={24}
                  className={`shrink-0 ${isActive ? "opacity-100" : "opacity-30"}`}
                />
              </Link>
            );
          })}
        </div>

        <div
          className="flex-1 px-[40px] py-[30px] pb-7 text-white"
          style={{ background: "#0F0F0F" }}
        >
          {hasLevel3 ? (
            <div
              className={`grid ${showCard ? "grid-cols-1" : "grid-cols-2"} gap-x-8 gap-y-[28px]`}
            >
              {activeSub?.subLayers?.map((deep, di) => {
                const deepLink = deep.link;
                if (!deepLink) return null;
                return (
                  <Link
                    key={deep.id ?? di}
                    href={deepLink.href ?? "#"}
                    aria-label={deepLink.label ?? `Sub-category ${di + 1}`}
                    target={deepLink.isExternal ? "_blank" : "_self"}
                    className="flex items-center gap-3 group"
                  >
                    {deepLink.Icon?.url && (
                      <Image
                        src={deepLink.Icon.url}
                        alt={deepLink.Icon.alternativeText || ""}
                        width={28}
                        height={28}
                        className="w-7 h-7 object-contain shrink-0 opacity-80"
                      />
                    )}
                    <span className="text-[18px] font-medium font-montserrat text-[#B7B7B7] group-hover:text-white transition-colors leading-[22px]">
                      {deepLink.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] text-gray-700 text-sm italic select-none">
              No sub-services found
            </div>
          )}
        </div>

        {/* Card Section */}
        {showCard && (
          <div className="shrink-0 pr-[30px] pt-[30px]" style={{ background: "#0F0F0F" }}>
            <FeaturedCard card={activeSub.card!} />
          </div>
        )}
      </div>
    );
  }

  // ── Layout B: Flat grid (Industry/Resources/Company) ──
  const showCard = (item.isCardShow && item.card) || (isLastItem && !!additionalText);

  return (
    <div className="flex flex-col w-full min-h-[336px]">
      <div className="flex w-full items-stretch flex-1 gap-5">
        {/* Links Area */}
        <div
          className={`flex-1 min-w-0 px-10 py-7.5 ${showCard ? "w-full max-w-[1066px]" : ""}`}
          style={{ background: "#0F0F0F" }}
        >
          <div className={`grid ${showCard ? "grid-cols-2" : "grid-cols-3"} gap-x-8 gap-y-7`}>
            {subs.map((sub, si) => {
              const lnk = sub.link ?? sub.card?.link;
              const label = lnk?.label ?? sub.card?.title;
              const href = lnk?.href ?? "#";
              if (!label) return null;

              return (
                <Link
                  key={sub.id ?? si}
                  href={href}
                  target={lnk?.isExternal ? "_blank" : "_self"}
                  className="flex items-center gap-3 text-[#B7B7B7] hover:text-white transition-colors py-0.5 group"
                  aria-label={lnk?.label ?? sub.card?.title ?? `Category ${si + 1}`}
                >
                  {lnk?.Icon?.url && (
                    <span className="text-[#E3E3E3] transition-colors shrink-0">
                      <Image
                        src={lnk.Icon.url}
                        alt=""
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </span>
                  )}
                  <span className="text-[18px] font-medium font-montserrat leading-[22px]">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {showCard && (
          <>
            {isLastItem && additionalText && (
              <div
                className="w-[474px] min-w-[474px] max-w-[474px] shrink-0 relative overflow-hidden flex flex-col"
                style={{ background: "#0F0F0F" }}
              >
                <div className="relative z-10 text-right font-montserrat pt-[30px]">
                  <div className="flex flex-col items-end">
                    {(() => {
                      const words = additionalText.split(" ");
                      if (words.length > 2) {
                        const firstPart = words.slice(0, words.length - 1).join(" ");
                        const secondPart = words[words.length - 1];
                        return [firstPart, secondPart].map((line, index) => (
                          <span
                            key={index}
                            className="text-[72px] xl:text-[80px] font-bold leading-[0.85] text-white opacity-20 uppercase tracking-wide"
                          >
                            {line}
                          </span>
                        ));
                      }
                      return words.map((word, index) => (
                        <span
                          key={index}
                          className="text-[72px] xl:text-[80px] font-bold leading-[0.85] text-white opacity-20 uppercase tracking-wide"
                        >
                          {word}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {showCard && (
          <>
            {!isLastItem && (
              <div
                className="w-[474px] min-w-[474px] max-w-[474px] shrink-0 relative overflow-hidden flex flex-col justify-center"
                style={{ background: "#0F0F0F" }}
              >
                <div className="pr-7.5">
                  {item.card && <FeaturedCard card={item.card} className="w-full" />}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Strip */}
      {isLastItem && contactDetails.length > 0 && (
        <div
          className="flex w-full items-stretch border-t border-[#2E2E2E] h-[80px]"
          style={{ background: "#3C4CFF" }}
        >
          {contactDetails.slice(0, 3).map((detail, idx) => {
            const rawHref = detail.href?.trim();
            if (!rawHref || rawHref === "#") {
              return null;
            }

            return (
              <Link
                key={detail.id ?? idx}
                href={formatContactHref(rawHref)}
                aria-label={`${detail.label || "Contact"} ${detail.SubDisc || ""}`.trim()}
                target={detail.isExternal ? "_blank" : "_self"}
                className={`flex-1 flex items-center justify-between px-10 group ${
                  idx < 2 ? "border-r border-white/10" : ""
                }`}
              >
                <div className="flex gap-2">
                  <span className="text-white text-[20px] font-semibold font-montserrat">
                    {detail.label}
                  </span>
                  <span className="text-white text-[20px] font-montserrat">{detail?.SubDisc}</span>
                </div>
                {detail.Icon?.url && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all">
                    <Image
                      src={detail.Icon.url}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain invert-0"
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────
const Header = ({
  headerData,
  // onContactClick,
  transparentHeader,
}: HeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [activeMobileItem, setActiveMobileItem] = useState<HeaderMenuItem | null>(null); // Level 1 active
  const [expandedLevel2, setExpandedLevel2] = useState<string | null>(null); // Level 2 accordion
  const [bannerVisible, setBannerVisible] = useState(true);
  const [headerHidden, setHeaderHidden] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef(0);
  const [scrolled, setScrolled] = React.useState(true);

  const clearCloseDropdownTimer = () => {
    if (closeDropdownTimer.current) {
      clearTimeout(closeDropdownTimer.current);
      closeDropdownTimer.current = null;
    }
  };

  const scheduleCloseDropdown = () => {
    clearCloseDropdownTimer();
    closeDropdownTimer.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 140);
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const previousScrollY = lastScrollYRef.current;

      setScrolled(y <= 20);

      if (isMobileMenuOpen) {
        setBannerVisible(true);
        setHeaderHidden(false);
        lastScrollYRef.current = y;
        return;
      }

      const scrollingDown = y > previousScrollY;
      setBannerVisible(!scrollingDown);

      if (y > 80) {
        setHeaderHidden(scrollingDown);
      } else {
        setHeaderHidden(false);
      }

      lastScrollYRef.current = y;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setOpenDropdown(null);
    setActiveMobileItem(null);
    setExpandedLevel2(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest("[data-nav-btn]") &&
        !target.closest("[data-dropdown]")
      ) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  useEffect(() => {
    return () => {
      clearCloseDropdownTimer();
    };
  }, []);

  const lp = pathname.toLowerCase();
  const showBanner =
    pathname === "/sitecore-cms-development" ||
    pathname.startsWith("/sitecore-cms-development/") ||
    (lp.startsWith("/blogs") && lp.includes("sitecore")) ||
    (lp.startsWith("/portfolio") && lp.includes("sitecore")) ||
    (lp.startsWith("/events") && lp.includes("sitecore")) ||
    (lp.startsWith("/press-releases") && lp.includes("sitecore"));

  const logo = headerData?.logo;
  const menu = headerData?.menu ?? [];
  const contactBtn = headerData?.contactButton;
  const contactDetails = headerData?.contactDetails ?? [];

  const contactHref = contactBtn?.link?.href ?? "/contact-us";
  const contactLabel = contactBtn?.link?.label ?? contactBtn?.title ?? "Contact us";
  const contactIsExternal = contactBtn?.link?.isExternal ?? false;
  const contactIcon = contactBtn?.link?.Icon?.url ?? contactBtn?.image?.url;
  //   const useContactDrawer =
  //     !contactIsExternal && shouldOpenContactDrawer(contactHref);

  //   const handleContactTrigger = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //     if (!useContactDrawer) {
  //       return;
  //     }

  //     e.preventDefault();
  //     setMobileMenuOpen(false);
  //     openContactDrawer();
  //   };

  useEffect(() => {
    if (isMobileMenuOpen) {
      setHeaderHidden(false);
      setBannerVisible(true);
      document.body.classList.add("menu-scroll-lock");
      document.documentElement.classList.add("menu-scroll-lock");
    } else {
      document.body.classList.remove("menu-scroll-lock");
      document.documentElement.classList.remove("menu-scroll-lock");
    }
    return () => {
      document.body.classList.remove("menu-scroll-lock");
      document.documentElement.classList.remove("menu-scroll-lock");
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-[130] transition-all duration-300
  ${transparentHeader && scrolled ? "bg-transparent border-transparent" : "bg-[#0F0F0F] border-b border-b-[#2e2e2e]"}
  ${headerHidden && !isMobileMenuOpen ? "-translate-y-full" : ""}`}
    >
      {/* Banner */}
      {showBanner && (
        <div
          className={`hidden lg:block bg-[#3C4CFF] overflow-hidden transition-all duration-300 ${bannerVisible ? "max-h-[60px]" : "max-h-0"}`}
        >
          <div className="container-main text-white justify-center items-center py-2 lg:py-2.5 hidden md:flex">
            <span className="text-[14px] 2xl:text-[18px]">
              Need An Accurate Estimate For Your Sitecore XM Cloud Migration Project? Kickstart Your
              Journey Here!
            </span>
            <Link
              href="/project-cost-estimators"
              aria-label="Get My Estimation"
              className="ml-6 hover:bg-white text-white px-3 rounded-[8px] border border-white font-semibold hover:text-[#3c4cff] text-[14px] h-10 flex items-center"
            >
              Get My Estimation
            </Link>
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="mx-auto w-full flex items-center justify-between container-main px-3.5 py-3.5 lg:py-0! relative">
        <Link href="/" aria-label="Home">
          {logo?.url && (
            <Image
              src={logo.url}
              alt={logo.alternativeText || "Company Logo"}
              className="w-[130px] h-full lg:w-[150px] xl:w-[200px]"
              width={logo.width ?? 200}
              height={logo.height ?? 50}
            />
          )}
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center" ref={dropdownRef}>
          {menu.map((item, i) => {
            const label = getMenuLabel(item);
            const href = getMenuHref(item);
            const hasDrop = hasDropdown(item);
            const isActive = openDropdown === item.id;

            return (
              <div
                key={item.id}
                className="mr-5 lg:mr-7 xl:mr-9 static"
                onMouseEnter={() => {
                  if (hasDrop) {
                    clearCloseDropdownTimer();
                    setOpenDropdown(item.id ?? null);
                  }
                }}
                onMouseLeave={() => {
                  if (hasDrop) scheduleCloseDropdown();
                }}
              >
                <div className="flex flex-col items-center relative h-full">
                  {hasDrop ? (
                    <Link
                      href={href}
                      aria-label={label || "Open dropdown"}
                      data-nav-btn
                      className="flex items-center gap-1 text-[14px] xl:text-[16px] font-medium text-white hover:text-[#3C4CFF] focus:outline-none transition-colors cursor-pointer py-5 lg:py-[40px]"
                    >
                      {label}
                      {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Link>
                  ) : (
                    <Link
                      href={href}
                      aria-label={label || "Open dropdown"}
                      className="flex items-center gap-1 text-[14px] xl:text-[16px] font-medium text-white hover:text-[#3C4CFF] transition-colors py-5 lg:py-[40px]"
                    >
                      {label}
                    </Link>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 w-[45px] h-[4px] bg-white rounded-t" />
                  )}
                </div>

                {hasDrop && isActive && (
                  <div
                    onMouseEnter={() => {
                      clearCloseDropdownTimer();
                      setOpenDropdown(item.id ?? null);
                    }}
                    onMouseLeave={() => {
                      scheduleCloseDropdown();
                    }}
                    className="fixed z-[140] overflow-hidden w-[calc(100vw-40px)] max-w-[1600px] min-h-[336px] left-1/2 -translate-x-1/2"
                    style={{
                      top: `${showBanner && bannerVisible ? "190px" : "115px"}`,
                      background: "#0F0F0F",
                      border: "1px solid #2E2E2E",
                      borderRadius: "20px",
                      boxShadow: "0 8px 34px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    <DropdownContent
                      item={item}
                      additionalText={headerData?.additionalText}
                      isLastItem={menu.length - 1 === i}
                      contactDetails={contactDetails}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href={contactHref}
            target={contactIsExternal ? "_blank" : "_self"}
            aria-label={contactLabel || "Contact"}
            // onClick={handleContactTrigger}
            className="ml-4 bg-[#3C4CFF] px-5 py-3 rounded-[8px] text-white font-semibold hover:bg-[#3440CB] text-[14px] xl:text-[15px] transition-colors flex items-center gap-2"
          >
            {contactIcon && (
              <Image
                src={contactIcon}
                alt=""
                width={18}
                height={18}
                className="w-[18px] h-[18px] object-contain invert brightness-0"
              />
            )}
            {contactLabel}
          </Link>
        </div>

        {/* Mobile buttons */}
        <div className="lg:hidden flex items-center space-x-3">
          <Link
            href={contactHref}
            target={contactIsExternal ? "_blank" : "_self"}
            aria-label={contactLabel || "Contact"}
            // onClick={handleContactTrigger}
            className="bg-[#3C4CFF] px-4 py-1.5 rounded-[6px] text-white font-semibold text-[13px] hover:bg-[#3440CB] flex items-center gap-2"
          >
            {contactIcon && (
              <Image
                src={contactIcon}
                alt=""
                width={14}
                height={14}
                className="w-[14px] h-[14px] object-contain invert brightness-0"
              />
            )}
            {contactLabel}
          </Link>
          <button
            onClick={() => {
              setHeaderHidden(false);
              setBannerVisible(true);
              setMobileMenuOpen(true);
            }}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[140] bg-[#0F0F0F] text-white flex flex-col overflow-hidden">
          {/* Mobile Header: Top Row (Logo & X) */}
          <div className="mx-auto w-full flex items-center justify-between container-main px-3.5 py-3.5 pl-3.5! pr-3.5! lg:px-0 lg:py-0 relative border-b border-[#2E2E2E]">
            <div className="h-full flex items-center">
              <Link href="/" aria-label="Home">
                {logo?.url && (
                  <Image
                    src={logo.url}
                    alt={logo.alternativeText || "Company Logo"}
                    className="w-[130px] h-full lg:w-[150px] xl:w-[200px]"
                    width={logo.width ?? 200}
                    height={logo.height ?? 50}
                  />
                )}
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="w-[70px] h-full flex items-center justify-end border-l border-[#2E2E2E] z-10"
            >
              <X className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Mobile Header: Sub Row (Back & Title) */}
          {activeMobileItem && (
            <div className="flex items-center justify-center pt-6.5 shrink-0 relative bg-[#0F0F0F]">
              <button
                onClick={() => {
                  setActiveMobileItem(null);
                  setExpandedLevel2(null);
                }}
                className="absolute left-4 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <span className="text-[20px] font-semibold font-montserrat tracking-tight truncate px-14">
                {getMenuLabel(activeMobileItem)}
              </span>
            </div>
          )}

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto">
            {!activeMobileItem ? (
              /* Level 1 List */
              <div className="flex flex-col pt-10">
                {menu.map((item) => {
                  const label = getMenuLabel(item);
                  const hasDrop = hasDropdown(item);

                  return (
                    <div key={item.id}>
                      {hasDrop ? (
                        <div className="w-full flex justify-between items-center px-6 py-5 text-[18px] font-medium font-montserrat group">
                          <Link
                            href={getMenuHref(item)}
                            className="flex-1"
                            aria-label={label || "Menu item"}
                          >
                            {label}
                          </Link>
                          <button
                            onClick={() => setActiveMobileItem(item)}
                            aria-label={`Open ${label} submenu`}
                            className="ml-3"
                          >
                            <ChevronRight
                              size={24}
                              className="text-white/50 group-hover:text-white"
                            />
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={getMenuHref(item)}
                          aria-label={label || "Menu item"}
                          className="flex items-center px-6 py-5 text-[18px] font-medium font-montserrat"
                        >
                          {label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Level 2 List (Active Category) */
              <div className="flex flex-col pt-6">
                {activeMobileItem.subLayers?.map((sub, idx) => {
                  const subLabel = sub.link?.label ?? `Item ${idx + 1}`;
                  const hasMore = (sub.subLayers?.length ?? 0) > 0;
                  const isExpanded = expandedLevel2 === sub.id;
                  const iconUrl = sub.link?.Icon?.url;

                  return (
                    <div key={sub.id ?? idx}>
                      {hasMore ? (
                        /* Accordion for Level 2 with Level 3 children */
                        <>
                          <div
                            className={`w-full flex justify-between items-center px-6 py-[26px] text-[18px] font-medium font-montserrat ${isExpanded ? "" : "border-b border-[#2E2E2E]"} `}
                          >
                            <Link
                              href={sub.link?.href ?? "#"}
                              aria-label={subLabel || `Sub-category ${idx + 1}`}
                              className="flex items-center gap-3 flex-1"
                            >
                              {iconUrl && (
                                <Image
                                  src={iconUrl}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="w-[20px] h-[20px] object-contain"
                                />
                              )}
                              {subLabel}
                            </Link>
                            <button
                              onClick={() =>
                                setExpandedLevel2(isExpanded ? null : (sub.id ?? `sub-${idx}`))
                              }
                              aria-label={`Toggle ${subLabel} submenu`}
                              className="ml-3"
                            >
                              <ChevronDown
                                size={22}
                                className={`transition-transform duration-200 text-white/50 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="bg-[#111]">
                              {sub.subLayers?.map((l3, l3i) => (
                                <Link
                                  key={l3.id ?? l3i}
                                  href={l3.link?.href ?? "#"}
                                  className="block px-10 py-4 text-[16px] font-medium text-white hover:text-white font-montserrat"
                                  aria-label={l3.link?.label ?? `Sub-category ${l3i + 1}`}
                                >
                                  {l3.link?.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        /* Direct Link for Level 2 */
                        <Link
                          href={sub.link?.href ?? "#"}
                          aria-label={subLabel || `Sub-category ${idx + 1}`}
                          className="flex items-center gap-3 px-6 py-5 text-[18px] font-medium font-montserrat"
                        >
                          {iconUrl && (
                            <Image
                              src={iconUrl}
                              alt=""
                              width={20}
                              height={20}
                              className="w-[20px] h-[20px] object-contain"
                            />
                          )}
                          {subLabel}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact Details Cards - Only shown on the last category (Company) */}
            {activeMobileItem &&
              menu[menu.length - 1]?.id === activeMobileItem.id &&
              contactDetails.length > 0 && (
                <div className="px-5 pb-10 flex flex-col gap-3 mt-6">
                  {contactDetails.map((details, i) => {
                    const rawHref = details.href?.trim();
                    if (!rawHref || rawHref === "#") {
                      return null;
                    }

                    return (
                      <Link
                        key={details.id ?? i}
                        href={formatContactHref(rawHref)}
                        aria-label={`${details.label || "Contact"} ${details.SubDisc || ""}`.trim()}
                        target={details.isExternal ? "_blank" : "_self"}
                        className="flex items-center justify-between py-2.75 px-4 rounded-[8px] border border-[#2E2E2E] bg-transparent transition-colors group/contact"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-white whitespace-nowrap">
                            {details.label}
                          </span>
                          <span className="text-[16px] font-medium text-white">
                            {details.SubDisc}
                          </span>
                        </div>
                        {details.Icon?.url && (
                          <div className="text-white transition-colors ml-2 shrink-0">
                            <Image
                              src={details.Icon.url}
                              alt=""
                              width={details?.Icon?.width || 18}
                              height={details?.Icon?.height || 18}
                              className="object-contain invert brightness-0"
                            />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Footer Button Wrapper */}
          <div className="py-7.5 px-6 bg-[#0F0F0F] sticky bottom-0">
            <Link
              href={contactHref}
              target={contactIsExternal ? "_blank" : "_self"}
              aria-label={`${contactLabel || "Contact"}`}
              //   onClick={handleContactTrigger}
              className="w-full bg-[#3C4CFF] py-3.5 rounded-[12px] text-white font-semibold text-[16px] flex items-center justify-center gap-2 font-montserrat shadow-lg hover:bg-[#3440CB] transition-colors"
            >
              {contactIcon && (
                <Image
                  src={contactIcon}
                  alt=""
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] invert brightness-0"
                />
              )}
              {contactLabel}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
