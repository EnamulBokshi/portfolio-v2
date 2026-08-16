"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface ThemeConfigInput {
  accentColor?: string;
  accentSecondary?: string;
  bodyBaseColor?: string;
  bodySecondaryColor?: string;
  beltEffect?: string;
  glassBlurPx?: number;
  glassOpacity?: number;
  glassBorderOpacity?: number;
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
}

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
    revalidatePath("/admin/theme");
    return { success: true, beltEffect: newEffect };
  } catch (error) {
    console.error("Failed to update beltEffect in database:", error);
    return { success: false, error: "Failed to update effect." };
  }
}

export async function updateThemeConfigAction(data: ThemeConfigInput) {
  try {
    const activeTheme = await prisma.themeConfig.findFirst({
      where: { isActive: true },
    });

    if (activeTheme) {
      const updated = await prisma.themeConfig.update({
        where: { id: activeTheme.id },
        data: {
          ...(data.accentColor && { accentColor: data.accentColor }),
          ...(data.accentSecondary && { accentSecondary: data.accentSecondary }),
          ...(data.bodyBaseColor && { bodyBaseColor: data.bodyBaseColor }),
          ...(data.bodySecondaryColor && { bodySecondaryColor: data.bodySecondaryColor }),
          ...(data.beltEffect && { beltEffect: data.beltEffect }),
          ...(data.glassBlurPx !== undefined && { glassBlurPx: data.glassBlurPx }),
          ...(data.glassOpacity !== undefined && { glassOpacity: data.glassOpacity }),
          ...(data.glassBorderOpacity !== undefined && { glassBorderOpacity: data.glassBorderOpacity }),
          updatedAt: new Date(),
        },
      });
      revalidatePath("/");
      revalidatePath("/admin/theme");
      return { success: true, theme: updated };
    } else {
      const created = await prisma.themeConfig.create({
        data: {
          accentColor: data.accentColor || "#F59E0B",
          accentSecondary: data.accentSecondary || "#FBBF24",
          bodyBaseColor: data.bodyBaseColor || "#09090b",
          bodySecondaryColor: data.bodySecondaryColor || "#121215",
          beltEffect: data.beltEffect || "plasma-prism",
          glassBlurPx: data.glassBlurPx ?? 24,
          glassOpacity: data.glassOpacity ?? 0.06,
          isActive: true,
        },
      });
      revalidatePath("/");
      revalidatePath("/admin/theme");
      return { success: true, theme: created };
    }
  } catch (error) {
    console.error("Failed to update theme configuration:", error);
    return { success: false, error: "Failed to update theme" };
  }
}
