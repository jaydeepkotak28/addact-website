import React from "react";
import type { PromoBlockData } from "@/lib/schemas/dynamicZoneSchema";
import AboutUsContent from "@/components/organisms/AboutUsContent";
import OurVisionMission from "@/components/organisms/OurVisionMission";
import WeAreAddact from "@/components/organisms/WeAreAddact";

export interface PromoBlockProps extends PromoBlockData {
  className?: string;
}

/**
 * PromoBlock (Dynamic Zone Component Adapter)
 * Connects Strapi Promo data to Atomic/Organism components strictly driven by 'variant'.
 */
export const PromoBlock: React.FC<PromoBlockProps> = ({
  variant = "about_us_content",
  anchorId,
  title,
  subTitle,
  description,
  image,
  className = "",
}) => {
  const normalizedKey = (variant || "about_us_content")
    .toLowerCase()
    .replace(/-/g, "_");

  switch (normalizedKey) {
    // Variant 1: We Are Addact (Image Left / Text Right)
    case "we_are_addact":
    case "image_left":
      return (
        <WeAreAddact
          subtitle={subTitle}
          title={title}
          content={description}
          image={image}
          anchorId={anchorId || "who-we-are"}
          className={className}
        />
      );

    // Variant 2: Our Vision Mission (Alternating Row Card Layout)
    case "our_vision_mission":
    case "image_right":
      return (
        <OurVisionMission
          items={[
            {
              subTitle,
              title,
              description,
              image,
              variant: "image-right",
            },
          ]}
          anchorId={anchorId || "vision-mission"}
          className={className}
        />
      );

    // Variant 3: About Us Content / Stacked Image Bottom (Centered Content with Image below)
    case "about_us_content":
    case "stacked_image_bottom":
    default:
      return (
        <AboutUsContent
          subtitle={subTitle}
          title={title}
          content={description}
          image={image}
          anchorId={anchorId || "overview"}
          className={className}
        />
      );
  }
};

export default PromoBlock;
