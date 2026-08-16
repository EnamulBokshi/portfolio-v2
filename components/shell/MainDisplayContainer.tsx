"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopDocker, NAV_SECTIONS } from "../nav/TopDocker";
import { SideBelt } from "../belts/SideBelt";
import { IntroSection } from "../sections/IntroSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { SkillsSection } from "../sections/SkillsSection";
import { AchievementsSection } from "../sections/AchievementsSection";
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
  const touchStartY = useRef<number | null>(null);

  const activeSection = NAV_SECTIONS[activeSectionIndex] || NAV_SECTIONS[0];

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
      // Check if target is inside an element that is scrolled internally
      const target = e.target as HTMLElement | null;
      const scrollableParent = target?.closest(".overflow-y-auto");

      if (scrollableParent) {
        const atTop = scrollableParent.scrollTop === 0;
        const atBottom =
          scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 2;

        // If not at extremes, allow internal scrolling
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
          // Scroll Down -> Next Section
          setActiveSectionIndex((prev) => Math.min(prev + 1, NAV_SECTIONS.length - 1));
        } else {
          // Scroll Up -> Previous Section
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
          // Swiped Up -> Next Section
          setActiveSectionIndex((prev) => Math.min(prev + 1, NAV_SECTIONS.length - 1));
        } else {
          // Swiped Down -> Previous Section
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

  // Prepare side belt lists
  const leftSkills = initialData.skills.length > 0
    ? initialData.skills.map((s) => s.name)
    : DEFAULT_LEFT_SKILLS;

  const rightBelts = initialData.beltItems.length > 0
    ? initialData.beltItems.map((b) => b.label)
    : DEFAULT_RIGHT_BELT;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center select-none">
      {/* 1. Top Menu Docker */}
      <TopDocker
        activeSection={activeSection.id}
        onSelectSection={handleSelectSection}
      />

      {/* 2. Left and Right Endless Vertical Belts */}
      <SideBelt side="left" items={leftSkills} />
      <SideBelt side="right" items={rightBelts} />

      {/* 3. Side Dot Navigator */}
      <div 
        aria-label="Section Indicator"
        className="fixed right-16 sm:right-24 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-3 select-none"
      >
        {NAV_SECTIONS.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => navigateToSectionIndex(idx)}
            className="group relative flex items-center justify-center p-1"
          >
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSectionIndex === idx
                  ? "bg-cyan-400 scale-150 shadow-[0_0_10px_rgba(34,211,238,1)]"
                  : "bg-white/20 group-hover:bg-white/60"
              }`}
            />
            <span className="absolute right-6 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/90 text-slate-300 border border-white/10 whitespace-nowrap pointer-events-none">
              {sec.number} {sec.label}
            </span>
          </button>
        ))}
      </div>

      {/* 4. THE MAIN DISPLAY: Centered with 15–20% margin on all sides */}
      <div className="relative z-10 w-[92vw] sm:w-[84vw] md:w-[76vw] lg:w-[68vw] h-[78vh] sm:h-[75vh] md:h-[72vh] max-w-5xl rounded-2xl sm:rounded-3xl glass-panel border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden">
        {/* Subtle Frame Header Line */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        
        {/* Animated Parallax Section Content */}
        <div className="relative w-full h-full flex-1 overflow-hidden select-text">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection.id}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col"
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
              {activeSection.id === "skills" && (
                <SkillsSection skills={initialData.skills} />
              )}
              {activeSection.id === "achievements" && (
                <AchievementsSection achievements={initialData.achievements} />
              )}
              {activeSection.id === "contact" && (
                <ContactSection />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Display Frame Footer Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-slate-400">Section {activeSection.number} · {activeSection.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Scroll or click Docker to navigate</span>
            <span className="text-purple-400 font-bold">{activeSection.number} / 05</span>
          </div>
        </div>
      </div>
    </div>
  );
}
