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

  // Case 1: Single Promo (e.g. "Our Story" or "Our Team") -> Direct PromoBlock
  if (items.length === 1) {
    const promoData = items[0]?.promo;
    if (!promoData) return null;
    return <PromoBlock {...promoData} className={className} />;
  }

  // Case 2: Multiple Promos (e.g. "Our Vision" + "Our Mission")
  // Uses OurVisionMission organism with white card wrapper & alternating layout
  const visionMissionItems = items
    .map((item) => item?.promo)
    .filter(Boolean) as any[];

  return (
    <OurVisionMission
      items={visionMissionItems}
      className={className}
    />
  );
};

export default PromoRelationBlock;
