import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const projects = await prisma.project.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  return <ProjectsManager initialProjects={projects} />;
}
