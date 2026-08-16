import { prisma } from "@/lib/prisma";
import type { ThemeConfig } from "@prisma/client";

export const DEFAULT_THEME_CONFIG: Omit<ThemeConfig, "id" | "updatedAt"> = {
  isActive: true,
  accentColor: "#7C3AED",
  accentSecondary: "#22D3EE",
  bodyBackgroundMode: "gradient-mesh",
  bodyBaseColor: "#020617",
  bodySecondaryColor: "#1e1b4b",
  glassBlurPx: 24,
  glassOpacity: 0.06,
  glassBorderOpacity: 0.12,
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
    "--glass-bg": `rgba(255, 255, 255, ${t.glassOpacity ?? DEFAULT_THEME_CONFIG.glassOpacity})`,
    "--glass-border": `rgba(255, 255, 255, ${t.glassBorderOpacity ?? DEFAULT_THEME_CONFIG.glassBorderOpacity})`,
  };
}
