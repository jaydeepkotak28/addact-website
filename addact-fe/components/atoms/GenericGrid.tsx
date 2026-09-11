import React from "react";
import clsx from "clsx";
import type { Nullable } from "@/types/common";

export interface GridColumns {
  base?: 1 | 2 | 3 | 4 | 5 | 6;
  sm?: 1 | 2 | 3 | 4 | 5 | 6;
  md?: 1 | 2 | 3 | 4 | 5 | 6;
  lg?: 1 | 2 | 3 | 4 | 5 | 6;
  xl?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface GenericGridProps<T> {
  items?: Nullable<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: GridColumns | number;
  gap?: 2 | 4 | 6 | 8 | 10 | 12;
  className?: string;
  emptyFallback?: React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
}

const baseColMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const smColMap: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const mdColMap: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const lgColMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const xlColMap: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};

const gapMap: Record<number, string> = {
  2: "gap-2",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

/**
 * GenericGrid - Universal Responsive Grid Layout Atom
 */
export function GenericGrid<T>({
  items,
  renderItem,
  columns = { base: 1, md: 2, lg: 3 },
  gap = 6,
  className = "",
  emptyFallback = null,
  keyExtractor,
}: GenericGridProps<T>): React.ReactElement | null {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return emptyFallback ? <>{emptyFallback}</> : null;
  }

  const colClasses =
    typeof columns === "number"
      ? (baseColMap[columns] || "grid-cols-1")
      : clsx(
          columns.base ? baseColMap[columns.base] : "grid-cols-1",
          columns.sm && smColMap[columns.sm],
          columns.md && mdColMap[columns.md],
          columns.lg && lgColMap[columns.lg],
          columns.xl && xlColMap[columns.xl]
        );

  const gapClass = gapMap[gap] || "gap-6";

  return (
    <div className={clsx("grid w-full", colClasses, gapClass, className)}>
      {items.map((item, index) => {
        const key = keyExtractor
          ? keyExtractor(item, index)
          : (item as any)?.id || (item as any)?.documentId || index;

        return (
          <React.Fragment key={key}>
            {renderItem(item, index)}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default GenericGrid;
