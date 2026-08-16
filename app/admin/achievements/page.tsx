import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AchievementsManager } from "@/components/admin/AchievementsManager";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const achievements = await prisma.achievement.findMany({
    orderBy: { order: "asc" },
  });

  return <AchievementsManager initialAchievements={achievements} />;
}
