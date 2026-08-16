"use client";

import { ArrowRight, Mail, Terminal, Sparkles, FileDown, Shield } from "lucide-react";
import type { CV } from "@prisma/client";

interface IntroSectionProps {
  onNavigate: (sectionId: string) => void;
  activeCv?: CV | null;
}

export function IntroSection({ onNavigate, activeCv }: IntroSectionProps) {
  return (
    <div className="flex flex-col justify-between h-full gap-6">
      {/* Top Header Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Available for New Opportunities</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/30 px-3 py-1 rounded-full border border-purple-500/20">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full Stack Architecture</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-white leading-[1.1]">
          Hello, I’m <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Enamul Bokshi</span>.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
          Full Stack Engineer building resilient, high-performance web systems with <strong className="text-white">Next.js App Router</strong>, <strong className="text-white">TypeScript</strong>, <strong className="text-white">PostgreSQL</strong>, and modern cloud architectures.
        </p>
      </div>

      {/* Quick Badges / Micro Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold font-heading text-white">Interactive UI</div>
            <div className="text-[11px] font-mono text-slate-400">Glassmorphism & Parallax</div>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-bold font-heading text-white">Type-Safe Backend</div>
            <div className="text-[11px] font-mono text-slate-400">Prisma & Server Actions</div>
          </div>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-bold font-heading text-white">Containerized</div>
            <div className="text-[11px] font-mono text-slate-400">Docker & Microservices</div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate("projects")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigate("contact")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium glass-panel hover:bg-white/10 text-slate-200 hover:text-white transition-all duration-200"
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Get in Touch</span>
        </button>

        {activeCv?.fileUrl && (
          <a
            href={activeCv.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 ml-auto"
          >
            <FileDown className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Resume</span>
          </a>
        )}
      </div>
    </div>
  );
}
