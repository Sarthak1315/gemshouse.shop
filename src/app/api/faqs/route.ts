import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (productId) {
      where.productId = productId;
    }

    const faqs = await prisma.faq.findMany({
      where,
      include: {
        product: {
          select: { title: true, sku: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return jsonResponse(faqs);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.faq(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { question, answer, category, order, productId } = validation.data;

    // Check product exists if specified
    if (productId) {
      const prod = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!prod) {
        return errorResponse("Product not found", 400);
      }
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        category,
        order,
        productId,
      },
    });

    return jsonResponse(faq, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
