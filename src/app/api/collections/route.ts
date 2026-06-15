import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const where: any = {};
    if (featured !== null) {
      where.featured = featured === "true";
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return jsonResponse(collections);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.collection(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { name, slug, description, imageUrl, featured, order } = validation.data;

    // Check unique name/slug
    const existing = await prisma.collection.findFirst({
      where: {
        OR: [
          { name },
          { slug },
        ],
      },
    });

    if (existing) {
      return errorResponse("Collection name or slug already exists", 409);
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        featured,
        order,
      },
    });

    return jsonResponse(collection, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
