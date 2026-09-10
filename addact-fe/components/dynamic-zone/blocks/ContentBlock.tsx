import React from "react";
import RichText from "@/components/atoms/RichText";
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
    <RichText
      html={body}
      className={`content-block text-[17px] leading-[32px] font-normal text-gray-800 ${className}`}
    />
  );
};

export default ContentBlock;
