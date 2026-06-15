import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: inquiryId } = await params;
    const session = await getSessionUser(request);

    if (!session) {
      return errorResponse("Authentication required", 401);
    }

    // Fetch the inquiry to check ownership
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return errorResponse("Inquiry not found", 404);
    }

    // Authorization: User must be an admin, or the owner of the inquiry, or have the matching email
    const isOwner = inquiry.userId === session.userId || inquiry.email.toLowerCase() === session.email.toLowerCase();
    const isAdmin = session.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return errorResponse("Access denied", 403);
    }

    // Fetch messages
    const messages = await prisma.inquiryMessage.findMany({
      where: { inquiryId },
      orderBy: { createdAt: "asc" },
    });

    return jsonResponse({ messages });
  } catch (e: any) {
    console.error("GET /api/inquiries/[id]/messages error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id: inquiryId } = await params;
    const session = await getSessionUser(request);

    if (!session) {
      return errorResponse("Authentication required", 401);
    }

    const body = await request.json();
    const validation = validators.inquiryMessage({
      ...body,
      inquiryId,
    });

    if (!validation.success) {
      return errorResponse(validation.errors?.[0]?.message || "Invalid message data", 400);
    }

    const { sender, message } = validation.data;

    // Fetch inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!inquiry) {
      return errorResponse("Inquiry not found", 404);
    }

    // Authorization check based on sender type
    if (sender === "ADMIN") {
      if (session.role !== "ADMIN") {
        return errorResponse("Access restricted to administrators", 403);
      }
    } else {
      // CLIENT sender must own the inquiry or match email
      const isOwner = inquiry.userId === session.userId || inquiry.email.toLowerCase() === session.email.toLowerCase();
      if (!isOwner) {
        return errorResponse("Access denied", 403);
      }
    }

    // Add message
    const newMessage = await prisma.inquiryMessage.create({
      data: {
        inquiryId,
        sender,
        message,
        senderId: session.userId,
      },
    });

    // Update the parent inquiry's updatedAt timestamp
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { updatedAt: new Date() },
    });

    return jsonResponse(newMessage, 201);
  } catch (e: any) {
    console.error("POST /api/inquiries/[id]/messages error:", e);
    return errorResponse("Internal server error", 500);
  }
}
