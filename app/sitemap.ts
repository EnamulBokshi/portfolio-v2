import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/seo-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [projects, latestExp, latestAch, activeCv] = await Promise.all([
      prisma.project.findMany({
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      prisma.experience.findFirst({
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.achievement.findFirst({
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.cV.findFirst({
        where: { isActive: true },
        select: { uploadedAt: true },
        orderBy: { uploadedAt: "desc" },
      }),
    ]);

    // Portfolio section routes (Intro, Projects, Experience, Skills, Achievements, CV, Contact)
    const sectionRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/#intro`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/#projects`,
        lastModified: projects[0]?.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.95,
      },
      {
        url: `${baseUrl}/#experience`,
        lastModified: latestExp?.createdAt ?? now,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#skills`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.85,
      },
      {
        url: `${baseUrl}/#achievements`,
        lastModified: latestAch?.createdAt ?? now,
        changeFrequency: "monthly",
        priority: 0.85,
      },
      {
        url: `${baseUrl}/#cv`,
        lastModified: activeCv?.uploadedAt ?? now,
        changeFrequency: "monthly",
        priority: 0.85,
      },
      {
        url: `${baseUrl}/#contact`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    // Dynamic individual project deep-links
    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${baseUrl}/#project-${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

    return [...staticRoutes, ...sectionRoutes, ...projectRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    return [
      ...staticRoutes,
      { url: `${baseUrl}/#intro`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
      { url: `${baseUrl}/#projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${baseUrl}/#experience`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
      { url: `${baseUrl}/#skills`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${baseUrl}/#achievements`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${baseUrl}/#cv`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${baseUrl}/#contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ];
  }
}
