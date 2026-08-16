import { PrismaClient, BeltContext } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/portfolio?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Admin User
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@enamul.dev").toLowerCase().trim();
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`👤 Admin user created/verified: ${admin.email}`);

  // 2. Seed Default ThemeConfig
  const existingTheme = await prisma.themeConfig.findFirst({
    where: { isActive: true },
  });

  if (!existingTheme) {
    const theme = await prisma.themeConfig.create({
      data: {
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
      },
    });
    console.log(`🎨 Default ThemeConfig seeded (ID: ${theme.id})`);
  } else {
    console.log(`🎨 ThemeConfig already exists (ID: ${existingTheme.id})`);
  }

  // 3. Seed Skills
  const defaultSkills = [
    { name: "Next.js", category: "Frontend", proficiency: 95, order: 1 },
    { name: "React", category: "Frontend", proficiency: 95, order: 2 },
    { name: "TypeScript", category: "Languages", proficiency: 90, order: 3 },
    { name: "Node.js", category: "Backend", proficiency: 90, order: 4 },
    { name: "PostgreSQL", category: "Database", proficiency: 85, order: 5 },
    { name: "Prisma ORM", category: "Database", proficiency: 90, order: 6 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 95, order: 7 },
    { name: "Framer Motion", category: "Frontend", proficiency: 85, order: 8 },
    { name: "Docker", category: "DevOps", proficiency: 80, order: 9 },
    { name: "GraphQL", category: "Backend", proficiency: 80, order: 10 },
  ];

  for (const skill of defaultSkills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }
  console.log(`⚡ Skills seeded (${defaultSkills.length} skills)`);

  // 4. Seed Belt Items
  const defaultBelts = [
    { label: "Full Stack Architecture", context: BeltContext.GLOBAL, order: 1 },
    { label: "High Performance Web", context: BeltContext.GLOBAL, order: 2 },
    { label: "Next.js App Router", context: BeltContext.GLOBAL, order: 3 },
    { label: "TypeScript & Type Safety", context: BeltContext.GLOBAL, order: 4 },
    { label: "Interactive Animations", context: BeltContext.GLOBAL, order: 5 },
    { label: "Docker & Cloud Native", context: BeltContext.GLOBAL, order: 6 },
    { label: "Clean Code & Scalability", context: BeltContext.GLOBAL, order: 7 },
  ];

  for (const belt of defaultBelts) {
    const existing = await prisma.beltItem.findFirst({
      where: { label: belt.label, context: belt.context },
    });
    if (!existing) {
      await prisma.beltItem.create({ data: belt });
    }
  }
  console.log(`🎗️ Belt Items seeded (${defaultBelts.length} items)`);

  // 5. Seed Starter Projects (Multiple to showcase 3-primary + pagination)
  const defaultProjects = [
    {
      slug: "interactive-portfolio-v2",
      title: "Dynamic Interactive Portfolio",
      summary: "Modern developer portfolio with real-time DB-backed content, glassmorphic UI, and interactive contact inbox.",
      description: "A showcase portfolio built with Next.js App Router, Tailwind CSS v4, Framer Motion, and PostgreSQL. Features complete admin dashboard, custom session auth, and real-time email notification loops.",
      techTags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Docker"],
      liveUrl: "https://enamul.dev",
      repoUrl: "https://github.com/EnamulBokshi/portfolio-v2",
      featured: true,
      order: 1,
    },
    {
      slug: "cloud-metrics-orchestrator",
      title: "Cloud Infrastructure Observability",
      summary: "Distributed microservices monitoring dashboard with real-time metrics telemetry and automated alerts.",
      description: "High-throughput metric ingestion pipeline processing millions of events per minute using Node.js streams, Redis Pub/Sub, and PostgreSQL timeseries aggregations with glassmorphic charts.",
      techTags: ["TypeScript", "Node.js", "Redis", "Docker", "PostgreSQL", "Tailwind CSS"],
      liveUrl: "https://metrics.enamul.dev",
      repoUrl: "https://github.com/EnamulBokshi/cloud-metrics",
      featured: true,
      order: 2,
    },
    {
      slug: "realtime-collab-canvas",
      title: "Real-time Collaboration Engine",
      summary: "Multiplayer state synchronization canvas with conflict-free replicated data types (CRDTs).",
      description: "Low-latency collaborative editor supporting live cursor presence, optimistic UI reconciliation, and end-to-end WebSocket persistence for distributed engineering teams.",
      techTags: ["React", "WebSockets", "CRDTs", "TypeScript", "Tailwind CSS", "Next.js"],
      liveUrl: "https://collab.enamul.dev",
      repoUrl: "https://github.com/EnamulBokshi/collab-canvas",
      featured: true,
      order: 3,
    },
    {
      slug: "ai-workflow-automation-agent",
      title: "Autonomous AI Agent Pipeline",
      summary: "Agentic workflow orchestrator executing multi-step LLM tool calling and code validation sandboxes.",
      description: "Engineered scalable background task workers with priority queues, structured JSON validation with Zod, and resilient fallback strategies for autonomous generative AI pipelines.",
      techTags: ["Next.js", "OpenAI / Gemini", "Zod", "Docker", "TypeScript", "PostgreSQL"],
      liveUrl: "https://ai-agent.enamul.dev",
      repoUrl: "https://github.com/EnamulBokshi/ai-agent-pipeline",
      featured: false,
      order: 4,
    },
    {
      slug: "secure-auth-gateway",
      title: "Zero-Trust Auth & Session Gateway",
      summary: "High-performance cryptographic session verification proxy with rate limiting and audit logging.",
      description: "Lightweight, edge-compatible authentication middleware enforcing JWT verification with jose, brute-force IP throttling, and seamless token rotation.",
      techTags: ["Next.js 16 Proxy", "jose", "bcryptjs", "TypeScript", "Redis"],
      liveUrl: "https://auth.enamul.dev",
      repoUrl: "https://github.com/EnamulBokshi/secure-gateway",
      featured: false,
      order: 5,
    },
  ];

  for (const proj of defaultProjects) {
    const existing = await prisma.project.findFirst({ where: { slug: proj.slug } });
    if (!existing) {
      await prisma.project.create({ data: proj });
    }
  }
  console.log(`🚀 Projects seeded (${defaultProjects.length} projects)`);

  // 6. Seed Starter Achievement
  const existingAchievement = await prisma.achievement.findFirst();
  if (!existingAchievement) {
    await prisma.achievement.create({
      data: {
        title: "Full Stack Engineering Excellence",
        description: "Recognized for building robust, scalable web applications with state-of-the-art developer experience and sleek design aesthetics.",
        issuer: "Professional Recognition",
        date: new Date(),
        order: 1,
      },
    });
    console.log("🏆 Sample Achievement seeded");
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
