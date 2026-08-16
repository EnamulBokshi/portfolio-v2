"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import type { NavSection } from "./TopDocker";

interface SideSectionIndicatorProps {
  sections: NavSection[];
  activeSectionIndex: number;
  onNavigate: (index: number) => void;
}

export function SideSectionIndicator({
  sections,
  activeSectionIndex,
  onNavigate,
}: SideSectionIndicatorProps) {
  const canGoPrev = activeSectionIndex > 0;
  const canGoNext = activeSectionIndex < sections.length - 1;

  return (
    <aside
      aria-label="Side Section Navigator"
      className="fixed right-16 sm:right-24 md:right-28 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-2 select-none"
    >
      {/* Up Arrow Button */}
      <button
        disabled={!canGoPrev}
        onClick={() => onNavigate(activeSectionIndex - 1)}
        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
        title="Previous Section"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Stack of Horizontal Capsule Bars */}
      <div className="flex flex-col items-center gap-2 py-1">
        {sections.map((sec, idx) => {
          const isActive = activeSectionIndex === idx;

          return (
            <button
              key={sec.id}
              onClick={() => onNavigate(idx)}
              className="group relative flex items-center justify-center py-1 px-1 transition-all"
              title={`${sec.number}. ${sec.label}`}
            >
              {/* Capsule Line (Active is wider & bright white/amber) */}
              <span
                className={`rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "w-8 h-[4px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
                    : "w-3.5 h-[2.5px] bg-zinc-600 group-hover:w-5 group-hover:bg-zinc-300"
                }`}
              />

              {/* Floating Tooltip on Hover */}
              <span className="absolute right-10 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-950/90 text-zinc-200 border border-white/15 whitespace-nowrap shadow-xl pointer-events-none">
                <span className="text-amber-400 font-bold mr-1">{sec.number}.</span>
                {sec.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Down Arrow Button */}
      <button
        disabled={!canGoNext}
        onClick={() => onNavigate(activeSectionIndex + 1)}
        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-colors"
        title="Next Section"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </aside>
  );
}
