"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ProjectInput {
  title: string;
  slug: string;
  summary: string;
  description: string;
  techTags: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured?: boolean;
  order?: number;
  imageUrls?: string[];
}

export async function createProjectAction(data: ProjectInput) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug.toLowerCase().replace(/\s+/g, "-"),
        summary: data.summary,
        description: data.description,
        techTags: data.techTags,
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
        featured: data.featured ?? false,
        order: data.order ?? 0,
        images: data.imageUrls
          ? {
              create: data.imageUrls.map((url, idx) => ({
                url,
                order: idx,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProjectAction(id: string, data: Partial<ProjectInput>) {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.slug && { slug: data.slug.toLowerCase().replace(/\s+/g, "-") }),
        ...(data.summary && { summary: data.summary }),
        ...(data.description && { description: data.description }),
        ...(data.techTags && { techTags: data.techTags }),
        ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl || null }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl || null }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
