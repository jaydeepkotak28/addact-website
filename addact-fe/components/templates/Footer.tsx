"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Footer as FooterData } from "@/graphql/queries/footer";

type ImageType = {
  url?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  name?: string;
};

type FooterLink = {
  id?: string;
  href?: string;
  label?: string;
  target?: string;
  isExternal?: boolean;
};

type FooterColumn = {
  NavLink?: ({ Title?: string } | FooterLink)[];
};

type IconLink = {
  id?: string;
  href?: string;
  label?: string;
  target?: string;
  isExternal?: boolean;
  Icon?: ImageType;
};

type AddressInformationItem = {
  __typename?: string;
  Title?: string;
  Description?: string;
  urlKeyword?: string;
  Link?: {
    href?: string;
    isExternal?: boolean;
    label?: string;
    SubDisc?: string | null;
    target?: string;
    Icon?: ImageType | null;
  } | null;
};

type FooterProps = {
  data?:
    | (FooterData & {
        contacticons?: {
          Icon?: ImageType;
        }[];
      })
    | null;
};

type FooterViewModel = {
  Logo?: { Image?: ImageType | null } | null;
  AddressInformation?: AddressInformationItem[];
  footerlinks?: FooterColumn[];
  milestonestitle?: {
    CommonTitle?: {
      Title?: string;
      Description?: string;
    }[];
  } | null;
  milestonesimage?: {
    Image?: ImageType | null;
  }[];
  socialMedia?: IconLink[];
  CopyrightText?: string;
  SiteSlog?: string;
};

export default function Footer({ data }: FooterProps) {
  const pathname = usePathname();

  const topContactItems = useMemo(() => {
    const AddressInformation = (data as FooterViewModel)?.AddressInformation;
    if (!AddressInformation || AddressInformation.length === 0) return [];

    const matchedItems = AddressInformation.filter((item) => {
      const keyword = item.urlKeyword;
      return keyword && keyword !== "default" && pathname?.includes(keyword);
    });

    if (matchedItems.length > 0) {
      return matchedItems.slice(0, 2);
    }

    return AddressInformation.filter(
      (item) => item.urlKeyword === "default" || !item.urlKeyword
    ).slice(0, 2);
  }, [data, pathname]);

  if (!data) return null;

  const footer = data as FooterViewModel;

  const {
    Logo,
    footerlinks,
    milestonestitle,
    milestonesimage,
    // AddressInformationMobileBgImg,
    socialMedia,
    CopyrightText,
  } = footer;

  const linkColumns = footerlinks?.slice(0, 4) || [];
  const policyColumn = footerlinks?.[4]?.NavLink || [];
  const policyLinks = (policyColumn as FooterLink[]).filter((item) => item?.label && item?.href);
  const fallbackPolicyLinks: FooterLink[] = [
    { label: "Sitemap", href: "/sitemap" },
    { label: "T & C", href: "/terms-of-use" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];
  const finalPolicyLinks = policyLinks?.length ? policyLinks : fallbackPolicyLinks;

  return (
    <>
      <footer className="relative overflow-hidden bg-[#0F0F0F] text-white lg:pt-16 pt-10 border-t border-b border-white/15 z-10">
        <div className="container-main">
          <div className="pl-0 relative z-20">
            {/* Top Row: Logo + Contact Info (Left) and Milestones (Right) */}
            <div className="grid grid-cols-12 gap-y-6 lg:gap-x-8 mb-10 lg:mb-16">
              {/* Left: Logo + Contact Info */}
              <div className="col-span-12 lg:col-span-6">
                {Logo?.Image?.url && (
                  <Link
                    href="/"
                    className="cursor-pointer inline-block mb-6 lg:mb-8"
                    aria-label="Home"
                  >
                    <Image
                      src={Logo.Image.url}
                      alt={Logo.Image.alternativeText || ""}
                      width={380}
                      height={47}
                      className="w-36 h-auto sm:w-44 lg:w-56 xl:w-80 2xl:w-96"
                    />
                  </Link>
                )}

                <div className="flex items-center gap-x-18 gap-y-5 xl:gap-y-0 flex-wrap">
                  {topContactItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5">
                      {item?.Link?.Icon?.url && (
                        <div className="relative w-10 h-10 shrink-0">
                          <Image
                            src={item.Link.Icon.url}
                            alt={item.Link.Icon.alternativeText || item?.Title || "contact icon"}
                            width={item.Link.Icon.width || 40}
                            height={item.Link.Icon.height || 40}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      <div className="text-[20px] leading-normal text-white footer-richtext flex gap-2 items-center">
                        {item?.Title && <span className="font-semibold">{item.Title}</span>}

                        {item?.Description && (
                          <span
                            className="font-normal [&_a]:mt-0! [&_a]:text-[20px]!"
                            dangerouslySetInnerHTML={{
                              __html: item.Description,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Certified Success & Milestones */}
              <div className="col-span-12 lg:col-span-6 mt-10 lg:mt-0">
                {(milestonestitle?.CommonTitle?.[0]?.Title ||
                  milestonesimage?.some((i) => i.Image?.url)) && (
                  <>
                    <div className="text-[19px] md:text-[20px] font-medium mb-4 md:mb-6 ">
                      {milestonestitle?.CommonTitle?.[0]?.Title}
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3.5 lg:gap-x-6">
                      {milestonesimage
                        ?.filter((m) => m.Image?.url)
                        .map((item, i) => (
                          <Image
                            key={i}
                            src={item.Image!.url!}
                            alt={item.Image!.alternativeText || "milestone"}
                            width={item.Image!.width || 100}
                            height={item.Image!.height || 100}
                            className="max-w-14 sm:max-w-20 lg:max-w-24 xl:max-w-28 h-auto object-contain"
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 lg:gap-y-0 lg:gap-x-8">
                {linkColumns.map((column, index) => {
                  const links = column.NavLink || [];
                  const titleItem = links[0] as { Title?: string };
                  const linkItems = links.slice(1) as FooterLink[];

                  return (
                    <div key={index}>
                      <p className="text-[20px]! xl:text-[24px]! font-semibold lg:mb-5 mb-2.5">
                        {titleItem?.Title}
                      </p>
                      <ul className="space-y-[18px]">
                        {linkItems.map((link, i) => (
                          <li key={link.id || i}>
                            <Link
                              href={link.href || "/"}
                              target={link?.isExternal ? "_blank" : `_${link.target}` || "_self"}
                              rel={link.isExternal ? "noopener noreferrer" : undefined}
                              className="text-[16px]! xl:text-[20px]! leading-[26px] text-[#AEAEAE] font-medium hover:text-white transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section: Policy Links, Social Icons, Copyright */}
            <div className="mt-11 lg:mt-14 border-t border-white/15 pt-5 lg:pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 items-center">
                {/* Policy Links - Left */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-[14px] lg:text-[18px] font-medium text-white/80">
                  {finalPolicyLinks.map((item, index) => (
                    <div key={item.id || item.label || index} className="flex items-center gap-2.5">
                      {index > 0 && <span className="text-white/50">•</span>}
                      <Link
                        href={item.href || "/"}
                        target={item?.isExternal ? "_blank" : `_${item?.target}` || "_self"}
                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                        className="hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Social Media Icons - Center */}
                <div className="flex items-center justify-center gap-3 lg:gap-4">
                  {socialMedia
                    ?.filter((icon) => icon?.Icon?.url)
                    .map((icon, index) => (
                      <Link
                        key={icon.id || index}
                        href={icon.href || "/"}
                        target={icon?.isExternal ? "_blank" : `_${icon?.target}` || "_self"}
                        rel={icon.isExternal ? "noopener noreferrer" : undefined}
                        aria-label={icon.label || "social media"}
                        className="w-10 h-10 rounded-full bg-transparent border-0 flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Image
                          src={icon.Icon!.url!}
                          alt={icon.Icon!.alternativeText || "social icon"}
                          width={icon.Icon!.width || 40}
                          height={icon.Icon!.height || 40}
                          className="w-10 h-10 object-contain"
                        />
                      </Link>
                    ))}
                </div>

                {/* Copyright - Right */}
                {CopyrightText && (
                  <div className="w-full text-center lg:text-right lg:text-[18px] text-[14px] font-medium text-white/80">
                    {CopyrightText}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="select-none w-full pt-[40px] md:pt-[60px] lg:pt-[80px] overflow-hidden">
            <div className="select-none text-left w-full">
              <div className="text-[#272727] text-center font-bold leading-[0.85] tracking-[-0.03em] whitespace-nowrap text-[35px] sm:text-[80px] md:text-[110px] lg:text-[145px] xl:text-[170px]! 2xl:text-[200px]!">
                We Add Value
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
