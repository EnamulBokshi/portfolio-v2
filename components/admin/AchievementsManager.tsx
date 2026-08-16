"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Trophy, ExternalLink, Calendar, Loader2, X } from "lucide-react";
import type { Achievement } from "@prisma/client";
import {
  createAchievementAction,
  updateAchievementAction,
  deleteAchievementAction,
  type AchievementInput,
} from "@/actions/achievement-actions";

interface AchievementsManagerProps {
  initialAchievements: Achievement[];
}

export function AchievementsManager({ initialAchievements }: AchievementsManagerProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issuer, setIssuer] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState(0);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setIssuer("");
    setDate(new Date().toISOString().split("T")[0]);
    setImageUrl("");
    setLink("");
    setOrder(achievements.length);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Achievement) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setIssuer(item.issuer || "");
    setDate(new Date(item.date).toISOString().split("T")[0]);
    setImageUrl(item.imageUrl || "");
    setLink(item.link || "");
    setOrder(item.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: AchievementInput = {
      title,
      description,
      issuer: issuer || undefined,
      date: new Date(date).toISOString(),
      imageUrl: imageUrl || undefined,
      link: link || undefined,
      order: Number(order),
    };

    if (editingItem) {
      const res = await updateAchievementAction(editingItem.id, payload);
      if (res.success && res.achievement) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === editingItem.id ? res.achievement! : a))
        );
        setIsModalOpen(false);
      }
    } else {
      const res = await createAchievementAction(payload);
      if (res.success && res.achievement) {
        setAchievements((prev) => [...prev, res.achievement!]);
        setIsModalOpen(false);
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    const res = await deleteAchievementAction(id);
    if (res.success) {
      setAchievements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Achievements & Certifications</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage honors, verified certificates, and competitive accomplishments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-heading">{item.title}</h3>
                    {item.issuer && (
                      <span className="text-[11px] font-mono text-amber-300/80">{item.issuer}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 pt-2 font-sans leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {new Date(item.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </span>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-white/15 bg-[#121215]/95 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-lg font-bold font-heading text-white">
                {editingItem ? "Edit Achievement" : "Add Achievement"}
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
                <label className="block text-xs font-mono text-zinc-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400/60 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Issuer / Organization</label>
                  <input
                    type="text"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services, LeetCode"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Date Achieved *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details regarding the achievement or milestone..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Verification / Certificate URL</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-amber-400/60 font-mono"
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Update" : "Add"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
