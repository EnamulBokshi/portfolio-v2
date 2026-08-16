"use client";

import type { Experience } from "@prisma/client";
import { Briefcase, Calendar, MapPin, ExternalLink, CheckCircle2 } from "lucide-react";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400 font-mono">
        <Briefcase className="w-8 h-8 mb-2 text-zinc-600" />
        <p>No work experience recorded yet.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-zinc-100">Work Experience</h2>
          <div className="text-[11px] font-mono text-zinc-500">
            {experiences.length} Career Engineering Milestones
          </div>
        </div>
      </div>

      {/* Experience Timeline Cards */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl glass-panel border border-white/[0.06] hover:border-white/15 hover:bg-[#18181b]/70 transition-all duration-200 flex flex-col gap-3 group"
          >
            {/* Top row: Role & Company + Date badge */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-zinc-100 group-hover:text-amber-200 transition-colors">
                    {exp.role}
                  </h3>
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                      Present
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1">
                  <span className="text-amber-400/90 font-medium">{exp.company}</span>
                  {exp.location && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </>
                  )}
                  {exp.companyUrl && (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Date Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 border border-white/[0.06] text-zinc-400 shrink-0">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>
                  {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {exp.description}
            </p>

            {/* Bullet Highlights */}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul className="flex flex-col gap-1.5 pt-1 pl-1">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Tech Tags */}
            {exp.techTags && exp.techTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.04]">
                {exp.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
