import React from "react";
import Link from "next/link";
import StrapiImage from "../atoms/StrapiImage";
import type { StrapiMedia } from "@/lib/schemas/dynamicZoneSchema";

export interface SocialLinkItem {
  platform?: string;
  url?: string;
}

export interface FooterProps {
  footerLogo?: StrapiMedia | null;
  copyrightText?: string | null;
  supportEmail?: string | null;
  socialLinks?: SocialLinkItem[] | null;
}

// Helper to render platform SVG icon
const renderSocialIcon = (platform: string = "") => {
  const p = platform.toLowerCase();

  if (p.includes("linkedin")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }

  if (p.includes("twitter") || p.includes("x")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  if (p.includes("instagram")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }

  if (p.includes("facebook")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
      </svg>
    );
  }

  if (p.includes("youtube")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  if (p.includes("github")) {
    return (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }

  // Default link icon
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  );
};

export const Footer: React.FC<FooterProps> = ({
  footerLogo,
  copyrightText,
  supportEmail,
  socialLinks,
}) => {
  const defaultCopyright = `© ${new Date().getFullYear()} Addact Technologies. All Rights Reserved.`;

  return (
    <footer className="bg-siteDark text-white pt-16 pb-12 border-t border-white/10">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              {footerLogo?.url ? (
                <StrapiImage
                  src={footerLogo}
                  alt={footerLogo.alternativeText || "Addact Technologies"}
                  width={footerLogo.width || 140}
                  height={footerLogo.height || 40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl font-bold tracking-wider text-white font-montserrat">
                    ADDACT
                  </span>
                  <span className="text-3xl leading-none text-brandBlue font-bold">
                    .
                  </span>
                </div>
              )}
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Empowering enterprise brands worldwide through cutting-edge Sitecore,
              Headless architectures, and next-generation digital experiences.
            </p>

            {supportEmail && (
              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-gray-500 block mb-1">
                  Get In Touch
                </span>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-base font-medium text-white hover:text-brandBlue transition-colors"
                >
                  {supportEmail}
                </a>
              </div>
            )}
          </div>

          {/* Column 1: Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#career"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Policies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Links from Strapi */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Connect With Us
            </h4>
            {socialLinks && socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item, index) => {
                  if (!item.url) return null;
                  return (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-brandBlue hover:border-brandBlue transition-all duration-200"
                      aria-label={item.platform || "Social Link"}
                      title={item.platform}
                    >
                      {renderSocialIcon(item.platform)}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Configure social links in Strapi Admin.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>{copyrightText || defaultCopyright}</p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="hover:text-white transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
