import React from "react";
import SectionSubtitle from "../atoms/SectionSubtitle";
import StrapiImage from "../atoms/StrapiImage";
import RichText from "../atoms/RichText";

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
  const currentImage = (image || (rest as any)?.Image);

  return (
    <section className={`my-[60px] sm:my-[60px] ${className}`} id={anchorId || undefined}>
      <div className="container-main">
        {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
        {title && (
          <h3 className="text-[#000] font-[400] 2xl:mb-[40px] mb-[30px] text-2xl md:text-3xl">
            {title}
          </h3>
        )}
        <RichText html={content} />
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
