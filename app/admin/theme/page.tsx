import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeManager } from "@/components/admin/ThemeManager";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const theme = await prisma.themeConfig.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  return <ThemeManager initialTheme={theme} />;
}
