import React from "react";
import StrapiImage from "../atoms/StrapiImage";
import RichText from "../atoms/RichText";
import DynamicTitle from "../atoms/DynamicTitle";
import type { BasePromoProps } from "@/lib/schemas/dynamicZoneSchema";

export interface WeAreAddactProps extends BasePromoProps {}

export const WeAreAddact: React.FC<WeAreAddactProps> = ({
  subtitle,
  title,
  content,
  image,
  anchorId = "who-we-are",
  className = "",
  ...rest
}) => {
  const currentImage = image || rest?.Image;

  return (
    <section
      className={`container-main mt-[60px] sm:mt-[60px] pb-[60px] sm:pb-[100px] ${className}`}
      id={anchorId || "who-we-are"}
    >
      <div className="flex flex-col md:flex-row items-center sm:gap-[60px] lg:gap-[120px]">
        {/* Desktop Image (Left) */}
        {currentImage && (
          <div className="w-full md:w-1/2 hidden md:block">
            <StrapiImage
              src={currentImage}
              alt={currentImage?.alternativeText || title || "We Are Addact"}
              width={currentImage?.width || 600}
              height={currentImage?.height || 600}
              className="rounded-2xl w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content Column (Right) */}
        <div className="w-full md:w-1/2">
          {subtitle && (
            <p className="text-[#3C4CFF] text-[17px] leading-[30px] font-medium sm:mb-[15px] mb-[10px] block">
              {subtitle}
            </p>
          )}

          {title && (
            <DynamicTitle
              title={title}
              defaultTag="h2"
              className="!text-[28px] md:!text-[40px] 2xl:!text-[60px] text-black mb-[20px] !font-normal"
            />
          )}

          {/* Mobile Image (in-between title & content) */}
          {currentImage && (
            <div className="block md:hidden mb-[20px]">
              <StrapiImage
                src={currentImage}
                alt={currentImage?.alternativeText || title || "We Are Addact"}
                width={currentImage?.width || 600}
                height={currentImage?.height || 600}
                className="rounded-2xl w-full h-auto object-cover max-h-[250px]"
              />
            </div>
          )}

          {content && (
            <div className="text-base text-black leading-relaxed mb-8">
              <RichText html={content} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeAreAddact;
