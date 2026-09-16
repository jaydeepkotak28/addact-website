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
  const data = props.whoAreWe;

  // Only render if whoAreWe relation is selected in BE
  if (!data) return null;

  const normalizedData = normalizeWhoAreWe(data);

  if (!normalizedData || !normalizedData.Counter || normalizedData.Counter.length === 0) return null;

  return (
    <GenericErrorBoundary componentName="WhoWeAreRelationBlock">
      <WhoWeAre data={normalizedData} className={props.className} />
    </GenericErrorBoundary>
  );
};

export default WhoWeAreRelationBlock;
