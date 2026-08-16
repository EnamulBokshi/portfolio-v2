"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  Trophy, 
  Cpu, 
  Mail, 
  ShieldCheck, 
  FileText,
  ExternalLink
} from "lucide-react";

interface DockNavProps {
  cvUrl?: string | null;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

export function DockNav({ cvUrl }: DockNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Skills", href: "/skills", icon: Cpu },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  if (cvUrl) {
    navItems.push({
      name: "CV / Resume",
      href: cvUrl,
      icon: FileText,
      isExternal: true,
    });
  }

  return (
    <nav 
      aria-label="Main Dock Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel shadow-2xl backdrop-blur-xl border border-white/10 bg-slate-950/70">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isExternal && (
            item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href)
          );

          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                className="group relative flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                <ExternalLink className="w-2.5 h-2.5 absolute top-2 right-2 text-cyan-400 opacity-60 group-hover:opacity-100" />
                
                {/* Tooltip */}
                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 text-slate-200 border border-white/10 shadow-lg whitespace-nowrap pointer-events-none">
                  {item.name}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              
              {/* Active Dot */}
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              )}

              {/* Tooltip */}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 text-slate-200 border border-white/10 shadow-lg whitespace-nowrap pointer-events-none">
                {item.name}
              </span>
            </Link>
          );
        })}

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Admin Link */}
        <Link
          href="/admin"
          title="Admin Dashboard"
          className="group relative flex items-center justify-center w-11 h-11 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-950/40 transition-all duration-200"
        >
          <ShieldCheck className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/90 text-slate-200 border border-white/10 shadow-lg whitespace-nowrap pointer-events-none">
            Admin
          </span>
        </Link>
      </div>
    </nav>
  );
}
