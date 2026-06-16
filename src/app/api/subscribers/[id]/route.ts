import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Subscriber not found", 404);
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Subscriber removed successfully" });
  } catch (e) {
    console.error(`DELETE /api/subscribers/${id} error:`, e);
    return errorResponse("Internal server error", 500);
  }
}
