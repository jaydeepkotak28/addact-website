import React from "react";
import BuildingAIEcosystem from "@/components/organisms/BuildingAIEcosystem";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";
import type { AiEcosystemsRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface AiEcosystemsRelationBlockProps extends Partial<AiEcosystemsRelationBlockData> {
  className?: string;
  id?: string;
}

export const AiEcosystemsRelationBlock: React.FC<AiEcosystemsRelationBlockProps> = (props) => {
  const aiEcoSystem = props.aiEcoSystem;

  if (!aiEcoSystem) {
    return null;
  }

  return (
    <GenericErrorBoundary componentName="AiEcosystemsRelationBlock">
      <BuildingAIEcosystem data={{ aiEcoSystem }} />
    </GenericErrorBoundary>
  );
};

export default AiEcosystemsRelationBlock;
