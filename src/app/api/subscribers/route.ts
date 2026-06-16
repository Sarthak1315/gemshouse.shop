import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return jsonResponse(subscribers);
  } catch (e) {
    console.error("GET /api/subscribers error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.subscriber(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { email } = validation.data;

    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return errorResponse("You are already subscribed to our newsletter", 400);
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return jsonResponse(subscriber, 201);
  } catch (e) {
    console.error("POST /api/subscribers error:", e);
    return errorResponse("Internal server error", 500);
  }
}
