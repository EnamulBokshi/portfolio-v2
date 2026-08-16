"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface SkillInput {
  name: string;
  category: string;
  iconUrl?: string;
  proficiency?: number;
  order?: number;
}

export async function createSkillAction(data: SkillInput) {
  try {
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        iconUrl: data.iconUrl || null,
        proficiency: data.proficiency ?? 85,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, skill };
  } catch (error) {
    console.error("Failed to create skill:", error);
    return { success: false, error: "Failed to create skill" };
  }
}

export async function updateSkillAction(id: string, data: Partial<SkillInput>) {
  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category }),
        ...(data.iconUrl !== undefined && { iconUrl: data.iconUrl || null }),
        ...(data.proficiency !== undefined && { proficiency: data.proficiency }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true, skill };
  } catch (error) {
    console.error("Failed to update skill:", error);
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await prisma.skill.delete({
      where: { id },
    });

    revalidatePath("/admin/skills");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return { success: false, error: "Failed to delete skill" };
  }
}
