import React from "react";
import StrapiImage from "../atoms/StrapiImage";
import RichText from "../atoms/RichText";
import DynamicTitle from "../atoms/DynamicTitle";
import type { BasePromoProps } from "@/lib/schemas/dynamicZoneSchema";

export interface AboutUsContentProps extends BasePromoProps {}

export const AboutUsContent: React.FC<AboutUsContentProps> = ({
  subtitle,
  title,
  content,
  image,
  anchorId = "overview",
  className = "",
  ...rest
}) => {
  const currentImage = image || (rest as any)?.Image;

  return (
    <section className={`my-[60px] sm:my-[60px] ${className}`} id={anchorId || "overview"}>
      <div className="container-main">
        {subtitle && (
          <p className="text-[#3C4CFF] text-[17px] mb-[15px] leading-[26px]">
            {subtitle}
          </p>
        )}
        {title && (
          <DynamicTitle
            title={title}
            defaultTag="h3"
            className="text-[#000] font-[400] 2xl:mb-[40px] mb-[30px]"
          />
        )}
        {content && <RichText html={content} />}
        {currentImage && (
          <StrapiImage
            src={currentImage}
            alt={currentImage?.alternativeText || title || "About Us Image"}
            width={800}
            height={500}
            className="w-full h-auto max-h-[500px] rounded-xl object-cover lg:mt-[50px] mt-[30px]"
          />
        )}
      </div>
    </section>
  );
};

export default AboutUsContent;
