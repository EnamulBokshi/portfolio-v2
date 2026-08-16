"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  Cpu, 
  Trophy, 
  Mail, 
  ShieldCheck, 
  FileText,
  ExternalLink
} from "lucide-react";

interface DockNavProps {
  cvUrl?: string | null;
}

export function DockNav({ cvUrl }: DockNavProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Skills", href: "/skills", icon: Cpu },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <header
      aria-label="Desktop Top Dock Navigation"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-panel shadow-2xl backdrop-blur-2xl border border-white/10 bg-slate-950/80">
        {/* Brand / Logo Glyph */}
        <Link
          href="/"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors group mr-1"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1px] shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <span className="text-[10px] font-bold font-heading text-purple-300 group-hover:text-cyan-300">EB</span>
            </div>
          </div>
          <span className="text-xs font-semibold font-heading text-white hidden lg:inline-block">
            Enamul Bokshi
          </span>
        </Link>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              )}

              {/* Tooltip */}
              <span className="absolute -bottom-9 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/95 text-slate-200 border border-white/10 shadow-xl whitespace-nowrap pointer-events-none z-50">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* CV Link if present */}
        {cvUrl && (
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Download CV"
            className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <ExternalLink className="w-2.5 h-2.5 absolute top-2 right-2 text-cyan-400 opacity-60 group-hover:opacity-100" />
            <span className="absolute -bottom-9 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/95 text-slate-200 border border-white/10 shadow-xl whitespace-nowrap pointer-events-none z-50">
              CV / Resume
            </span>
          </a>
        )}

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {/* Admin Dashboard */}
        <Link
          href="/admin"
          title="Admin Dashboard"
          className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 transition-all duration-200"
        >
          <ShieldCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span className="absolute -bottom-9 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/95 text-slate-200 border border-white/10 shadow-xl whitespace-nowrap pointer-events-none z-50">
            Admin
          </span>
        </Link>
      </div>
    </header>
  );
}
