import React from "react";
import Image from "next/image";

export interface LoaderProps {
  className?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ className = "", size = 80 }) => {
  return (
    <div className={`flex items-center justify-center w-full ${className}`.trim()}>
      <Image
        src="/loader.gif"
        alt="Loading..."
        width={size}
        height={size}
        unoptimized
      />
    </div>
  );
};

export default Loader;
