import React from "react";
import { componentRegistry } from "./componentRegistry";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";
import type { DynamicZone, DynamicZoneBlock } from "@/lib/schemas/dynamicZoneSchema";

interface DynamicZoneRendererProps {
  sections?: DynamicZone<any> | DynamicZoneBlock[] | any[] | null;
  className?: string;
}

/**
 * Smart Component Resolver
 * Resolves a component from registry using exact match, or normalized kebab-case / PascalCase.
 */
function resolveComponent(typeName: string): React.ComponentType<any> | null {
  if (!typeName) return null;

  // 1. Exact match
  if (componentRegistry[typeName]) {
    return componentRegistry[typeName];
  }

  // 2. Normalize PascalCase "ComponentCategoryComponent" to "category.component"
  if (typeName.startsWith("Component")) {
    const raw = typeName.replace(/^Component/, "");
    // Try finding a key that matches case-insensitively without dots/hyphens
    const cleanRaw = raw.toLowerCase();
    for (const [key, comp] of Object.entries(componentRegistry)) {
      const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if (cleanKey === cleanRaw || `component${cleanKey}` === cleanRaw) {
        return comp;
      }
    }
  }

  // 3. Normalize "category.component-name" to PascalCase
  const cleanKebab = typeName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  for (const [key, comp] of Object.entries(componentRegistry)) {
    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (cleanKey === cleanKebab) {
      return comp;
    }
  }

  return null;
}

/**
 * DynamicZoneRenderer (Component Factory)
 * 
 * Renders components dynamically based on the exact order returned by Strapi.
 * Every block is protected by a GenericErrorBoundary to prevent partial crashes.
 */
export const DynamicZoneRenderer: React.FC<DynamicZoneRendererProps> = ({
  sections,
  className = "",
}) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className={`dynamic-zone-container ${className}`}>
      {sections.map((block, index) => {
        const typeName =
          block.__typename || (block as any).__component || "";

        const Component = resolveComponent(typeName);

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

        return (
          <GenericErrorBoundary
            key={block.id || block.documentId || index}
            componentName={typeName}
          >
            <Component {...block} />
          </GenericErrorBoundary>
        );
      })}
    </div>
  );
};

export default DynamicZoneRenderer;
