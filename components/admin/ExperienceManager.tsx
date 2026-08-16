"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, MapPin, Building, Loader2, X } from "lucide-react";
import type { Experience } from "@prisma/client";
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  type ExperienceInput,
} from "@/actions/experience-actions";

interface ExperienceManagerProps {
  initialExperiences: Experience[];
}

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(false);

  // Form
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [highlightsStr, setHighlightsStr] = useState("");
  const [techTagsStr, setTechTagsStr] = useState("");
  const [order, setOrder] = useState(0);

  const openCreateModal = () => {
    setEditingExp(null);
    setRole("");
    setCompany("");
    setCompanyUrl("");
    setLocation("");
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate("");
    setCurrent(false);
    setDescription("");
    setHighlightsStr("");
    setTechTagsStr("");
    setOrder(experiences.length);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setRole(exp.role);
    setCompany(exp.company);
    setCompanyUrl(exp.companyUrl || "");
    setLocation(exp.location || "");
    setStartDate(new Date(exp.startDate).toISOString().split("T")[0]);
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "");
    setCurrent(exp.current);
    setDescription(exp.description);
    setHighlightsStr(exp.highlights.join("\n"));
    setTechTagsStr(exp.techTags.join(", "));
    setOrder(exp.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const highlights = highlightsStr
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    const techTags = techTagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ExperienceInput = {
      role,
      company,
      companyUrl: companyUrl || undefined,
      location: location || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: current || !endDate ? undefined : new Date(endDate).toISOString(),
      current,
      description,
      highlights,
      techTags,
      order: Number(order),
    };

    if (editingExp) {
      const res = await updateExperienceAction(editingExp.id, payload);
      if (res.success && res.experience) {
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingExp.id ? res.experience! : e))
        );
        setIsModalOpen(false);
      }
    } else {
      const res = await createExperienceAction(payload);
      if (res.success && res.experience) {
        setExperiences((prev) => [...prev, res.experience!]);
        setIsModalOpen(false);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    const res = await deleteExperienceAction(id);
    if (res.success) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Work Experience</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage professional employment history, companies, and roles
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-cyan-400/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-white font-heading">{exp.role}</h3>
                <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {exp.company}
                </span>
                {exp.current && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                    Current
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {new Date(exp.startDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })} —{" "}
                  {exp.current
                    ? "Present"
                    : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString(undefined, { month: "short", year: "numeric" })
                    : "Present"}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {exp.location}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-300 line-clamp-2 pt-1 font-sans leading-relaxed">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => openEditModal(exp)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-white/15 bg-[#121215]/95 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold font-heading text-white">
                {editingExp ? "Edit Experience" : "Add New Position"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Role / Job Title *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Full Stack Engineer"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/60 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Systems"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/60 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Company Website</label>
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dhaka, Bangladesh / Remote"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={current}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentCheckbox"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="rounded accent-cyan-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="currentCheckbox" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Role Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of responsibilities and impact..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Key Highlights (one per line)</label>
                <textarea
                  rows={3}
                  value={highlightsStr}
                  onChange={(e) => setHighlightsStr(e.target.value)}
                  placeholder="Architected high throughput message ingestion pipeline&#10;Reduced latency by 45% using Redis caching"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  value={techTagsStr}
                  onChange={(e) => setTechTagsStr(e.target.value)}
                  placeholder="TypeScript, Next.js, PostgreSQL, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400/60 font-mono"
                />
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingExp ? "Update Position" : "Add Position"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
