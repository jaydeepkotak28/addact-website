import React from "react";
import WhyWorkWithUs from "@/components/organisms/WhyWorkWithUs";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";

export interface WhyAddactRelationBlockProps {
  whyAddact?: any;
  className?: string;
  [key: string]: any;
}

export const WhyAddactRelationBlock: React.FC<WhyAddactRelationBlockProps> = (props) => {
  const data = props.whyAddact;

  // Only render if whyAddact is selected in BE and has content
  if (!data || (!data.content && !data.GlobalCard)) return null;

  return (
    <GenericErrorBoundary componentName="WhyAddactRelationBlock">
      <WhyWorkWithUs data={data} className={props.className} />
    </GenericErrorBoundary>
  );
};

export default WhyAddactRelationBlock;
