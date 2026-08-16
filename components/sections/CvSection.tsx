"use client";

import { useState } from "react";
import type { CV } from "@prisma/client";
import { FileText, FileDown, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

interface CvSectionProps {
  activeCv?: CV | null;
}

export function CvSection({ activeCv }: CvSectionProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const rawUrl = activeCv?.fileUrl || "/uploads/Enamul_Full_Stack_Developer_Resume.pdf";
  const versionLabel = activeCv?.versionLabel || "Enamul_Full_Stack_Developer_Resume.pdf";
  const lastUpdated = activeCv?.uploadedAt 
    ? new Date(activeCv.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently Updated";

  // Helper to format Google Drive links to /preview mode if needed
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
    <div className="flex flex-col h-full gap-3">
      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-amber-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-zinc-100">Curriculum Vitae</h2>
            <div className="text-[11px] font-mono text-zinc-500">
              {versionLabel} · {lastUpdated}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            title="Toggle Expanded Fullscreen Preview"
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium shadow-sm transition-all active:scale-[0.98]"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Embedded Live PDF Viewer */}
      <div className="flex-1 w-full rounded-xl overflow-hidden glass-panel border border-white/[0.08] bg-[#0c0a09] relative flex flex-col">
        <object
          data={`${embedUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          type="application/pdf"
          className="w-full h-full rounded-xl"
        >
          <iframe
            src={`${embedUrl}#toolbar=0&navpanes=0`}
            title="CV Document Preview"
            className="w-full h-full rounded-xl border-0"
          >
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-zinc-400 font-mono text-xs gap-3">
              <FileText className="w-8 h-8 text-amber-400" />
              <p>Your browser does not support inline PDF viewing.</p>
              <a
                href={rawUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-medium font-mono"
              >
                Open / Download Resume PDF
              </a>
            </div>
          </iframe>
        </object>
      </div>

      {/* Maximized Modal Preview Overlay */}
      {isMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl">
          <div className="w-full h-full max-w-6xl rounded-3xl glass-panel border border-white/20 bg-[#121215] shadow-2xl flex flex-col p-4 sm:p-6 gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold font-heading text-zinc-100">{versionLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={rawUrl}
                  download={versionLabel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-amber-500 text-zinc-950 font-medium hover:bg-amber-400"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => setIsMaximized(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10">
              <iframe
                src={`${embedUrl}#toolbar=1`}
                title="Maximized CV Document Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
