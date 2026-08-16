import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const messages = await prisma.contactMessage.findMany({
    include: {
      replies: {
        orderBy: { sentAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <MessagesManager initialMessages={messages} />;
}
