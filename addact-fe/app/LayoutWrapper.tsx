// 👇 define client wrapper first
"use client";

import type { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

function LayoutWrapper({ children }: LayoutWrapperProps) {
  return <>{children}</>;
}

export default LayoutWrapper;
