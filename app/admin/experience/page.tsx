import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return <ExperienceManager initialExperiences={experiences} />;
}
