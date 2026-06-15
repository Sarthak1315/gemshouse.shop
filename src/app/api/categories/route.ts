import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return jsonResponse(categories);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.category(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { name, slug, description, image } = validation.data;

    // Check unique name/slug
    const existingName = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existingName) {
      return errorResponse("Category name or slug already exists", 409);
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    return jsonResponse(category, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
