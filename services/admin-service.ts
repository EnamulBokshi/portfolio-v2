import { prisma } from "@/lib/prisma";

export interface AdminDashboardStats {
  projectsCount: number;
  skillsCount: number;
  achievementsCount: number;
  experiencesCount: number;
  beltsCount: number;
  unreadMessagesCount: number;
  totalMessagesCount: number;
  activeCvVersion: string | null;
  activeThemeName: string;
  activeBeltEffect: string;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const [
      projectsCount,
      skillsCount,
      achievementsCount,
      experiencesCount,
      beltsCount,
      unreadMessagesCount,
      totalMessagesCount,
      activeCv,
      activeTheme,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.achievement.count(),
      prisma.experience.count(),
      prisma.beltItem.count(),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.contactMessage.count(),
      prisma.cV.findFirst({ where: { isActive: true }, select: { versionLabel: true } }),
      prisma.themeConfig.findFirst({ where: { isActive: true } }),
    ]);

    return {
      projectsCount,
      skillsCount,
      achievementsCount,
      experiencesCount,
      beltsCount,
      unreadMessagesCount,
      totalMessagesCount,
      activeCvVersion: activeCv?.versionLabel || "Default",
      activeThemeName: "Obsidian Amber / Violet Signal",
      activeBeltEffect: activeTheme?.beltEffect || "plasma-prism",
    };
  } catch (err) {
    console.error("Failed to fetch admin dashboard stats:", err);
    return {
      projectsCount: 0,
      skillsCount: 0,
      achievementsCount: 0,
      experiencesCount: 0,
      beltsCount: 0,
      unreadMessagesCount: 0,
      totalMessagesCount: 0,
      activeCvVersion: null,
      activeThemeName: "Default",
      activeBeltEffect: "plasma-prism",
    };
  }
}
