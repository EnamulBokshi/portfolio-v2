"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ShellLayout } from "./ShellLayout";
import type { BeltItemData } from "../belts/beltContent";

interface RootShellWrapperProps {
  children: ReactNode;
  cvUrl?: string | null;
  leftBeltItems?: BeltItemData[];
  rightBeltItems?: BeltItemData[];
}

export function RootShellWrapper({
  children,
  cvUrl,
  leftBeltItems,
  rightBeltItems,
}: RootShellWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <ShellLayout
      cvUrl={cvUrl}
      leftBeltItems={leftBeltItems}
      rightBeltItems={rightBeltItems}
    >
      {children}
    </ShellLayout>
  );
}
