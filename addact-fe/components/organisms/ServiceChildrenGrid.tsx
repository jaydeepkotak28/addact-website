"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceChildItem } from "@/graphql/queries/getServiceBySlug";

export interface ServiceChildrenGridProps {
  childrenServices: ServiceChildItem[];
  currentServiceTitle?: string;
}

export const ServiceChildrenGrid: React.FC<ServiceChildrenGridProps> = ({
  childrenServices,
  currentServiceTitle,
}) => {
  if (!childrenServices || childrenServices.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#0F0F0F] border-t border-b border-[#2E2E2E]">
      <div className="container-main">
        {/* Section Header */}
        <div className="mb-10 md:mb-14">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3C4CFF] bg-[#3C4CFF]/10 rounded-full border border-[#3C4CFF]/20 mb-3">
            Sub-Services & Capabilities
          </span>
          <h2 className="text-2xl md:text-4xl font-bold font-montserrat text-white tracking-tight">
            Explore {currentServiceTitle || "Our Offerings"}
          </h2>
        </div>

        {/* Grid of Sub-Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {childrenServices.map((child, idx) => {
            const title =
              child.pageHeading?.PageHeading?.pageTitle ||
              child.internalName ||
              `Service ${idx + 1}`;
            const slug = child.pageHeading?.PageHeading?.slug || "#";
            const description = child.shortDescription;

            return (
              <Link
                key={child.documentId || idx}
                href={slug}
                className="group relative p-6 md:p-8 rounded-[16px] bg-white/[0.02] border border-white/10 hover:border-[#3C4CFF]/60 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
              >
                {/* Subtle hover accent glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3C4CFF]/10 rounded-full blur-2xl group-hover:bg-[#3C4CFF]/20 transition-all duration-300 pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-lg md:text-xl font-semibold font-montserrat text-white group-hover:text-[#3C4CFF] transition-colors duration-200">
                      {title}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-[#3C4CFF] group-hover:border-[#3C4CFF] transition-all duration-300 shrink-0">
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </div>
                  </div>

                  {description && (
                    <p className="text-sm md:text-base text-neutral-400 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors">
                  <span>Learn more</span>
                  <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceChildrenGrid;
