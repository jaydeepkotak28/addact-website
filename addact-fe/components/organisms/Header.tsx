"use client";

import React, { useState } from "react";
import Link from "next/link";
import StrapiImage from "../atoms/StrapiImage";
import type { StrapiMedia } from "@/lib/schemas/dynamicZoneSchema";

export interface HeaderProps {
  headerLogo?: StrapiMedia | null;
}

export const Header: React.FC<HeaderProps> = ({ headerLogo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "#services" },
    { label: "Career", href: "#career" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-dark,#0F0F0F)]/95 backdrop-blur-md border-b border-white/10 transition-colors duration-200">
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {headerLogo?.url ? (
              <StrapiImage
                src={headerLogo}
                alt={headerLogo.alternativeText || "Addact Technologies"}
                width={headerLogo.width || 140}
                height={headerLogo.height || 40}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            ) : (
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-wider text-white font-montserrat">
                  ADDACT
                </span>
                <span className="text-3xl leading-none text-[var(--brand-blue,#3C4CFF)] font-bold">
                  .
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:text-[var(--brand-blue,#3C4CFF)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/#contact"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--brand-blue,#3C4CFF)] hover:opacity-90 shadow-md shadow-[var(--brand-blue,#3C4CFF)]/20 transition-all hover:scale-[1.02]"
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--brand-blue,#3C4CFF)] hover:opacity-90 transition-all"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
