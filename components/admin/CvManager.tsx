"use client";

import { useState } from "react";
import { FileText, CheckCircle2, Upload, Trash2, ExternalLink, Loader2, Plus, X } from "lucide-react";
import type { CV } from "@prisma/client";
import { uploadCvAction, activateCvAction, deleteCvAction } from "@/actions/cv-actions";

interface CvManagerProps {
  initialCvs: CV[];
}

export function CvManager({ initialCvs }: CvManagerProps) {
  const [cvs, setCvs] = useState<CV[]>(initialCvs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl.trim()) return;

    setLoading(true);
    const res = await uploadCvAction({
      fileUrl,
      versionLabel: versionLabel || `v${cvs.length + 1}.0`,
    });

    if (res.success && res.cv) {
      setCvs((prev) => [res.cv!, ...prev.map((c) => ({ ...c, isActive: false }))]);
      setFileUrl("");
      setVersionLabel("");
      setIsModalOpen(false);
    }
    setLoading(false);
  };

  const handleActivate = async (id: string) => {
    const res = await activateCvAction(id);
    if (res.success) {
      setCvs((prev) => prev.map((c) => ({ ...c, isActive: c.id === id })));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV record?")) return;
    const res = await deleteCvAction(id);
    if (res.success) {
      setCvs((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">CV & Resume Management</h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Manage downloadable resume PDF versions linked to the public CV section and action buttons
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xs font-mono shadow-md transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload / Link CV</span>
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cvs.map((cv) => (
          <div
            key={cv.id}
            className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              cv.isActive
                ? "border-blue-500/40 bg-blue-950/[0.08] shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "border-white/10 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-heading">
                      {cv.versionLabel || "CV Document"}
                    </h3>
                    <div className="text-[10px] font-mono text-zinc-400">
                      Uploaded {new Date(cv.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {cv.isActive ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Active Version
                  </span>
                ) : (
                  <button
                    onClick={() => handleActivate(cv.id)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/10 border border-white/10"
                  >
                    Set Active
                  </button>
                )}
              </div>

              <div className="text-xs font-mono text-zinc-400 truncate bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                {cv.fileUrl}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <a
                href={cv.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                <span>View File</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleDelete(cv.id)}
                className="p-1 text-zinc-500 hover:text-rose-400"
                title="Delete version"
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
              <h2 className="text-lg font-bold font-heading text-white">Upload / Link CV</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Version Label</label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="e.g. Full-Stack Lead 2026 Q3"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white focus:outline-none focus:border-blue-400/60 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">
                  PDF Public URL / Path *
                </label>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="/uploads/Enamul_Haque_Resume.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400/60 font-mono"
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
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold text-xs font-mono shadow-md transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Activate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
