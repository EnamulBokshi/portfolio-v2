import type { Skill, Achievement } from "@prisma/client";
import { Cpu, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

interface QuickMetricsProps {
  skills: Skill[];
  achievements: Achievement[];
  projectCount: number;
}

export function QuickMetrics({ skills, achievements, projectCount }: QuickMetricsProps) {
  const topCategories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {/* Metric 1: Core Technologies */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono text-slate-400">{skills.length}+ Tracked</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold font-heading text-white">Full Stack Ecosystem</h2>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {skills.slice(0, 6).map((skill) => (
              <span 
                key={skill.id}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/10 text-slate-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metric 2: Architectures & Projects */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono text-cyan-400">Live & Tested</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold font-heading text-white">Production Focus</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Engineered with Next.js 16 App Router, PostgreSQL, Prisma, Docker containerization, and custom session authentication.
          </p>
        </div>
      </div>

      {/* Metric 3: Recognition & Excellence */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono text-emerald-400">{achievements.length} Milestones</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold font-heading text-white">Quality & Reliability</h2>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Strict TypeScript & Clean Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
