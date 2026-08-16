import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { getActiveThemeConfig, generateThemeCssVariables } from "@/services/theme-service";
import { MainBody } from "@/components/shell/MainBody";
import { CustomCursor } from "@/components/shell/CustomCursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enamul Bokshi — Full Stack Portfolio",
  description: "Full Stack Engineer specializing in Next.js, React, TypeScript, and high-performance web systems.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeConfig = await getActiveThemeConfig();
  const themeCssVariables = generateThemeCssVariables(themeConfig);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      style={themeCssVariables as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className="h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[#F8FAFC] font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <CustomCursor />
        <MainBody />
        {children}
      </body>
    </html>
  );
}
