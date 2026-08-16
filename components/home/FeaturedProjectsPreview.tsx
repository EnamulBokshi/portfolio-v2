import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowUpRight, FolderGit2 } from "lucide-react";

interface FeaturedProjectsPreviewProps {
  projects: (Project & { images?: { url: string; alt: string | null }[] })[];
}

export function FeaturedProjectsPreview({ projects }: FeaturedProjectsPreviewProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="my-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-purple-400" />
          <h2 className="text-lg font-bold font-heading text-white">Featured Project</h2>
        </div>
        <Link
          href="/projects"
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View all projects</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between gap-4 group"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400">/{project.slug}</span>
                {project.featured && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5">
                {project.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-white hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
