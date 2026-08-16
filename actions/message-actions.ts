"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { MessageStatus } from "@prisma/client";

export async function updateMessageStatusAction(id: string, status: MessageStatus) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true, message };
  } catch (error) {
    console.error("Failed to update message status:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

export async function replyToMessageAction(messageId: string, replyHtml: string) {
  try {
    const reply = await prisma.messageReply.create({
      data: {
        messageId,
        bodyHtml: replyHtml,
        emailStatus: "SENT",
      },
    });

    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { status: "REPLIED" },
    });

    revalidatePath("/admin/messages");
    return { success: true, reply };
  } catch (error) {
    console.error("Failed to reply to message:", error);
    return { success: false, error: "Failed to save reply" };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}
