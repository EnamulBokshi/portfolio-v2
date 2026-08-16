"use client";

import { ArrowRight, Mail, FileDown } from "lucide-react";
import type { CV } from "@prisma/client";

interface IntroSectionProps {
  onNavigate: (sectionId: string) => void;
  activeCv?: CV | null;
}

export function IntroSection({ onNavigate, activeCv }: IntroSectionProps) {
  return (
    <div className="flex flex-col justify-between h-full gap-6">
      {/* Top Header Status Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Available for Engineering Roles</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.06]">
          <span>Dhaka, Bangladesh · UTC+6</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="flex flex-col gap-3.5">
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
          Full Stack Software Engineer
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-zinc-100 leading-[1.1]">
          Building resilient, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-400">high-performance</span> web systems.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-sans leading-relaxed">
          I’m <strong className="text-zinc-200 font-medium">Enamul Bokshi</strong>. Focused on modern Next.js architectures, type-safe full stack APIs, low-latency data pipelines, and clean minimalist user interfaces.
        </p>
      </div>

      {/* Core Engineering Stack Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2.5">
        <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          Primary Ecosystem & Tooling
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["Next.js App Router", "TypeScript", "React", "PostgreSQL", "Prisma ORM", "Docker", "Node.js", "Tailwind CSS"].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900/80 text-zinc-300 border border-white/[0.08]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={() => onNavigate("projects")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-medium bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-[0.98]"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onNavigate("contact")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono glass-panel hover:bg-white/[0.08] text-zinc-200 hover:text-white transition-all duration-200"
        >
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Get in Touch</span>
        </button>

        {activeCv?.fileUrl && (
          <a
            href={activeCv.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all duration-200 ml-auto"
          >
            <FileDown className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        )}
      </div>
    </div>
  );
}
