"use client";

import type { Achievement } from "@prisma/client";
import { Trophy, Calendar, Award, ExternalLink, CheckCircle } from "lucide-react";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 font-mono">
        <Trophy className="w-10 h-10 mb-3 text-purple-400" />
        <p>No achievements recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Milestones & Achievements</h2>
        </div>
        <span className="text-xs font-mono text-emerald-400">
          {achievements.length} Milestones
        </span>
      </div>

      {/* Achievements Timeline Cards */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all duration-200 flex flex-col gap-3 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.issuer && (
                    <div className="text-xs font-mono text-slate-400">
                      Issuer: <span className="text-purple-300">{item.issuer}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/[0.04] border border-white/5 text-slate-400 shrink-0">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{new Date(item.date).getFullYear()}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-12">
              {item.description}
            </p>

            {item.link && (
              <div className="pl-12 pt-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Verification / Certificate</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
