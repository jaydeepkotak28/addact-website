import React from "react";
import SectionSubtitle from "../atoms/SectionSubtitle";
import RichText from "../atoms/RichText";

export interface SectionHeaderProps {
  subtitle?: string | null;
  title?: string | null;
  description?: string | null;
  headingTag?: "h1" | "h2" | "h3";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  subtitle,
  title,
  description,
  headingTag: Tag = "h3",
  className = "",
}) => {
  return (
    <div className={`section-header ${className}`}>
      {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      {title && (
        <Tag className="text-[#000] font-[400] 2xl:mb-[40px] mb-[30px] text-2xl md:text-3xl">
          {title}
        </Tag>
      )}
      {description && <RichText html={description} />}
    </div>
  );
};

export default SectionHeader;
