import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, body: messageBody } = body;

    if (!name || !email || !messageBody) {
      return NextResponse.json(
        { error: "Name, email, and message body are required." },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        body: messageBody,
        status: "UNREAD",
      },
    });

    return NextResponse.json({ success: true, messageId: message.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to process contact message:", error);
    return NextResponse.json(
      { error: "Failed to submit message." },
      { status: 500 }
    );
  }
}
