"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadCvAction(data: { fileUrl: string; versionLabel: string }) {
  try {
    // Deactivate previous active CVs
    await prisma.cV.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const cv = await prisma.cV.create({
      data: {
        fileUrl: data.fileUrl,
        versionLabel: data.versionLabel,
        isActive: true,
      },
    });

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true, cv };
  } catch (error) {
    console.error("Failed to upload/activate CV:", error);
    return { success: false, error: "Failed to upload CV" };
  }
}

export async function activateCvAction(id: string) {
  try {
    await prisma.cV.updateMany({
      data: { isActive: false },
    });

    const cv = await prisma.cV.update({
      where: { id },
      data: { isActive: true },
    });

    revalidatePath("/admin/cv");
    revalidatePath("/");
    return { success: true, cv };
  } catch (error) {
    console.error("Failed to activate CV:", error);
    return { success: false, error: "Failed to activate CV" };
  }
}

export async function deleteCvAction(id: string) {
  try {
    await prisma.cV.delete({
      where: { id },
    });

    revalidatePath("/admin/cv");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete CV:", error);
    return { success: false, error: "Failed to delete CV" };
  }
}
