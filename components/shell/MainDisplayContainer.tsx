"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopDocker, NAV_SECTIONS } from "../nav/TopDocker";
import { SideSectionIndicator } from "../nav/SideSectionIndicator";
import { SideBelt, type BeltEffectMode } from "../belts/SideBelt";
import { BeltEffectControl } from "../belts/BeltEffectControl";
import { GeneratedBorderFrame } from "./GeneratedBorderFrame";
import { RenderProgressCounter } from "./RenderProgressCounter";
import { IntroSection } from "../sections/IntroSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { SkillsSection } from "../sections/SkillsSection";
import { AchievementsSection } from "../sections/AchievementsSection";
import { CvSection } from "../sections/CvSection";
import { ContactSection } from "../sections/ContactSection";
import type { HomePortfolioData } from "@/services/portfolio-service";

interface MainDisplayContainerProps {
  initialData: HomePortfolioData;
}

const DEFAULT_LEFT_SKILLS = [
  "Nestjs",
  "TypeScript",
  "Java",
  "JavaScript",
  "C++",
  "Next.js",
  "React",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Tailwind CSS",
];

const DEFAULT_RIGHT_BELT = [
  "Problem Solving",
  "Data Analytics",
  "System Design",
  "Cloud Architecture",
  "High Performance Web",
  "Microservices",
  "API Design",
  "Clean Code",
];

export function MainDisplayContainer({ initialData }: MainDisplayContainerProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(true);
  const [beltEffect, setBeltEffect] = useState<BeltEffectMode>(
    (initialData.themeConfig?.beltEffect as BeltEffectMode) || "plasma-prism"
  );
  const touchStartY = useRef<number | null>(null);

  const activeSection = NAV_SECTIONS[activeSectionIndex] || NAV_SECTIONS[0];

  // Trigger 0% -> 100% Smooth Render Counting on Mount and Section Switch
  useEffect(() => {
    setIsRendering(true);
    setRenderProgress(0);

    const startTime = performance.now();
    const duration = 550; // ms for fast, smooth countdown
    let animationFrameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Easing curve (ease-out cubic for realistic digital scan acceleration)
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
      const currentVal = Math.round(easedProgress * 100);

      setRenderProgress(currentVal);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        setRenderProgress(100);
        // Small graceful pause at 100% before vanishing counter
        setTimeout(() => {
          setIsRendering(false);
        }, 160);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeSectionIndex]);

  const navigateToSectionIndex = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= NAV_SECTIONS.length) return;
    setIsTransitioning(true);
    setActiveSectionIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, []);

  const handleSelectSection = (id: string) => {
    const idx = NAV_SECTIONS.findIndex((s) => s.id === id);
    if (idx !== -1) {
      navigateToSectionIndex(idx);
    }
  };

  // 1. Wheel Scroll Listener (No scrollbar, scroll-parallax between sections)
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollableParent = target?.closest(".overflow-y-auto");

      if (scrollableParent) {
        const atTop = scrollableParent.scrollTop === 0;
        const atBottom =
          scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 2;

        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          return;
        }
      }

      e.preventDefault();

      if (wheelTimeout) return;

      if (Math.abs(e.deltaY) > 25) {
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 600);

        if (e.deltaY > 0) {
          setActiveSectionIndex((prev) => Math.min(prev + 1, NAV_SECTIONS.length - 1));
        } else {
          setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, []);

  // 2. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setActiveSectionIndex((prev) => Math.min(prev + 1, NAV_SECTIONS.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Touch Gestures (Mobile swipe)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          setActiveSectionIndex((prev) => Math.min(prev + 1, NAV_SECTIONS.length - 1));
        } else {
          setActiveSectionIndex((prev) => Math.max(prev - 1, 0));
        }
      }
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const leftSkills = initialData.skills.length > 0
    ? initialData.skills.map((s) => s.name)
    : DEFAULT_LEFT_SKILLS;

  const rightBelts = initialData.beltItems.length > 0
    ? initialData.beltItems.map((b) => b.label)
    : DEFAULT_RIGHT_BELT;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none bg-transparent">
      {/* 1. Top Menu Docker */}
      <TopDocker
        activeSection={activeSection.id}
        onSelectSection={handleSelectSection}
      />

      {/* 2. Left and Right Endless Vertical Belts with Active Effect */}
      <SideBelt side="left" items={leftSkills} effect={beltEffect} />
      <SideBelt side="right" items={rightBelts} effect={beltEffect} />

      {/* 3. Side Section Indicator (Matching user reference) */}
      <SideSectionIndicator
        sections={NAV_SECTIONS}
        activeSectionIndex={activeSectionIndex}
        onNavigate={navigateToSectionIndex}
      />

      {/* 4. THE MAIN DISPLAY: Totally Transparent with Generated Dynamic Borders */}
      <div className="relative z-10 w-[95vw] sm:w-[88vw] md:w-[80vw] lg:w-[70vw] h-[82vh] sm:h-[78vh] md:h-[74vh] max-w-5xl rounded-3xl p-4 sm:p-7 md:p-9 mt-8 sm:mt-10 md:mt-0 flex flex-col justify-between overflow-hidden bg-transparent">
        {/* Dynamic Generated SVG Borders (Matching Reference Photo) */}
        <GeneratedBorderFrame
          progress={renderProgress}
          isRendering={isRendering}
          renderKey={activeSectionIndex}
        />

        {/* Dynamic Bottom-Left 0-100% Render Percentage Counter (Vanishes on 100%) */}
        <RenderProgressCounter
          progress={renderProgress}
          isVisible={isRendering}
        />

        {/* Animated & Flickering Section Content */}
        <div className="relative w-full h-full flex-1 overflow-hidden select-text z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection.id}
              initial={{ opacity: 0, y: 15, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full h-full flex flex-col ${isRendering ? "animate-render-flicker" : ""}`}
            >
              {activeSection.id === "intro" && (
                <IntroSection
                  onNavigate={handleSelectSection}
                  activeCv={initialData.activeCv}
                />
              )}
              {activeSection.id === "projects" && (
                <ProjectsSection projects={initialData.projects} />
              )}
              {activeSection.id === "experience" && (
                <ExperienceSection experiences={initialData.experiences} />
              )}
              {activeSection.id === "skills" && (
                <SkillsSection skills={initialData.skills} />
              )}
              {activeSection.id === "achievements" && (
                <AchievementsSection achievements={initialData.achievements} />
              )}
              {activeSection.id === "cv" && (
                <CvSection activeCv={initialData.activeCv} />
              )}
              {activeSection.id === "contact" && (
                <ContactSection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Display Frame Footer Meta (Transparent Minimalist Style) */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.08] text-[11px] font-mono text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-zinc-300 font-medium">Section {activeSection.number} · {activeSection.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">Scroll or click Docker to switch</span>
            <span className="text-amber-400 font-bold tracking-wider">{activeSection.number} / {String(NAV_SECTIONS.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* 5. Belt Light Effect Control (Admin / Interactive Switcher) */}
      <BeltEffectControl
        currentEffect={beltEffect}
        onEffectChange={setBeltEffect}
      />
    </div>
  );
}

