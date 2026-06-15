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

    // We allow fetching either by ID or SKU or Slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { sku: id },
          { slug: id },
        ],
      },
      include: {
        images: true,
        category: true,
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        faqs: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return jsonResponse(product);
  } catch (e: any) {
    console.error("GET /api/products/[id] error:", e);
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
    const validation = validators.product(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    // Check if product exists
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { sku: id },
        ],
      },
    });

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // Check unique SKU if SKU changed
    if (data.sku !== product.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });
      if (existingSku) {
        return errorResponse(`Product with SKU '${data.sku}' already exists`, 409);
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        dealerPrice: data.dealerPrice,
        sku: data.sku,
        gemType: data.gemType,
        carat: data.carat,
        color: data.color,
        clarity: data.clarity,
        cut: data.cut,
        origin: data.origin,
        certification: data.certification,
        certNumber: data.certNumber,
        featured: data.featured,
        inStock: data.inStock,
        categoryId: data.categoryId,
      },
    });

    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      // Re-seed images
      await prisma.productImage.deleteMany({
        where: { productId: product.id },
      });

      for (let i = 0; i < body.images.length; i++) {
        await prisma.productImage.create({
          data: {
            url: String(body.images[i]),
            isPrimary: i === 0,
            productId: product.id,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
      },
    });

    return jsonResponse(fullProduct);
  } catch (e: any) {
    console.error("PUT /api/products/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { sku: id },
        ],
      },
    });

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    await prisma.product.delete({
      where: { id: product.id },
    });

    return jsonResponse({ success: true, message: "Product deleted successfully" });
  } catch (e: any) {
    console.error("DELETE /api/products/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}
