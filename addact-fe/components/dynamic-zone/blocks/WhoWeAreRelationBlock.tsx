import React from "react";
import WhoWeAre from "@/components/organisms/WhoWeAre";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";
import { normalizeWhoAreWe } from "@/lib/normalizers";

export interface WhoWeAreRelationBlockProps {
  whoAreWe?: any;
  className?: string;
  [key: string]: any;
}

export const WhoWeAreRelationBlock: React.FC<WhoWeAreRelationBlockProps> = (props) => {
  const normalizedData = normalizeWhoAreWe(props.whoAreWe || props);

  if (!normalizedData) return null;

  return (
    <GenericErrorBoundary componentName="WhoWeAreRelationBlock">
      <WhoWeAre data={normalizedData} className={props.className} />
    </GenericErrorBoundary>
  );
};

export default WhoWeAreRelationBlock;
