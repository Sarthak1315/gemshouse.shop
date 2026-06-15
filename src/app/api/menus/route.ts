import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all"); // If "all" is true, return flat list of menu items for forms, otherwise return tree

    if (all === "true") {
      const flatMenus = await prisma.menu.findMany({
        orderBy: { order: "asc" },
      });
      return jsonResponse(flatMenus);
    }

    const menuTree = await prisma.menu.findMany({
      where: {
        parentMenuId: null,
      },
      include: {
        submenus: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return jsonResponse(menuTree);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.menu(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const { label, href, order, isActive, parentMenuId } = validation.data;

    // Check if parent exists if specified
    if (parentMenuId) {
      const parent = await prisma.menu.findUnique({
        where: { id: parentMenuId },
      });
      if (!parent) {
        return errorResponse(`Parent menu with ID '${parentMenuId}' does not exist`, 400);
      }
    }

    const menu = await prisma.menu.create({
      data: {
        label,
        href,
        order,
        isActive,
        parentMenuId,
      },
    });

    return jsonResponse(menu, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
