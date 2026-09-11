import React from "react";
import ClientTestimonials from "@/components/organisms/ClientTestimonials";
import { GenericErrorBoundary } from "@/components/atoms/GenericErrorBoundary";
import type { TestimonialRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface TestimonialRelationBlockProps extends Partial<TestimonialRelationBlockData> {
  className?: string;
}

export const TestimonialRelationBlock: React.FC<TestimonialRelationBlockProps> = ({
  clientTestimonial,
}) => {
  return (
    <GenericErrorBoundary componentName="TestimonialRelationBlock">
      <ClientTestimonials data={clientTestimonial} />
    </GenericErrorBoundary>
  );
};

export default TestimonialRelationBlock;
