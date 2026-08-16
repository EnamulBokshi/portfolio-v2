"use client";

import { Terminal, FolderGit2, Cpu, Trophy, Mail } from "lucide-react";

export interface NavSection {
  id: string;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "intro", number: "01", label: "Intro", icon: Terminal },
  { id: "projects", number: "02", label: "Projects", icon: FolderGit2 },
  { id: "skills", number: "03", label: "Skills", icon: Cpu },
  { id: "achievements", number: "04", label: "Achievements", icon: Trophy },
  { id: "contact", number: "05", label: "Contact", icon: Mail },
];

interface TopDockerProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export function TopDocker({ activeSection, onSelectSection }: TopDockerProps) {
  return (
    <header
      aria-label="Top Menu Docker"
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl glass-panel shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl border border-white/10 bg-[#121215]/85">
        {/* Brand Tag */}
        <button
          onClick={() => onSelectSection("intro")}
          className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-white/10 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold font-mono text-amber-400">EB</span>
          </div>
          <span className="text-xs font-semibold font-heading text-zinc-200 hidden lg:inline-block">
            Enamul
          </span>
        </button>

        {/* Docker Navigation Buttons */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {NAV_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-800/90 text-zinc-100 border border-white/15 shadow-sm font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-zinc-500"}`} />
                <span className="hidden md:inline text-[10px] text-zinc-500 font-bold">{sec.number}.</span>
                <span className="hidden sm:inline">{sec.label}</span>

                {/* Active Indicator Light */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
