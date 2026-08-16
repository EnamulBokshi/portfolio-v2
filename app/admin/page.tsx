"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, FolderGit2, Trophy, Wrench, Sliders, Mail, FileText, Loader2 } from "lucide-react";

export default function AdminDashboardOverview() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthenticated");
        return res.json();
      })
      .then((data) => {
        setAdminUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  const sections = [
    { title: "Projects", desc: "Manage showcase projects and order", icon: FolderGit2, href: "/admin/projects", count: "1 seeded" },
    { title: "Achievements", desc: "Manage certificates and milestones", icon: Trophy, href: "/admin/achievements", count: "1 seeded" },
    { title: "Skills", desc: "Manage tech stack categories", icon: Wrench, href: "/admin/skills", count: "10 seeded" },
    { title: "Belts & Tickers", desc: "Manage marquee belt items", icon: Sliders, href: "/admin/belts", count: "7 seeded" },
    { title: "Contact Messages", desc: "Manage visitor messages & replies", icon: Mail, href: "/admin/messages", count: "Inbox active" },
    { title: "CV Management", desc: "Upload and activate CV PDFs", icon: FileText, href: "/admin/cv", count: "Ready" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#34D399]">Live Admin Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Welcome back, {adminUser?.email.split("@")[0]}
          </h1>
          <p className="text-sm text-[#94A3B8] font-mono mt-1">
            Connected to PostgreSQL with active JWT session security.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-[#FB7185]/10 border border-white/10 hover:border-[#FB7185]/30 text-[#94A3B8] hover:text-[#FB7185] text-xs font-mono transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Grid of quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.title}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-white/10 group cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <h2 className="text-lg font-bold text-white font-heading mb-1">{sec.title}</h2>
                <p className="text-xs text-[#94A3B8]">{sec.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-[#22D3EE]">{sec.count}</span>
                <span className="text-xs text-[#94A3B8] group-hover:text-white transition-colors">Phase 3 CRUD →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
