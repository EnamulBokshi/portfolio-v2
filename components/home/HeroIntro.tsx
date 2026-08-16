import Link from "next/link";
import { ArrowRight, Mail, FileDown, Code2 } from "lucide-react";

interface HeroIntroProps {
  cvUrl?: string | null;
}

export function HeroIntro({ cvUrl }: HeroIntroProps) {
  return (
    <section className="flex flex-col gap-6 pt-4 pb-8">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 w-fit">
        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
        <span>Full Stack System Architecture & Modern Web</span>
      </div>

      {/* Main Title */}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-6xl font-bold font-heading tracking-tight text-white leading-[1.1]">
          Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">resilient</span>, high-performance web systems.
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
          I’m <strong className="text-white font-medium">Enamul Bokshi</strong> — a Full Stack Engineer focused on scalable Next.js architectures, type-safe full stack pipelines, elegant glassmorphic interfaces, and real-time backend integrations.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3.5 pt-2">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium glass-panel glass-panel-hover text-slate-200 hover:text-white"
        >
          <Mail className="w-4 h-4 text-cyan-400" />
          <span>Get in Touch</span>
        </Link>

        {cvUrl && (
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
          >
            <FileDown className="w-4 h-4 text-purple-400" />
            <span>Download CV</span>
          </a>
        )}
      </div>
    </section>
  );
}
