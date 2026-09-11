import React from "react";
import StrapiImage from "../atoms/StrapiImage";
import RichText from "../atoms/RichText";
import DynamicTitle from "../atoms/DynamicTitle";
import type { BasePromoProps } from "@/lib/schemas/dynamicZoneSchema";

export interface VisionMissionItem extends BasePromoProps {
  id?: string | number;
  variant?: string | null;
}

export interface OurVisionMissionProps {
  items?: VisionMissionItem[];
  anchorId?: string | null;
  className?: string;
}

export const OurVisionMission: React.FC<OurVisionMissionProps> = ({
  items = [],
  anchorId = "vision-mission",
  className = "",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section id={anchorId || "vision-mission"} className={`my-[60px] sm:my-[60px] ${className}`}>
      <div className="container-main">
        <div className="bg-white px-[20px] lg:px-[100px] py-[15px] lg:py-[60px] rounded-2xl flex flex-col gap-[60px]">
          {items.map((item: any, index: number) => {
            const isEven = index % 2 === 0;
            const itemImage = item.image || item.Image;
            const itemTitle = item.title || item.Title;
            const itemSubTitle = item.subTitle || item.SubTitle;
            const itemDescription = item.description || item.Description;
            const itemAlt =
              itemImage?.alternativeText ||
              itemTitle ||
              "Vision Mission";

            return (
              <div
                key={item.id || index}
                className={`flex flex-col md:flex-row ${
                  !isEven ? "md:flex-row-reverse" : ""
                } justify-between items-center`}
              >
                {/* Content side */}
                <div
                  className={`w-full md:w-[50%] text-left ${
                    isEven ? "md:pr-[60px]" : "md:pl-[60px]"
                  }`}
                >
                  {itemSubTitle && (
                    <p className="text-[#3C4CFF] text-[17px] mb-[15px] leading-[26px]">
                      {itemSubTitle}
                    </p>
                  )}
                  {itemTitle && (
                    <DynamicTitle
                      title={itemTitle}
                      defaultTag="h3"
                      className="text-[#000] font-[400] 2xl:mb-[40px] mb-[20px]"
                    />
                  )}
                  {itemDescription && (
                    <RichText
                      html={
                        typeof itemDescription === "string"
                          ? itemDescription
                          : undefined
                      }
                    />
                  )}
                </div>

                {/* Image side */}
                {itemImage && (
                  <div className="w-full md:w-[50%]">
                    <StrapiImage
                      src={itemImage}
                      alt={itemAlt}
                      width={600}
                      height={400}
                      preload={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-xl object-cover w-full max-w-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurVisionMission;
