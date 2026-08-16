"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBeltEffectAction(newEffect: string) {
  try {
    const activeTheme = await prisma.themeConfig.findFirst({
      where: { isActive: true },
    });

    if (activeTheme) {
      await prisma.themeConfig.update({
        where: { id: activeTheme.id },
        data: {
          beltEffect: newEffect,
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.themeConfig.create({
        data: {
          beltEffect: newEffect,
          isActive: true,
        },
      });
    }

    revalidatePath("/");
    return { success: true, beltEffect: newEffect };
  } catch (error) {
    console.error("Failed to update beltEffect in database:", error);
    return { success: false, error: "Failed to update effect." };
  }
}
