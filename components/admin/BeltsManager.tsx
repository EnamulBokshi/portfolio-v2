"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Sliders, ToggleLeft, ToggleRight, Loader2, X } from "lucide-react";
import type { BeltItem, BeltContext } from "@prisma/client";
import {
  createBeltItemAction,
  updateBeltItemAction,
  toggleBeltItemActiveAction,
  deleteBeltItemAction,
  type BeltItemInput,
} from "@/actions/belt-actions";

interface BeltsManagerProps {
  initialBelts: BeltItem[];
}

export function BeltsManager({ initialBelts }: BeltsManagerProps) {
  const [belts, setBelts] = useState<BeltItem[]>(initialBelts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBelt, setEditingBelt] = useState<BeltItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Form
  const [label, setLabel] = useState("");
  const [context, setContext] = useState<BeltContext>("GLOBAL");
  const [contextRef, setContextRef] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingBelt(null);
    setLabel("");
    setContext("GLOBAL");
    setContextRef("");
    setOrder(belts.length);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: BeltItem) => {
    setEditingBelt(item);
    setLabel(item.label);
    setContext(item.context);
    setContextRef(item.contextRef || "");
    setOrder(item.order);
    setActive(item.active);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: BeltItemInput = {
      label,
      context,
      contextRef: contextRef || undefined,
      order: Number(order),
      active,
    };

    if (editingBelt) {
      const res = await updateBeltItemAction(editingBelt.id, payload);
      if (res.success && res.beltItem) {
        setBelts((prev) =>
          prev.map((b) => (b.id === editingBelt.id ? res.beltItem! : b))
        );
        setIsModalOpen(false);
      }
    } else {
      const res = await createBeltItemAction(payload);
      if (res.success && res.beltItem) {
        setBelts((prev) => [...prev, res.beltItem!]);
        setIsModalOpen(false);
      }
    }

    setLoading(false);
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    const res = await toggleBeltItemActiveAction(id, currentActive);
    if (res.success && res.beltItem) {
      setBelts((prev) =>
        prev.map((b) => (b.id === id ? { ...b, active: !currentActive } : b))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this belt item?")) return;
    const res = await deleteBeltItemAction(id);
    if (res.success) {
      setBelts((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Side Belts & Tickers</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage the continuous vertical ticker streams on the left and right screen borders
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Belt Item</span>
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {belts.map((item) => (
          <div
            key={item.id}
            className={`glass-panel rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 ${
              item.active
                ? "border-emerald-500/20 bg-emerald-950/[0.04]"
                : "border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(item.id, item.active)}
                className="text-zinc-400 hover:text-white transition-colors"
                title={item.active ? "Click to deactivate" : "Click to activate"}
              >
                {item.active ? (
                  <ToggleRight className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-zinc-600" />
                )}
              </button>

              <div>
                <div className="font-mono font-bold text-xs text-white">{item.label}</div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {item.context} · Order #{item.order}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditModal(item)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
                {editingBelt ? "Edit Belt Item" : "Add Belt Item"}
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
                <label className="block text-xs font-mono text-zinc-300 mb-1">Item Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Next.js App Router, Docker & Cloud Native"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400/60 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Context</label>
                  <select
                    value={context}
                    onChange={(e) => setContext(e.target.value as BeltContext)}
                    className="w-full px-3 py-2 rounded-xl bg-[#121215] border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400/60 font-mono"
                  >
                    <option value="GLOBAL">GLOBAL</option>
                    <option value="PROJECT">PROJECT</option>
                    <option value="SKILLS">SKILLS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400/60 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheckbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded accent-emerald-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="activeCheckbox" className="text-xs font-mono text-zinc-300 cursor-pointer">
                  Active in vertical endless stream
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBelt ? "Update Item" : "Add Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
