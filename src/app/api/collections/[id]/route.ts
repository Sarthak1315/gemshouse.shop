import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const collection = await prisma.collection.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      return errorResponse("Collection not found", 404);
    }

    // Flatten products relation for cleaner client handling
    const products = collection.products.map((p) => p.product);

    return jsonResponse({
      ...collection,
      products,
    });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validators.collection(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { name, slug, description, imageUrl, featured, order } = validation.data;

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      return errorResponse("Collection not found", 404);
    }

    // Check unique name/slug if changed
    if (name !== collection.name || slug !== collection.slug) {
      const existing = await prisma.collection.findFirst({
        where: {
          id: { not: id },
          OR: [
            { name },
            { slug },
          ],
        },
      });

      if (existing) {
        return errorResponse("Collection name or slug already exists", 409);
      }
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        featured,
        order,
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

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      return errorResponse("Collection not found", 404);
    }

    await prisma.collection.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Collection deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
