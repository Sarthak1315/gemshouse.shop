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
    const validation = validators.menu(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { label, href, order, isActive, parentMenuId } = validation.data;

    // Check if menu exists
    const menu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      return errorResponse("Menu item not found", 404);
    }

    // Prevent circular reference (a menu item cannot be its own parent)
    if (parentMenuId === id) {
      return errorResponse("A menu item cannot be its own parent", 400);
    }

    // Check parent exists if specified
    if (parentMenuId) {
      const parent = await prisma.menu.findUnique({
        where: { id: parentMenuId },
      });
      if (!parent) {
        return errorResponse("Parent menu item not found", 400);
      }
    }

    const updated = await prisma.menu.update({
      where: { id },
      data: {
        label,
        href,
        order,
        isActive,
        parentMenuId,
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

    const menu = await prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      return errorResponse("Menu item not found", 404);
    }

    // Note: in schema, parentMenuId relation has onDelete: Cascade, so deleting a parent menu will automatically cascade delete all submenus!
    await prisma.menu.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Menu item and all its submenus deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
