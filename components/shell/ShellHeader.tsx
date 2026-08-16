import Link from "next/link";
import { Terminal, Sparkles } from "lucide-react";

export function ShellHeader() {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
      <Link 
        href="/"
        className="flex items-center gap-2.5 group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-purple-300 group-hover:text-cyan-300 transition-colors" />
          </div>
        </div>
        <div>
          <span className="font-heading font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            Enamul Bokshi
          </span>
          <span className="hidden sm:inline-block ml-2 text-xs font-mono text-slate-400">
            / Full Stack Engineer
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {/* Availability Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">Available for Opportunities</span>
          <span className="sm:hidden">Available</span>
        </div>

        {/* Dynamic V2 Badge */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full glass-panel border border-purple-500/20 text-purple-300 text-xs font-mono">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>v2.0</span>
        </div>
      </div>
    </header>
  );
}
