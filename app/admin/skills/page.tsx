import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SkillsManager } from "@/components/admin/SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
  });

  return <SkillsManager initialSkills={skills} />;
}
