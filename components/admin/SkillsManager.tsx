"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2, X, Wrench } from "lucide-react";
import type { Skill } from "@prisma/client";
import { createSkillAction, updateSkillAction, deleteSkillAction, type SkillInput } from "@/actions/skill-actions";

interface SkillsManagerProps {
  initialSkills: Skill[];
}

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps & Cloud", "Architecture", "Tools"];

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(85);
  const [iconUrl, setIconUrl] = useState("");
  const [order, setOrder] = useState(0);

  const openCreateModal = (cat?: string) => {
    setEditingSkill(null);
    setName("");
    setCategory(cat || "Frontend");
    setProficiency(90);
    setIconUrl("");
    setOrder(skills.length);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency ?? 85);
    setIconUrl(skill.iconUrl || "");
    setOrder(skill.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: SkillInput = {
      name,
      category,
      proficiency: Number(proficiency),
      iconUrl: iconUrl || undefined,
      order: Number(order),
    };

    if (editingSkill) {
      const res = await updateSkillAction(editingSkill.id, payload);
      if (res.success && res.skill) {
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? res.skill! : s))
        );
        setIsModalOpen(false);
      }
    } else {
      const res = await createSkillAction(payload);
      if (res.success && res.skill) {
        setSkills((prev) => [...prev, res.skill!]);
        setIsModalOpen(false);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    const res = await deleteSkillAction(id);
    if (res.success) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Group by category
  const skillsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    return acc;
  }, {} as Record<string, Skill[]>);

  // Any other categories
  const otherSkills = skills.filter(
    (s) => !CATEGORIES.some((c) => c.toLowerCase() === s.category.toLowerCase())
  );
  if (otherSkills.length > 0) {
    skillsByCategory["Other"] = otherSkills;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Skills & Technologies</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage tech stacks, categorized proficiencies, and displayed badges
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(skillsByCategory).map(([catName, catSkills]) => (
          <div
            key={catName}
            className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-purple-400" />
                  <h3 className="font-bold text-sm text-white font-heading">{catName}</h3>
                </div>
                <button
                  onClick={() => openCreateModal(catName)}
                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 hover:underline"
                >
                  + Add
                </button>
              </div>

              {catSkills.length === 0 ? (
                <p className="text-xs font-mono text-zinc-500 py-4 text-center">No skills in this category</p>
              ) : (
                <div className="space-y-2">
                  {catSkills.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between hover:bg-white/[0.05] transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span className="text-xs font-mono font-medium text-zinc-200">{s.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-zinc-400">{s.proficiency}%</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1 text-zinc-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-white/15 bg-[#121215]/95 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold font-heading text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                <label className="block text-xs font-mono text-zinc-300 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, PostgreSQL, Docker"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121215] border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400/60 font-mono"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                  <span>Proficiency</span>
                  <span className="text-purple-400 font-bold">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400/60 font-mono"
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingSkill ? "Update Skill" : "Add Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
