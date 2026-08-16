import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BeltsManager } from "@/components/admin/BeltsManager";

export const dynamic = "force-dynamic";

export default async function AdminBeltsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const belts = await prisma.beltItem.findMany({
    orderBy: { order: "asc" },
  });

  return <BeltsManager initialBelts={belts} />;
}
