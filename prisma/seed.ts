import { PrismaClient, BeltContext } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  // 5. Seed Starter Project
  const existingProject = await prisma.project.findFirst();
  if (!existingProject) {
    await prisma.project.create({
      data: {
        slug: "interactive-portfolio-v2",
        title: "Dynamic Interactive Portfolio",
        summary: "Modern developer portfolio with real-time DB-backed content, glassmorphic UI, and interactive contact inbox.",
        description: "A showcase portfolio built with Next.js App Router, Tailwind CSS v4, Framer Motion, and PostgreSQL. Features complete admin dashboard, custom session auth, and real-time email notification loops.",
        techTags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Docker"],
        featured: true,
        order: 1,
      },
    });
    console.log("🚀 Sample Project seeded");
  }

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
