import { getSession } from "@/lib/auth";
import { getAdminDashboardStats } from "@/services/admin-service";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getAdminDashboardStats();

  return <OverviewDashboard stats={stats} userEmail={session.email} />;
}
