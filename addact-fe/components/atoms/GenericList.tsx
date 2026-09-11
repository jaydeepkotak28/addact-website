import React from "react";
import type { GenericListProps } from "@/types";
import { safeArray } from "@/lib/generic";

/**
 * GenericList - Type-safe, reusable list component
 * 
 * Safely renders any collection of items with:
 * - Null-safe mapping
 * - Automatic key discovery (id / documentId / index)
 * - Empty state fallback
 */
export function GenericList<T extends Record<string, any>>({
  items,
  className = "",
  itemClassName,
  renderItem,
  emptyFallback = null,
}: GenericListProps<T>) {
  const safeItems = safeArray(items);

  if (safeItems.length === 0) {
    return emptyFallback ? <>{emptyFallback}</> : null;
  }

  return (
    <div className={className}>
      {safeItems.map((item, index) => {
        const key = item?.id ?? item?.documentId ?? item?.key ?? index;
        const rendered = renderItem(item, index);
        if (itemClassName) {
          return (
            <div key={key} className={itemClassName}>
              {rendered}
            </div>
          );
        }
        return <React.Fragment key={key}>{rendered}</React.Fragment>;
      })}
    </div>
  );
}

export default GenericList;
