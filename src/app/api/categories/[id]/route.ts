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
    const validation = validators.category(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { name, slug, description, image } = validation.data;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    // Check unique name/slug if changed
    if (name !== category.name || slug !== category.slug) {
      const existingName = await prisma.category.findFirst({
        where: {
          id: { not: id },
          OR: [
            { name },
            { slug },
          ],
        },
      });

      if (existingName) {
        return errorResponse("Category name or slug already exists", 409);
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
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

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    // Check if category contains products before deleting (or let standard cascade happen, wait, does schema have onDelete: Restrict? Schema has products Category relation with NO onDelete specified, which defaults to RESTRICT in Postgres/Prisma!).
    // Let's check products count first
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return errorResponse("Cannot delete category containing active products. Re-assign products first.", 400);
    }

    await prisma.category.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Category deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
