import { ReactNode } from "react";
import { MainBody } from "./MainBody";
import { MainDisplay } from "./MainDisplay";
import { SectionIndicator } from "./SectionIndicator";
import { SkillBelt } from "../belts/SkillBelt";
import { DEFAULT_LEFT_BELT, DEFAULT_RIGHT_BELT, BeltItemData } from "../belts/beltContent";
import { DockNav } from "../nav/DockNav";
import { MobileTabBar } from "../nav/MobileTabBar";

interface ShellLayoutProps {
  children: ReactNode;
  cvUrl?: string | null;
  leftBeltItems?: BeltItemData[];
  rightBeltItems?: BeltItemData[];
}

export function ShellLayout({
  children,
  cvUrl,
  leftBeltItems = DEFAULT_LEFT_BELT,
  rightBeltItems = DEFAULT_RIGHT_BELT,
}: ShellLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-text">
      {/* 1. Main Body: Ambient Background Stage */}
      <MainBody />

      {/* 2. Top-Center Floating Dock Nav (Desktop) */}
      <DockNav cvUrl={cvUrl} />

      {/* 3. Side Belts (Left scrolling UP, Right scrolling DOWN) */}
      <SkillBelt items={leftBeltItems} direction="up" side="left" />
      <SkillBelt items={rightBeltItems} direction="down" side="right" />

      {/* 4. Section Indicator (Side progress) */}
      <SectionIndicator />

      {/* 5. Main Display: Centered Glass Content Viewport */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 pt-20 md:pt-24 pb-20 md:pb-12">
        <MainDisplay>
          {children}
        </MainDisplay>
      </main>

      {/* 6. Mobile Bottom Tab Bar */}
      <MobileTabBar />
    </div>
  );
}
