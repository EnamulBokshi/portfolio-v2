"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface AchievementInput {
  title: string;
  description: string;
  issuer?: string;
  date: string; // ISO date string
  imageUrl?: string;
  link?: string;
  order?: number;
}

export async function createAchievementAction(data: AchievementInput) {
  try {
    const achievement = await prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        issuer: data.issuer || null,
        date: new Date(data.date),
        imageUrl: data.imageUrl || null,
        link: data.link || null,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/");
    return { success: true, achievement };
  } catch (error) {
    console.error("Failed to create achievement:", error);
    return { success: false, error: "Failed to create achievement" };
  }
}

export async function updateAchievementAction(id: string, data: Partial<AchievementInput>) {
  try {
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.issuer !== undefined && { issuer: data.issuer || null }),
        ...(data.date && { date: new Date(data.date) }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.link !== undefined && { link: data.link || null }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/");
    return { success: true, achievement };
  } catch (error) {
    console.error("Failed to update achievement:", error);
    return { success: false, error: "Failed to update achievement" };
  }
}

export async function deleteAchievementAction(id: string) {
  try {
    await prisma.achievement.delete({
      where: { id },
    });

    revalidatePath("/admin/achievements");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete achievement:", error);
    return { success: false, error: "Failed to delete achievement" };
  }
}
