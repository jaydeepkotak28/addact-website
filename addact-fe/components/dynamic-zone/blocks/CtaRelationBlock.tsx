import React from "react";
import GenericCTA from "@/components/organisms/GenericCTA";
import type { CtaRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface CtaRelationBlockProps extends CtaRelationBlockData {
  className?: string;
}

export const CtaRelationBlock: React.FC<CtaRelationBlockProps> = ({
  cta,
  className = "",
}) => {
  if (!cta) return null;

  return (
    <GenericCTA
      title={cta.title}
      description={cta.description}
      image={cta.image}
      link={cta.link}
      className={className}
    />
  );
};

export default CtaRelationBlock;
