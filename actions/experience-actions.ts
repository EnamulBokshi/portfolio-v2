"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ExperienceInput {
  role: string;
  company: string;
  companyUrl?: string;
  location?: string;
  startDate: string; // ISO string
  endDate?: string;
  current?: boolean;
  description: string;
  highlights: string[];
  techTags: string[];
  order?: number;
}

export async function createExperienceAction(data: ExperienceInput) {
  try {
    const experience = await prisma.experience.create({
      data: {
        role: data.role,
        company: data.company,
        companyUrl: data.companyUrl || null,
        location: data.location || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        current: data.current ?? false,
        description: data.description,
        highlights: data.highlights,
        techTags: data.techTags,
        order: data.order ?? 0,
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, experience };
  } catch (error) {
    console.error("Failed to create experience:", error);
    return { success: false, error: "Failed to create experience" };
  }
}

export async function updateExperienceAction(id: string, data: Partial<ExperienceInput>) {
  try {
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(data.role && { role: data.role }),
        ...(data.company && { company: data.company }),
        ...(data.companyUrl !== undefined && { companyUrl: data.companyUrl || null }),
        ...(data.location !== undefined && { location: data.location || null }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.current !== undefined && { current: data.current }),
        ...(data.description && { description: data.description }),
        ...(data.highlights && { highlights: data.highlights }),
        ...(data.techTags && { techTags: data.techTags }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true, experience };
  } catch (error) {
    console.error("Failed to update experience:", error);
    return { success: false, error: "Failed to update experience" };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await prisma.experience.delete({
      where: { id },
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete experience:", error);
    return { success: false, error: "Failed to delete experience" };
  }
}
