import React from "react";
import OurCapabilities from "@/components/organisms/OurCapabilities";
import type {
  OurCapabilitiesData,
  CapabilityItem,
  CapabilitiesRelationBlockProps,
} from "@/types";

export type { CapabilitiesRelationBlockProps };

export const CapabilitiesRelationBlock: React.FC<CapabilitiesRelationBlockProps> = ({
  title,
  ourCapabilities = [],
  className = "",
}) => {
  if (!ourCapabilities || ourCapabilities.length === 0) {
    return null;
  }

  const heading = title?.title || "Our Capabilities";

  const capabilities: CapabilityItem[] = (ourCapabilities || [])
    .map((item, index) => {
      const cap = item?.capabilities;
      if (!cap) return null;

      return {
        id: item?.documentId || index,
        title: cap.title || item?.internalName || "",
        description: cap.description || "",
        link: cap.link,
        image: cap.image,
        sublinks: cap.subLinks || (cap as any)?.sublinks || [],
      };
    })
    .filter(Boolean) as CapabilityItem[];

  if (capabilities.length === 0) {
    return null;
  }

  const data: OurCapabilitiesData = {
    heading,
    capabilities,
  };

  return <OurCapabilities data={data} className={className} />;
};

export default CapabilitiesRelationBlock;
