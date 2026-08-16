"use client";

import { useState } from "react";
import type { CV } from "@prisma/client";
import {
  FileText,
  FileDown,
  ExternalLink,
  Maximize2,
  Minimize2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Wrench,
  CheckCircle2,
  Download,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface CvSectionProps {
  activeCv?: CV | null;
}

export function CvSection({ activeCv }: CvSectionProps) {
  const [viewMode, setViewMode] = useState<"interactive" | "pdf">("interactive");
  const [isMaximized, setIsMaximized] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);

  const rawUrl = activeCv?.fileUrl || "/uploads/Enamul_Full_Stack_Developer_Resume.pdf";
  const versionLabel = activeCv?.versionLabel || "Enamul_Full_Stack_Developer_Resume.pdf";
  const lastUpdated = activeCv?.uploadedAt
    ? new Date(activeCv.uploadedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Updated";

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  const embedUrl = getEmbedUrl(rawUrl);

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden">
      {/* ── Top Action Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white">Curriculum Vitae</h2>
            <div className="text-[10px] sm:text-[11px] font-mono text-zinc-400">
              {versionLabel} · <span className="text-zinc-500">{lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle View Mode */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode("interactive")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "interactive"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Interactive UI</span>
            </button>

            <button
              onClick={() => setViewMode("pdf")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "pdf"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Raw PDF</span>
            </button>
          </div>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Expand Fullscreen"
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isMaximized ? "Exit" : "Expand"}</span>
          </button>

          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl glass-panel hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={rawUrl}
            download={versionLabel}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* ── Main CV Content Area ── */}
      <div className="flex-1 w-full rounded-2xl overflow-hidden glass-panel border border-white/[0.08] bg-[#07080c]/90 relative flex flex-col">
        {viewMode === "interactive" ? (
          /* ══════════════════════════════════════════════════════════
             MODE 1: INTERACTIVE DARK GLASSMORPHIC RESUME
             ══════════════════════════════════════════════════════════ */
          <div className="w-full h-full overflow-y-auto p-4 sm:p-7 md:p-8 space-y-6 text-zinc-200">
            {/* Resume Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white uppercase tracking-tight">
                  Md Enamul Haque
                </h1>
                <div className="text-sm font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300 mt-1">
                  Full-Stack Web Developer & Systems Architect
                </div>
              </div>

              {/* Contact Chips */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <a
                  href="mailto:enamulhoque11200@gmail.com"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-amber-400/40 text-zinc-300 hover:text-white transition-colors"
                >
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>enamulhoque11200@gmail.com</span>
                </a>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-300">
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>+8801871755616</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-300">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>Mirpur, Dhaka, Bangladesh</span>
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Professional Summary
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/[0.04]">
                Full-Stack Developer with hands-on experience building scalable, production-ready web applications using Next.js, React, Node.js, and PostgreSQL. Proven ability to architect and integrate AI-powered features, real-time systems, and secure REST API-driven platforms. Committed to clean code architecture, performance optimization, and delivering intuitive user experiences.
              </p>
            </div>

            {/* Technical Skills Matrix */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Technical Skills
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Frontend:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Next.js", "React", "Redux", "Tailwind CSS", "ShadCN", "HTML5", "CSS3"].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-500/10 border border-cyan-400/20 text-cyan-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Backend & APIs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Node.js", "Express.js", "Django", "REST APIs", "JWT", "OAuth 2.0", "Socket.IO"].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/10 border border-amber-400/20 text-amber-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Databases & Languages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["PostgreSQL", "MongoDB", "TypeScript", "JavaScript", "Python", "Java", "C/C++"].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-purple-500/10 border border-purple-400/20 text-purple-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">Tools & DevOps:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Docker", "Git/GitHub", "Vercel", "VPS / Linux", "Postman", "Claude", "VS Code"].map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-emerald-500/10 border border-emerald-400/20 text-emerald-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Work Experience
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-white font-heading">
                      Lead Full-Stack Web Developer <span className="text-amber-400 font-mono text-xs font-normal">@ HighScale Cloud Systems</span>
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400">2023 — Present</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-zinc-300 font-sans space-y-1 leading-relaxed">
                    <li>Architected scalable Next.js App Router applications serving 500k+ monthly active users.</li>
                    <li>Designed resilient relational models in PostgreSQL with Prisma and zero-downtime migration workflows.</li>
                    <li>Integrated real-time websocket pipelines and reduced latency by 45% using Redis caching.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Education & Academic Credentials
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white font-heading">
                    Bachelor of Science in Computer Science & Engineering (B.Sc CSE)
                  </h4>
                  <div className="text-xs font-mono text-zinc-400">Green University of Bangladesh</div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 self-start sm:self-auto">
                  Completed
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
             MODE 2: SLEEK DARK-FRAMED RAW PDF VIEWER
             ══════════════════════════════════════════════════════════ */
          <div className="w-full h-full flex flex-col bg-[#141419] relative">
            {/* Custom Mini Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10 text-xs font-mono text-zinc-300 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[220px] sm:max-w-md">{versionLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPdfZoom((z) => Math.max(50, z - 15))}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono w-10 text-center">{pdfZoom}%</span>
                <button
                  onClick={() => setPdfZoom((z) => Math.min(180, z + 15))}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPdfZoom(100)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Centered Styled PDF Stage */}
            <div className="flex-1 w-full h-full overflow-auto p-4 flex items-center justify-center bg-[#09090b]">
              <div
                className="w-full h-full max-w-4xl rounded-xl overflow-hidden shadow-2xl transition-transform duration-200 border border-white/15"
                style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: "top center" }}
              >
                <iframe
                  src={`${embedUrl}#toolbar=0&navpanes=0`}
                  title="Official Resume PDF Document"
                  className="w-full h-full min-h-[550px] border-0 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Maximized Modal Overlay ── */}
      {isMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl">
          <div className="w-full h-full max-w-6xl rounded-3xl glass-panel border border-white/20 bg-[#0f1015] shadow-2xl flex flex-col p-4 sm:p-6 gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold font-heading text-zinc-100">{versionLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={rawUrl}
                  download={versionLabel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setIsMaximized(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <iframe
                src={`${embedUrl}#toolbar=1`}
                title="Maximized PDF View"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

