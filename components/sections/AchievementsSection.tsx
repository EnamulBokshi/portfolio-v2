"use client";

import type { Achievement } from "@prisma/client";
import { Trophy, Calendar, ExternalLink } from "lucide-react";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400 font-mono">
        <Trophy className="w-8 h-8 mb-2 text-zinc-600" />
        <p>No achievements recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-zinc-100">Milestones & Recognition</h2>
          <div className="text-[11px] font-mono text-zinc-500">
            {achievements.length} Professional Recognitions
          </div>
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel border border-white/[0.06] hover:border-white/15 hover:bg-[#18181b]/70 transition-all duration-200 flex flex-col gap-2.5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold font-heading text-zinc-100 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
                {item.issuer && (
                  <div className="text-xs font-mono text-zinc-500">
                    Issuer: <span className="text-zinc-300">{item.issuer}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-zinc-900 border border-white/[0.06] text-zinc-400 shrink-0">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>{new Date(item.date).getFullYear()}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              {item.description}
            </p>

            {item.link && (
              <div className="pt-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Verification Link</span>
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
