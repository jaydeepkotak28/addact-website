import React from "react";
import PromoBlock from "./PromoBlock";
import OurVisionMission from "@/components/organisms/OurVisionMission";
import type { PromoRelationBlockData, PromoItemData } from "@/lib/schemas/dynamicZoneSchema";

export interface PromoRelationBlockProps extends PromoRelationBlockData {
  className?: string;
}

export const PromoRelationBlock: React.FC<PromoRelationBlockProps> = ({
  promo,
  promos,
  className = "",
}) => {
  // Normalize items to an array (handles multiple 'promos' array and single 'promo')
  const items: PromoItemData[] = Array.isArray(promos)
    ? promos
    : promo
    ? [promo]
    : [];

  if (items.length === 0) return null;

  // Group consecutive 'our_vision_mission' items together into a single card
  type SectionGroup =
    | { type: "vision_mission"; items: any[]; anchorId?: string }
    | { type: "single"; item: any };

  const groupedSections: SectionGroup[] = [];

  for (let i = 0; i < items.length; i++) {
    const promoData = items[i]?.promo;
    if (!promoData) continue;

    const v = (promoData.variant || "").toLowerCase().replace(/-/g, "_");
    const isVisionMission = v === "our_vision_mission" || v === "image_right";

    if (isVisionMission) {
      const lastGroup = groupedSections[groupedSections.length - 1];
      if (lastGroup && lastGroup.type === "vision_mission") {
        lastGroup.items.push(promoData);
      } else {
        groupedSections.push({
          type: "vision_mission",
          items: [promoData],
          anchorId: promoData.anchorId || "vision-mission",
        });
      }
    } else {
      groupedSections.push({
        type: "single",
        item: promoData,
      });
    }
  }

  return (
    <>
      {groupedSections.map((group, idx) => {
        if (group.type === "vision_mission") {
          return (
            <OurVisionMission
              key={`vm-group-${idx}`}
              items={group.items}
              anchorId={group.anchorId}
              className={className}
            />
          );
        }

        return (
          <PromoBlock
            key={`promo-single-${idx}`}
            {...group.item}
            className={className}
          />
        );
      })}
    </>
  );
};

export default PromoRelationBlock;
