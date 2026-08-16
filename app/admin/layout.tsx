"use client";

import { LayoutDashboard, FolderGit2, Briefcase, Trophy, Wrench, Sliders, Mail, FileText, ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If rendering the login page, render full screen without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Achievements", href: "/admin/achievements", icon: Trophy },
    { label: "Skills", href: "/admin/skills", icon: Wrench },
    { label: "Belts", href: "/admin/belts", icon: Sliders },
    { label: "Theme Editor", href: "/admin/theme", icon: Palette },
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "CV", href: "/admin/cv", icon: FileText },
  ];

  return (
    <div className="h-screen w-screen bg-[#020617] text-[#F8FAFC] flex flex-col md:flex-row overflow-hidden relative z-10">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between shrink-0 bg-black/60 backdrop-blur-2xl h-full overflow-y-auto z-20">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#22D3EE] p-[1px]">
              <div className="w-full h-full bg-[#020617] rounded-lg flex items-center justify-center font-bold text-xs text-[#22D3EE] font-mono">
                EB
              </div>
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-tight text-white">Portfolio Admin</div>
              <div className="text-[10px] text-[#94A3B8] font-mono">v2.0 · Postgres</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-[#7C3AED]/15 text-white border border-[#7C3AED]/30 font-medium"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#22D3EE]" : "text-[#7C3AED]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#94A3B8] hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
