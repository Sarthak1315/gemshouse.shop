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
    const validation = validators.faq(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { question, answer, category, order, productId } = validation.data;

    // Check if FAQ exists
    const faq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      return errorResponse("FAQ not found", 404);
    }

    // Check product exists if specified
    if (productId) {
      const prod = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!prod) {
        return errorResponse("Product not found", 400);
      }
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        order,
        productId,
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

    const faq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      return errorResponse("FAQ not found", 404);
    }

    await prisma.faq.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "FAQ deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
