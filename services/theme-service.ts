import { prisma } from "@/lib/prisma";
import type { ThemeConfig } from "@prisma/client";

export const DEFAULT_THEME_CONFIG: Omit<ThemeConfig, "id" | "updatedAt"> = {
  isActive: true,
  accentColor: "#F59E0B", // Warm Amber
  accentSecondary: "#FBBF24", // Champagne Gold
  bodyBackgroundMode: "gradient-mesh",
  bodyBaseColor: "#09090b", // Deep Obsidian Zinc
  bodySecondaryColor: "#121215", // Warm Charcoal
  glassBlurPx: 20,
  glassOpacity: 0.05,
  glassBorderOpacity: 0.08,
  fontHeading: "Space Grotesk",
  fontBody: "Inter",
  fontMono: "JetBrains Mono",
};

export async function getActiveThemeConfig(): Promise<ThemeConfig | null> {
  try {
    const theme = await prisma.themeConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    return theme;
  } catch (error) {
    console.error("Failed to fetch active ThemeConfig from database:", error);
    return null;
  }
}

export function generateThemeCssVariables(theme: ThemeConfig | null): Record<string, string> {
  const t = theme || (DEFAULT_THEME_CONFIG as ThemeConfig);

  return {
    "--accent-primary": t.accentColor || DEFAULT_THEME_CONFIG.accentColor,
    "--accent-secondary": t.accentSecondary || DEFAULT_THEME_CONFIG.accentSecondary,
    "--bg-base": t.bodyBaseColor || DEFAULT_THEME_CONFIG.bodyBaseColor,
    "--bg-bloom": t.bodySecondaryColor || DEFAULT_THEME_CONFIG.bodySecondaryColor,
    "--glass-blur": `${t.glassBlurPx ?? DEFAULT_THEME_CONFIG.glassBlurPx}px`,
    "--glass-bg": `rgba(18, 18, 21, ${t.glassOpacity ?? DEFAULT_THEME_CONFIG.glassOpacity})`,
    "--glass-border": `rgba(255, 255, 255, ${t.glassBorderOpacity ?? DEFAULT_THEME_CONFIG.glassBorderOpacity})`,
  };
}
