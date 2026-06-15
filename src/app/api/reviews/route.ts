import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get("approved");
    const productId = searchParams.get("productId");

    const where: any = {};
    if (approved !== null) {
      where.approved = approved === "true";
    }
    if (productId) {
      where.productId = productId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: { title: true, sku: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(reviews);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.review(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { author, rating, title, comment, location, productId } = validation.data;

    // Verify product exists if provided
    if (productId) {
      const prod = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!prod) {
        return errorResponse("Product not found", 400);
      }
    }

    const review = await prisma.review.create({
      data: {
        author,
        rating,
        title,
        comment,
        location,
        productId,
        approved: false, // Force moderation state on public POST
      },
    });

    return jsonResponse(review, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
