import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CvManager } from "@/components/admin/CvManager";

export const dynamic = "force-dynamic";

export default async function AdminCvPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const cvs = await prisma.cV.findMany({
    orderBy: { uploadedAt: "desc" },
  });

  return <CvManager initialCvs={cvs} />;
}
