import React from "react";
import WhyWorkWithUs from "@/components/organisms/WhyWorkWithUs";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";
import { normalizeWhyAddact } from "@/lib/normalizers";

export interface WhyAddactRelationBlockProps {
  whyAddact?: any;
  className?: string;
  [key: string]: any;
}

export const WhyAddactRelationBlock: React.FC<WhyAddactRelationBlockProps> = (props) => {
  const data = props.whyAddact;

  // Only render if whyAddact is selected in BE and has content
  if (!data) return null;

  const normalized = normalizeWhyAddact(data);
  if (!normalized || !normalized.items || normalized.items.length === 0) return null;

  return (
    <GenericErrorBoundary componentName="WhyAddactRelationBlock">
      <WhyWorkWithUs data={normalized} className={props.className} />
    </GenericErrorBoundary>
  );
};

export default WhyAddactRelationBlock;
