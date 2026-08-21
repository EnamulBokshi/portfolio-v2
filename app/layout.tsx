import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { getActiveThemeConfig, generateThemeCssVariables } from "@/services/theme-service";
import { MainBody } from "@/components/shell/MainBody";
import { CustomCursor } from "@/components/shell/CustomCursor";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePersonSchema, generateWebSiteSchema, generateProfilePageSchema } from "@/services/seo-service";
import { siteConfig } from "@/lib/seo-config";
import "./globals.css";
import Script from "next/script";

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

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: `${siteConfig.name} Portfolio`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Senior Full Stack Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@enamul_bokshi",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeConfig = await getActiveThemeConfig();
  const themeCssVariables = generateThemeCssVariables(themeConfig);

  const baseSchemas = [
    generatePersonSchema(),
    generateWebSiteSchema(),
    generateProfilePageSchema(),
  ];

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      style={themeCssVariables as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={baseSchemas} />
      </head>
      <body className="h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[#F8FAFC] font-sans antialiased selection:bg-purple-500/30 selection:text-purple-200">
        <CustomCursor />
        <MainBody />
        {children}
        <Script
          src="http://localhost:3000/widget/ora-widget.js"
          data-ora-key="biz_live_952157272a36e78aa8c949d9"
          data-ora-api="http://localhost:5000"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}
