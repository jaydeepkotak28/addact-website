import React from "react";
import RichText from "@/components/atoms/RichText";
import type { ContentRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface ContentRelationBlockProps extends ContentRelationBlockData {
  className?: string;
}

export const ContentRelationBlock: React.FC<ContentRelationBlockProps> = ({
  content,
  className = "",
}) => {
  const body = content?.Body;
  const description = body?.description;

  if (!description) return null;

  return (
    <RichText
      html={description}
      className={`content-relation-block text-[17px] leading-[32px] font-normal text-gray-800 ${className}`}
    />
  );
};

export default ContentRelationBlock;
