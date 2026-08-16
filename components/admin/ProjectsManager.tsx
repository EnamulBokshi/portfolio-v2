"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, GitFork, Star, Loader2, X, Check } from "lucide-react";
import type { Project, ProjectImage } from "@prisma/client";
import { createProjectAction, updateProjectAction, deleteProjectAction, type ProjectInput } from "@/actions/project-actions";

type ProjectWithImages = Project & { images: ProjectImage[] };

interface ProjectsManagerProps {
  initialProjects: ProjectWithImages[];
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectWithImages[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithImages | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [techTagsStr, setTechTagsStr] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setDescription("");
    setTechTagsStr("");
    setLiveUrl("");
    setRepoUrl("");
    setFeatured(false);
    setOrder(projects.length);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProjectWithImages) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setSummary(p.summary);
    setDescription(p.description);
    setTechTagsStr(p.techTags.join(", "));
    setLiveUrl(p.liveUrl || "");
    setRepoUrl(p.repoUrl || "");
    setFeatured(p.featured);
    setOrder(p.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const techTags = techTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ProjectInput = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      summary,
      description,
      techTags,
      liveUrl: liveUrl || undefined,
      repoUrl: repoUrl || undefined,
      featured,
      order: Number(order),
    };

    if (editingProject) {
      const res = await updateProjectAction(editingProject.id, payload);
      if (res.success && res.project) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...res.project } : p))
        );
        setIsModalOpen(false);
      }
    } else {
      const res = await createProjectAction(payload);
      if (res.success && res.project) {
        setProjects((prev) => [...prev, { ...res.project, images: [] } as ProjectWithImages]);
        setIsModalOpen(false);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await deleteProjectAction(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Project Showcase</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage projects displayed in the central interactive showcase card
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between group hover:border-amber-400/30 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white font-heading">{project.title}</h3>
                  {project.featured && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 border border-amber-400/30 text-amber-300">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                {project.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/10 text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Order #{project.order}</span>
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline"
                  >
                    <span>Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-amber-300 hover:underline"
                  >
                    <span>Code</span>
                    <GitFork className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-white/15 bg-[#121215]/95 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold font-heading text-white">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Real-Time Distributed Telemetry Engine"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400/60 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. telemetry-engine"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Summary (1-2 sentences) *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="High performance web app handling 50k events/sec..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Full Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive technical breakdown of architectural decisions, database models, and outcomes..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Tech Stack Tags (comma-separated)</label>
                <input
                  type="text"
                  value={techTagsStr}
                  onChange={(e) => setTechTagsStr(e.target.value)}
                  placeholder="Next.js, TypeScript, PostgreSQL, Redis, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded accent-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  Feature prominently on home showcase
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProject ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
