import { prisma } from "@/lib/prisma";
import type { Project, Skill, Achievement, BeltItem, CV, Experience } from "@prisma/client";

export interface HomePortfolioData {
  projects: (Project & { images?: { url: string; alt: string | null }[] })[];
  skills: Skill[];
  achievements: Achievement[];
  experiences: Experience[];
  beltItems: BeltItem[];
  activeCv: CV | null;
}

export async function getHomePortfolioData(): Promise<HomePortfolioData> {
  try {
    const [projects, skills, achievements, experiences, beltItems, activeCv] = await Promise.all([
      prisma.project.findMany({
        include: { images: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      }),
      prisma.skill.findMany({
        orderBy: { order: "asc" },
        take: 12,
      }),
      prisma.achievement.findMany({
        orderBy: { order: "asc" },
        take: 5,
      }),
      prisma.experience.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.beltItem.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      prisma.cV.findFirst({
        where: { isActive: true },
        orderBy: { uploadedAt: "desc" },
      }),
    ]);

    return {
      projects,
      skills,
      achievements,
      experiences,
      beltItems,
      activeCv,
    };
  } catch (error) {
    console.error("Failed to fetch home portfolio data:", error);
    return {
      projects: [],
      skills: [],
      achievements: [],
      experiences: [],
      beltItems: [],
      activeCv: null,
    };
  }
}

export async function getLayoutShellData() {
  try {
    const [beltItems, activeCv] = await Promise.all([
      prisma.beltItem.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
      prisma.cV.findFirst({
        where: { isActive: true },
        orderBy: { uploadedAt: "desc" },
      }),
    ]);
    return { beltItems, activeCv };
  } catch (error) {
    console.error("Failed to fetch shell data:", error);
    return { beltItems: [], activeCv: null };
  }
}
