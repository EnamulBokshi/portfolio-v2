"use client";

import { useState } from "react";
import type { Skill } from "@prisma/client";
import { Cpu, Layers, Code, Database, Server } from "lucide-react";

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
    <div className="flex flex-col h-full gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Technical Arsenal</h2>
        </div>
        <span className="text-xs font-mono text-purple-400">
          {filteredSkills.length} Technologies
        </span>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] font-semibold"
                : "text-slate-400 hover:text-white bg-white/[0.03] border border-white/5 hover:bg-white/[0.08]"
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
            className="p-4 rounded-xl glass-panel border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.08] transition-all duration-200 flex flex-col justify-between gap-2.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold font-heading text-white group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </span>
              <span className="text-[11px] font-mono text-purple-400/80 group-hover:text-purple-300">
                {skill.category}
              </span>
            </div>

            {skill.proficiency && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Proficiency</span>
                  <span className="text-cyan-300 font-bold">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
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
