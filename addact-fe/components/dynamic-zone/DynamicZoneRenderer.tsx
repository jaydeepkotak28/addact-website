import React from "react";
import { componentRegistry } from "./componentRegistry";
import type { DynamicZoneBlock } from "@/lib/schemas/dynamicZoneSchema";

interface DynamicZoneRendererProps {
  sections?: DynamicZoneBlock[] | null;
  className?: string;
}

/**
 * DynamicZoneRenderer (Component Factory)
 * 
 * Renders components dynamically based on the exact order returned by Strapi.
 * When an editor reorders (moves UP or DOWN) components in Strapi Backend,
 * this factory automatically reflects that new order on the frontend.
 */
export const DynamicZoneRenderer: React.FC<DynamicZoneRendererProps> = ({
  sections,
  className = "",
}) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className={`dynamic-zone-container space-y-8 ${className}`}>
      {sections.map((block, index) => {
        const typeName =
          block.__typename || (block as any).__component || "";

        const Component = componentRegistry[typeName];

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            return (
              <div
                key={block.id || index}
                className="p-4 my-2 border border-dashed border-amber-500 bg-amber-50 rounded text-amber-800 text-sm"
              >
                ⚠️ <strong>Unregistered Component:</strong> <code>{typeName}</code>.
                Please register it in <code>componentRegistry.ts</code>.
              </div>
            );
          }
          return null;
        }

        return <Component key={block.id || index} {...block} />;
      })}
    </div>
  );
};

export default DynamicZoneRenderer;
