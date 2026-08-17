import { siteConfig } from "@/lib/seo-config";
import type { Project, Skill, Experience } from "@prisma/client";

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.author.name,
    alternateName: ["Md. Enamul Bokshi", "Enamul", "EnamulBokshi"],
    url: siteConfig.url,
    image: `${siteConfig.url}/photo/avatar.jpg`,
    jobTitle: siteConfig.author.role,
    worksFor: {
      "@type": "Organization",
      name: "Hype Corporation",
    },
    description: siteConfig.description,
    email: siteConfig.author.email,
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
      siteConfig.socials.twitter,
    ],
    knowsAbout: [
      "Product & System Architecture",
      "NestJS & Node.js & Express",
      "Next.js (App Router, SSR, SSG, ISR, CSR)",
      "Retrieval-Augmented Generation (RAG) AI Services",
      "Real-time AI Chat & Voice Interaction (SSE & WebSockets)",
      "Redis Data Caching & Invalidation",
      "PostgreSQL & Prisma ORM",
      "MongoDB & Mongoose",
      "Supabase & TanStack Query",
      "ERD Design & Database Migrations",
      "Docker, VPS Deployment & CI/CD Pipelines",
      "Frontend Performance Tuning & Glassmorphism UI",
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
  };
}

export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profilepage`,
    url: siteConfig.url,
    name: siteConfig.title,
    headline: `${siteConfig.author.name} — ${siteConfig.author.role}`,
    description: siteConfig.description,
    mainEntity: {
      "@id": `${siteConfig.url}/#person`,
    },
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  };
}

export function generateProjectsItemListSchema(projects: Project[]) {
  if (!projects || projects.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary,
        programmingLanguage: project.techTags,
        codeRepository: project.repoUrl || undefined,
        url: project.liveUrl || `${siteConfig.url}/#project-${project.slug}`,
        author: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    })),
  };
}

export function generateSkillsItemListSchema(skills: Skill[]) {
  if (!skills || skills.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Core Technical Competencies",
    itemListElement: skills.map((skill, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: skill.name,
      description: `Category: ${skill.category}${skill.proficiency ? ` | Proficiency: ${skill.proficiency}%` : ""}`,
    })),
  };
}

export function generateExperiencesSchema(experiences: Experience[]) {
  if (!experiences || experiences.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Professional Experience History",
    itemListElement: experiences.map((exp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Role",
        roleName: exp.role,
        startDate: exp.startDate.toISOString().split("T")[0],
        endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : undefined,
        description: exp.description,
        subjectOf: {
          "@type": "Organization",
          name: exp.company,
          url: exp.companyUrl || undefined,
          address: exp.location || undefined,
        },
      },
    })),
  };
}
