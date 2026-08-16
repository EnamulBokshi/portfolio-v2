"use client";

import { useRouter } from "next/navigation";
import {
  LogOut,
  FolderGit2,
  Trophy,
  Wrench,
  Sliders,
  Mail,
  FileText,
  Palette,
  Briefcase,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import Link from "next/link";
import type { AdminDashboardStats } from "@/services/admin-service";

interface OverviewDashboardProps {
  stats: AdminDashboardStats;
  userEmail: string;
}

export function OverviewDashboard({ stats, userEmail }: OverviewDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const cards = [
    {
      title: "Projects",
      desc: "Manage showcased full-stack applications & repos",
      icon: FolderGit2,
      href: "/admin/projects",
      count: `${stats.projectsCount} Projects`,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
    },
    {
      title: "Experience",
      desc: "Work history, companies, roles & timeline",
      icon: Briefcase,
      href: "/admin/experience",
      count: `${stats.experiencesCount} Positions`,
      color: "text-cyan-400",
      border: "border-cyan-500/20",
      bg: "bg-cyan-500/10",
    },
    {
      title: "Achievements",
      desc: "Certifications, awards & milestones",
      icon: Trophy,
      href: "/admin/achievements",
      count: `${stats.achievementsCount} Items`,
      color: "text-amber-300",
      border: "border-amber-400/20",
      bg: "bg-amber-400/10",
    },
    {
      title: "Skills & Tech",
      desc: "Categorized skills, proficiency & icons",
      icon: Wrench,
      href: "/admin/skills",
      count: `${stats.skillsCount} Skills`,
      color: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-500/10",
    },
    {
      title: "Side Belts & Tickers",
      desc: "Left/right endless vertical marquee skills",
      icon: Sliders,
      href: "/admin/belts",
      count: `${stats.beltsCount} Belts active`,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Theme & Optical Effects",
      desc: `Active effect: ${stats.activeBeltEffect.replace("-", " ")}`,
      icon: Palette,
      href: "/admin/theme",
      count: "Theme Config",
      color: "text-rose-400",
      border: "border-rose-500/20",
      bg: "bg-rose-500/10",
    },
    {
      title: "Contact Messages",
      desc: "Incoming inquiries, hire requests & replies",
      icon: Mail,
      href: "/admin/messages",
      count: `${stats.unreadMessagesCount} Unread / ${stats.totalMessagesCount} Total`,
      color: stats.unreadMessagesCount > 0 ? "text-amber-400" : "text-zinc-400",
      border: stats.unreadMessagesCount > 0 ? "border-amber-500/30" : "border-white/10",
      bg: stats.unreadMessagesCount > 0 ? "bg-amber-500/10" : "bg-white/5",
    },
    {
      title: "CV Management",
      desc: `Active: ${stats.activeCvVersion || "Default"}`,
      icon: FileText,
      href: "/admin/cv",
      count: "PDF Downloads",
      color: "text-blue-400",
      border: "border-blue-500/20",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome / Status Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Live Session · Postgres Database
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Admin Mission Control
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Logged in as <span className="text-amber-300 font-semibold">{userEmail}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:border-amber-400/30 group transition-all"
            >
              <div>
                <div className={`w-11 h-11 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h2 className="text-base font-bold text-white font-heading mb-1.5 group-hover:text-amber-300 transition-colors">
                  {card.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-300 font-semibold">
                  {card.count}
                </span>
                <span className="text-xs text-zinc-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                  Manage →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
