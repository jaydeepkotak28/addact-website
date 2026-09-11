import React from "react";

interface StructuredDataScriptProps {
  data?: unknown;
  additionalData?: unknown[];
}

export default function StructuredDataScript({
  data,
  additionalData = [],
}: StructuredDataScriptProps) {
  if (!data && additionalData.length === 0) return null;

  let structuredDataArray: unknown[] = [];

  if (data) {
    structuredDataArray = Array.isArray(data)
      ? data
      : typeof data === "object" && data !== null
        ? [data]
        : typeof data === "string"
          ? (() => {
              try {
                const p = JSON.parse(data);
                return Array.isArray(p) ? p : [p];
              } catch {
                return [];
              }
            })()
          : [];
  }

  const cleanArray = structuredDataArray
    .flatMap((item) => {
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [];
        }
      }
      return [item];
    })
    .filter(Boolean);

  const mergedArray = [...cleanArray, ...additionalData];

  if (mergedArray.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(mergedArray),
      }}
    />
  );
}
