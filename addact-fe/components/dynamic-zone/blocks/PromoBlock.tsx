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
 * Connects Strapi Promo data to Atomic/Organism components.
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

  // Route to WeAreAddact if variant is we_are_addact / image_left or title is Our Team
  const isTeam =
    normalizedKey === "we_are_addact" ||
    normalizedKey === "image_left" ||
    title?.toLowerCase().includes("team") ||
    title?.toLowerCase().includes("who we are") ||
    title?.toLowerCase().includes("we are addact");

  if (isTeam) {
    return (
      <WeAreAddact
        subtitle={subTitle}
        title={title}
        content={description}
        image={image}
        anchorId={anchorId}
        className={className}
      />
    );
  }

  switch (normalizedKey) {
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
          anchorId={anchorId}
          className={className}
        />
      );

    case "about_us_content":
    case "stacked_image_bottom":
    default:
      return (
        <AboutUsContent
          subtitle={subTitle}
          title={title}
          content={description}
          image={image}
          anchorId={anchorId}
          className={className}
        />
      );
  }
};

export default PromoBlock;
