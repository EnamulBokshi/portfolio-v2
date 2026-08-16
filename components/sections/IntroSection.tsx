"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import type { CV } from "@prisma/client";

interface IntroSectionProps {
  onNavigate: (sectionId: string) => void;
  activeCv?: CV | null;
}

const ORBITAL_TECHS = [
  { name: "Next.js", color: "from-zinc-800 to-zinc-950", border: "border-white/20", text: "text-zinc-100", pos: "top-[-10px] left-1/2 -translate-x-1/2" },
  { name: "PostgreSQL", color: "from-blue-900/40 to-slate-900", border: "border-blue-500/30", text: "text-blue-300", pos: "top-[20%] left-[-15px]" },
  { name: "Docker", color: "from-cyan-950/50 to-slate-900", border: "border-cyan-500/30", text: "text-cyan-300", pos: "bottom-[12%] left-[-8px]" },
  { name: "Redis", color: "from-rose-950/50 to-slate-900", border: "border-rose-500/30", text: "text-rose-300", pos: "top-[28%] right-[-18px]" },
  { name: "Node.js", color: "from-emerald-950/50 to-slate-900", border: "border-emerald-500/30", text: "text-emerald-300", pos: "bottom-[10%] right-[-10px]" },
];

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function IntroSection({ onNavigate }: IntroSectionProps) {
  return (
    <div className="flex flex-col justify-between h-full gap-3.5 overflow-y-auto pr-1">
      {/* ── Main 2-Column Hero Section ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
        
        {/* Left Column: Bio & CTAs (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center gap-3.5">
          {/* Welcome Tag */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-amber-400 rounded-full" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
              Welcome to my portfolio
            </span>
          </div>

          {/* Name & Title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white uppercase leading-[1.05]">
              MD Enamul <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-amber-200 to-amber-400">
                Haque
              </span>
            </h1>
            <div className="text-sm sm:text-base font-mono font-bold tracking-wider text-cyan-400/90 uppercase mt-1 flex items-center gap-2">
              <span>Full-Stack Developer</span>
              <span className="w-1.5 h-4 bg-amber-400 animate-pulse inline-block" />
            </div>
          </div>

          {/* Short Bio */}
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-sans leading-relaxed">
            Building scalable, production-ready web apps with Next.js, Node.js & modern full stack architecture. Based in Dhaka — crafting clean architecture and intuitive user experiences.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => onNavigate("projects")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-[0.98]"
            >
              <span>VIEW PROJECTS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate("contact")}
              className="relative px-5 py-2.5 rounded-xl text-xs font-mono text-zinc-200 hover:text-white glass-panel hover:bg-white/[0.08] transition-all duration-200 group"
            >
              {/* Bracket Accents */}
              <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-400/70" />
              <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-amber-400/70" />
              <span>HIRE ME</span>
            </button>
          </div>

          {/* Social Links & Let's Connect */}
          <div className="flex items-center gap-3 pt-1 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <a
                href="https://github.com/EnamulBokshi"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="w-8 h-8 rounded-lg glass-panel hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg glass-panel hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>

              <button
                onClick={() => onNavigate("contact")}
                title="Contact Direct"
                className="w-8 h-8 rounded-lg glass-panel hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              | Let&apos;s Connect
            </span>
          </div>
        </div>

        {/* Right Column: Orbital Avatar Showcase (5 Cols) */}
        <div className="lg:col-span-5 flex items-center justify-center relative py-4 sm:py-0">
          {/* Orbital Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
            
            {/* Outer Rotating Orbital Track Ring */}
            <div className="absolute inset-0 rounded-full border border-white/[0.08] pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-dashed border-amber-400/20 pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-white/[0.06] pointer-events-none" />

            {/* Ambient Backlight Bloom behind Avatar */}
            <div 
              className="absolute inset-10 rounded-full opacity-60 pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(34, 211, 238, 0.15) 50%, transparent 75%)",
                filter: "blur(20px)",
              }}
            />

            {/* Avatar Circle Frame */}
            <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-tr from-amber-500/50 via-zinc-700/50 to-cyan-500/50 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#121215] border border-white/10 relative flex items-center justify-center">
                <Image
                  src="/photo/Enamul_photo_transparent.png"
                  alt="MD Enamul Haque"
                  width={300}
                  height={300}
                  priority
                  className="w-full h-full object-cover object-top scale-105 transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>

            {/* Orbital Tech Badge Nodes */}
            {ORBITAL_TECHS.map((tech) => (
              <div
                key={tech.name}
                className={`absolute z-20 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-gradient-to-br ${tech.color} border ${tech.border} ${tech.text} shadow-lg shadow-black/60 flex items-center gap-1.5 ${tech.pos} hover:scale-110 transition-transform duration-200 pointer-events-auto cursor-default`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom Metric Strip ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.08] text-zinc-400 select-none">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-amber-400">2+</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
            Years <br /> Experience
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-100">10+</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
            Projects <br /> Completed
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-zinc-100">B.Sc</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
            Computer <br /> Science
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5">
          <div className="text-xl sm:text-2xl font-extrabold font-heading text-emerald-400">100%</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 leading-tight">
            Production <br /> Reliability
          </div>
        </div>
      </div>
    </div>
  );
}
