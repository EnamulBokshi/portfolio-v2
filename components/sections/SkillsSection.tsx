"use client";

import { useState } from "react";
import type { Skill } from "@prisma/client";
import { Cpu } from "lucide-react";

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-zinc-100">Technical Skills</h2>
          <div className="text-[11px] font-mono text-zinc-500">
            {filteredSkills.length} Technologies in Production Matrix
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-150 ${
              activeCategory === cat
                ? "bg-zinc-800 text-amber-300 border border-white/10 font-medium"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto pr-1">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl glass-panel border border-white/[0.06] hover:border-white/15 hover:bg-[#18181b]/80 transition-all duration-200 flex flex-col justify-between gap-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold font-heading text-zinc-200 group-hover:text-amber-200 transition-colors">
                {skill.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {skill.category}
              </span>
            </div>

            {skill.proficiency && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Proficiency</span>
                  <span className="text-zinc-300 font-bold">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-400 transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
