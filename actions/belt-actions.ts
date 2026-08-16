"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { BeltContext } from "@prisma/client";

export interface BeltItemInput {
  label: string;
  glyphUrl?: string;
  context?: BeltContext;
  contextRef?: string;
  order?: number;
  active?: boolean;
}

export async function createBeltItemAction(data: BeltItemInput) {
  try {
    const beltItem = await prisma.beltItem.create({
      data: {
        label: data.label,
        glyphUrl: data.glyphUrl || null,
        context: data.context ?? "GLOBAL",
        contextRef: data.contextRef || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });

    revalidatePath("/admin/belts");
    revalidatePath("/");
    return { success: true, beltItem };
  } catch (error) {
    console.error("Failed to create belt item:", error);
    return { success: false, error: "Failed to create belt item" };
  }
}

export async function updateBeltItemAction(id: string, data: Partial<BeltItemInput>) {
  try {
    const beltItem = await prisma.beltItem.update({
      where: { id },
      data: {
        ...(data.label && { label: data.label }),
        ...(data.glyphUrl !== undefined && { glyphUrl: data.glyphUrl || null }),
        ...(data.context && { context: data.context }),
        ...(data.contextRef !== undefined && { contextRef: data.contextRef || null }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });

    revalidatePath("/admin/belts");
    revalidatePath("/");
    return { success: true, beltItem };
  } catch (error) {
    console.error("Failed to update belt item:", error);
    return { success: false, error: "Failed to update belt item" };
  }
}

export async function toggleBeltItemActiveAction(id: string, currentActive: boolean) {
  return updateBeltItemAction(id, { active: !currentActive });
}

export async function deleteBeltItemAction(id: string) {
  try {
    await prisma.beltItem.delete({
      where: { id },
    });

    revalidatePath("/admin/belts");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete belt item:", error);
    return { success: false, error: "Failed to delete belt item" };
  }
}
