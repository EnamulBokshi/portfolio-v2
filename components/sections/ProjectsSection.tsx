"use client";

import { useState } from "react";
import type { Project } from "@prisma/client";
import { 
  FolderGit2, 
  ExternalLink, 
  Code2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Layers,
  ArrowUpRight
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ProjectsSectionProps {
  projects: (Project & { images?: { url: string; alt: string | null }[] })[];
}

const ITEMS_PER_PAGE = 3;

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"cards" | "archive">("cards");
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 font-mono">
        <FolderGit2 className="w-10 h-10 mb-3 text-purple-400" />
        <p>No projects currently available in database.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      {/* Header with Title, View Toggle & Page Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Featured Projects</h2>
            <div className="text-[11px] font-mono text-slate-400">
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, projects.length)} of {projects.length} Engineered Systems
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === "cards"
                  ? "bg-purple-600/30 text-cyan-300 border border-purple-400/30 font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3-Grid</span>
            </button>

            <button
              onClick={() => setViewMode("archive")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                viewMode === "archive"
                  ? "bg-purple-600/30 text-cyan-300 border border-purple-400/30 font-medium"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View All ({projects.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: 3-Card Focus View (with pagination) */}
      {viewMode === "cards" && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3.5 flex-1 overflow-y-auto pr-1"
            >
              {currentProjects.map((project, idx) => {
                const projectNum = String(startIndex + idx + 1).padStart(2, "0");

                return (
                  <div
                    key={project.id}
                    className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between gap-3 group relative"
                  >
                    {/* Card Top */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-purple-400 font-bold">
                          #{projectNum}
                        </span>
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-sans">
                        {project.summary}
                      </p>
                    </div>

                    {/* Card Bottom: Tech stack & links */}
                    <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {project.techTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] border border-white/10 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.techTags.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
                            +{project.techTags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="text-[11px] font-mono text-slate-400 hover:text-white transition-colors underline-offset-2 hover:underline"
                        >
                          Details & Spec
                        </button>

                        <div className="flex items-center gap-2">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Source Code"
                              className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Live Demo"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-opacity font-medium"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono transition-all ${
                      currentPage === pageNum
                        ? "bg-purple-600/40 text-cyan-300 border border-purple-400/50 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Full Archive List View */}
      {viewMode === "archive" && (
        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="p-3.5 sm:p-4 rounded-xl glass-panel border border-white/10 hover:border-cyan-400/40 transition-all flex flex-wrap items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-purple-400 font-bold">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <div className="hidden lg:flex flex-wrap gap-1">
                  {project.techTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg glass-panel hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 transition-all"
                    >
                      <span>Live</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 rounded-3xl glass-panel border border-white/20 bg-slate-950/95 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-purple-400">/{activeModalProject.slug}</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {activeModalProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {activeModalProject.summary}
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 leading-relaxed font-sans">
              {activeModalProject.description}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {activeModalProject.techTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-white/[0.05] border border-white/10 text-cyan-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              {activeModalProject.repoUrl && (
                <a
                  href={activeModalProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono glass-panel hover:bg-white/10 text-white transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}

              {activeModalProject.liveUrl && (
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/30"
                >
                  <span>Launch Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
