import React from "react";

export interface SectionSubtitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const SectionSubtitle: React.FC<SectionSubtitleProps> = ({
  children,
  className = "",
}) => {
  if (!children) return null;

  return (
    <p className={`text-[var(--brand-blue,#3C4CFF)] text-[17px] mb-[15px] leading-[26px] font-medium ${className}`}>
      {children}
    </p>
  );
};

export default SectionSubtitle;
