import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validation = validators.atelier(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { city, name, role, phone, address, services, description, mapCoords, order } = validation.data;

    // Check if atelier exists
    const existing = await prisma.atelier.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Atelier not found", 404);
    }

    const updated = await prisma.atelier.update({
      where: { id },
      data: {
        city,
        name,
        role,
        phone,
        address,
        services,
        description,
        mapCoords,
        order,
      },
    });

    return jsonResponse(updated);
  } catch (e) {
    console.error(`PUT /api/ateliers/${id} error:`, e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const existing = await prisma.atelier.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Atelier not found", 404);
    }

    await prisma.atelier.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Atelier deleted successfully" });
  } catch (e) {
    console.error(`DELETE /api/ateliers/${id} error:`, e);
    return errorResponse("Internal server error", 500);
  }
}
