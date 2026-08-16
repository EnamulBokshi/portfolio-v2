"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  Cpu, 
  Trophy, 
  Mail, 
  ShieldCheck 
} from "lucide-react";

export function MobileTabBar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "Skills", href: "/skills", icon: Cpu },
    { name: "Awards", href: "/achievements", icon: Trophy },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Admin", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Tab Bar"
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around px-2 py-2.5 glass-panel bg-slate-950/90 backdrop-blur-2xl border-t border-white/10"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === "/" 
          ? pathname === "/" 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              isActive 
                ? "text-cyan-300 font-medium" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
            <span className="text-[10px] font-mono">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
