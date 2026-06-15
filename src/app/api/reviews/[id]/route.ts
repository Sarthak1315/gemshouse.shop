import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // We allow partial updates for moderation (approving/rejecting) or full updates
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse("Review not found", 404);
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        approved: body.approved !== undefined ? Boolean(body.approved) : review.approved,
        author: body.author !== undefined ? String(body.author) : review.author,
        rating: body.rating !== undefined ? parseInt(body.rating, 10) : review.rating,
        title: body.title !== undefined ? String(body.title) : review.title,
        comment: body.comment !== undefined ? String(body.comment) : review.comment,
        location: body.location !== undefined ? String(body.location) : review.location,
      },
    });

    return jsonResponse(updated);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return errorResponse("Review not found", 404);
    }

    await prisma.review.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Review deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
