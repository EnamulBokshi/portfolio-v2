"use client";

import { Terminal, Code2, FolderGit2, Cpu, Trophy, Mail } from "lucide-react";

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
      <div className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-2xl glass-panel shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-white/15 bg-slate-950/85">
        {/* Decorative Top Accent Line */}
        <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        {/* Brand Tag */}
        <button
          onClick={() => onSelectSection("intro")}
          className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-white/10 hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)]">
            <div className="w-full h-full bg-[#020617] rounded-[5px] flex items-center justify-center">
              <span className="text-[10px] font-bold font-mono text-cyan-300">EB</span>
            </div>
          </div>
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
                    ? "bg-purple-600/30 text-white border border-purple-400/50 shadow-[0_0_16px_rgba(124,58,237,0.4)] font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                <span className="hidden md:inline text-[10px] text-purple-400 font-bold">{sec.number}.</span>
                <span className="hidden sm:inline">{sec.label}</span>

                {/* Active Indicator Light */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
