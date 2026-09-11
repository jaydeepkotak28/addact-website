import React from "react";
import clsx from "clsx";

export type SectionVariant =
  | "default"
  | "dark"
  | "light"
  | "gray"
  | "gradient"
  | "transparent";

export type ContainerType = "main" | "fluid" | "narrow" | "none";

export type SectionPadding = "default" | "compact" | "spacious" | "none";

export interface GenericSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  children: React.ReactNode;
  variant?: SectionVariant;
  container?: ContainerType;
  padding?: SectionPadding;
  animation?: string;
  animationDelay?: number;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div" | "article" | "aside" | "main";
}

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-transparent text-foreground",
  transparent: "bg-transparent",
  dark: "bg-[#0b0f19] text-white",
  light: "bg-white text-gray-900",
  gray: "bg-gray-50 dark:bg-gray-900/50 text-foreground",
  gradient: "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white",
};

const containerStyles: Record<ContainerType, string> = {
  main: "container-main",
  fluid: "container-fluid px-4 md:px-8",
  narrow: "container-main max-w-4xl mx-auto px-4",
  none: "",
};

const paddingStyles: Record<SectionPadding, string> = {
  default: "py-12 md:py-20",
  compact: "py-6 md:py-10",
  spacious: "py-16 md:py-28",
  none: "py-0",
};

/**
 * GenericSection - Universal Section & Container Layout Atom
 * 
 * Provides consistent container widths, background color variants,
 * responsive paddings, and AOS scroll animations across all organisms.
 */
export const GenericSection: React.FC<GenericSectionProps> = ({
  id,
  children,
  variant = "default",
  container = "main",
  padding = "default",
  animation,
  animationDelay,
  className = "",
  containerClassName = "",
  as: Component = "section",
  ...rest
}) => {
  const sectionClass = clsx(
    "relative w-full overflow-hidden transition-colors",
    variantStyles[variant],
    paddingStyles[padding],
    className
  );

  const innerContainerClass = clsx(
    containerStyles[container],
    containerClassName
  );

  return (
    <Component
      id={id}
      className={sectionClass}
      data-aos={animation}
      data-aos-delay={animationDelay}
      {...rest}
    >
      {container !== "none" ? (
        <div className={innerContainerClass}>{children}</div>
      ) : (
        children
      )}
    </Component>
  );
};

export default GenericSection;
