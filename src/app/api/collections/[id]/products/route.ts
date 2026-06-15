import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return errorResponse("Product ID is required", 400);
    }

    // Check if link already exists
    const existing = await prisma.productCollection.findUnique({
      where: {
        productId_collectionId: {
          productId,
          collectionId,
        },
      },
    });

    if (existing) {
      return jsonResponse({ success: true, message: "Product is already in collection" });
    }

    const linked = await prisma.productCollection.create({
      data: {
        productId,
        collectionId,
      },
    });

    return jsonResponse(linked, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return errorResponse("Product ID is required", 400);
    }

    // Check if link exists
    const existing = await prisma.productCollection.findUnique({
      where: {
        productId_collectionId: {
          productId,
          collectionId,
        },
      },
    });

    if (!existing) {
      return errorResponse("Product is not linked to this collection", 404);
    }

    await prisma.productCollection.delete({
      where: {
        productId_collectionId: {
          productId,
          collectionId,
        },
      },
    });

    return jsonResponse({ success: true, message: "Product removed from collection successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
