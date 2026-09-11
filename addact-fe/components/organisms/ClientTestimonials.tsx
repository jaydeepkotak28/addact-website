"use client";

import { useEffect, useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import {
  getClientTestimonialsData,
  type TestimonialItem,
  type ClientTestimonialsData,
} from "@/graphql/queries/getClientTestimonialsData";
import {
  GenericSection,
  GenericMedia,
  DynamicTitle,
  TestimonialWatermarkIcon,
} from "@/components/atoms";
import type { ClientTestimonialData } from "@/lib/schemas/dynamicZoneSchema";
import { normalizeTestimonial } from "@/lib/normalizers";
import type { BaseTestimonial } from "@/types/common";

export type TestimonialData = {
  documentId?: string | null;
  Title?: string | null;
  title?: string | null;
  Item?: TestimonialItem[] | any[] | null;
  items?: any[] | null;
  bgText?: string | null;
  rating?: string | null;
  ratingImage?: any;
};

export interface ClientTestimonialsProps {
  data?:
    | TestimonialData
    | ClientTestimonialsData
    | ClientTestimonialData
    | BaseTestimonial
    | null;
  className?: string;
}

export default function ClientTestimonials({
  data: propData,
  className = "",
}: ClientTestimonialsProps = {}) {
  const [rawData, setRawData] = useState<any>(propData ?? null);

  useEffect(() => {
    if (propData) {
      setRawData(propData);
      return;
    }
    async function fetchData() {
      const response = await getClientTestimonialsData();
      if (response) {
        setRawData(response);
      }
    }
    fetchData();
  }, [propData]);

  const normalized = useMemo(() => {
    if (!rawData) return null;
    return normalizeTestimonial(rawData);
  }, [rawData]);

  if (!normalized || normalized.items.length === 0) return null;

  const duplicatedItems = [
    ...normalized.items,
    ...normalized.items,
    ...normalized.items,
  ];

  const titleContent =
    typeof normalized.title === "object" && normalized.title !== null
      ? normalized.title.title
      : normalized.title || "Client Testimonials";

  return (
    <GenericSection
      variant="gray"
      container="none"
      className={`relative bg-[#F5F5F5] overflow-hidden flex items-center pt-16 lg:py-0 ${className}`.trim()}
    >
      <div className="container-main mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5 relative z-10 text-center lg:text-left">
            <DynamicTitle
              title={titleContent}
              defaultTag="h2"
              className="text-[#0F0F0F] text-[32px] md:text-[44px] lg:text-[60px] font-semibold! leading-[1.3] mb-10 lg:mb-16 font-montserrat"
            />

            {/* Clutch Badge */}
            <div className="bg-white border border-[rgba(15,15,15,0.1)] rounded-full px-4 md:px-6 lg:px-8 py-3 md:py-5 lg:py-6 inline-flex items-center justify-center lg:justify-start gap-4 md:gap-6 shadow-sm max-w-full xl:max-w-[517px] mx-auto lg:mx-0">
              {normalized.ratingImage && (
                <div className="w-auto max-w-[120px] h-[20px] md:h-[32px] lg:h-[45px] flex items-center">
                  <GenericMedia
                    media={normalized.ratingImage}
                    alt={normalized.ratingImage.alternativeText || "clutch rating"}
                    width={normalized.ratingImage.width || 220}
                    height={normalized.ratingImage.height || 62}
                    className="w-auto max-w-[120px] h-[20px] md:h-[32px] lg:h-[45px] object-contain"
                  />
                </div>
              )}

              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-[#0F0F0F] text-[28px] md:text-[40px] lg:text-[60px] font-semibold leading-none">
                  {normalized.rating}
                </span>

                <FaStar className="text-[#FF3D57] text-[18px] md:text-[24px] lg:text-[36px]" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-7 relative z-10">
            <div className="block lg:hidden absolute top-0 left-0 right-0 h-[120px] md:h-[150px] bg-gradient-to-b from-[#FAFAFA] via-[rgba(250,250,250,0.8)] to-transparent z-10 pointer-events-none" />
            <div className="h-[500px] md:h-[600px] lg:h-[684px] overflow-hidden relative group">
              <div className="marquee-vertical space-y-6 flex flex-col items-end">
                {duplicatedItems.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white border border-[rgba(15,15,15,0.1)] rounded-[10px] p-6 md:p-8 lg:p-10 relative flex flex-col justify-end w-full max-w-[786px] min-h-[260px] md:min-h-[320px] lg:min-h-[364px]"
                  >
                    {/* Quote */}
                    <p className="text-[#0F0F0F] text-[18px]! md:text-[25px]! lg:text-[30px]! font-medium leading-[30px] md:leading-[36px] lg:leading-[48px]">
                      {testimonial.quote}
                    </p>

                    {/* Author + Rating */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
                      <div className="text-[#0F0F0F] text-[16px] md:text-[18px] lg:text-[20px] font-medium">
                        {testimonial.authorPosition && <p>{testimonial.authorPosition}</p>}
                        {testimonial.authorName && <p>{testimonial.authorName}</p>}
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({
                          length: testimonial.ratingNumber || 5,
                        }).map((_, i) => (
                          <FaStar
                            key={i}
                            className="text-[#FFA800]"
                            style={{ width: "24px", height: "24px" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Gradient */}
      <div className="hidden lg:block absolute top-0 left-0 right-0 h-[120px] md:h-[150px] bg-gradient-to-b from-[#FAFAFA] via-[rgba(250,250,250,0.8)] to-transparent z-10 pointer-events-none" />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] md:h-[70px] bg-gradient-to-t from-[#FAFAFA] via-[rgba(250,250,250,0.8)] to-transparent z-10 pointer-events-none" />

      {/* Watermark */}
      <div className="absolute bottom-0 pointer-events-none w-full z-0 opacity-40 md:opacity-60">
        <TestimonialWatermarkIcon />
      </div>

      <style>{`
        @keyframes marquee-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }

        .marquee-vertical {
          animation: marquee-vertical 40s linear infinite;
        }

        .group:hover .marquee-vertical {
          animation-play-state: paused;
        }
      `}</style>
    </GenericSection>
  );
}
