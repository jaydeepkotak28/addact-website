import React from "react";
import parse from "html-react-parser";
import type { ContentBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface ContentBlockProps extends ContentBlockData {
  className?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  body,
  className = "",
}) => {
  if (!body) return null;

  return (
    <div
      className={`content-block text-[17px] leading-[32px] font-normal text-gray-800 space-y-4 ${className}`}
    >
      {parse(body)}
    </div>
  );
};

export default ContentBlock;
