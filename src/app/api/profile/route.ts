import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return errorResponse("Authentication required", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isBusinessUser: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return jsonResponse(user);
  } catch (e: any) {
    console.error("GET /api/profile error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser(request);
    if (!session) {
      return errorResponse("Authentication required", 401);
    }

    const body = await request.json();
    const { name, isBusinessUser, password } = body;

    const updateData: any = {};
    
    if (name !== undefined) {
      if (!String(name).trim()) {
        return errorResponse("Name cannot be empty", 400);
      }
      updateData.name = String(name).trim();
    }

    if (isBusinessUser !== undefined) {
      updateData.isBusinessUser = Boolean(isBusinessUser);
    }

    if (password) {
      if (String(password).length < 6) {
        return errorResponse("Password must be at least 6 characters", 400);
      }
      updateData.passwordHash = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isBusinessUser: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    return jsonResponse(updatedUser);
  } catch (e: any) {
    console.error("PUT /api/profile error:", e);
    return errorResponse("Internal server error", 500);
  }
}
