import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";
import { hashPassword, getSessionAdmin } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getSessionAdmin(request);
    if (!adminSession) {
      return errorResponse("Access denied", 401);
    }

    const { id } = await params;
    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("User not found", 404);
    }

    const validation = validators.user({
      name: body?.name !== undefined ? body.name : existingUser.name,
      email: body?.email !== undefined ? body.email : existingUser.email,
      isBusinessUser: body?.isBusinessUser !== undefined ? body.isBusinessUser : existingUser.isBusinessUser,
      password: body?.password || undefined,
    });

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    // Check unique email if changing
    if (data.email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailTaken) {
        return errorResponse(`Email '${data.email}' is already taken`, 409);
      }
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      isBusinessUser: data.isBusinessUser !== undefined ? data.isBusinessUser : existingUser.isBusinessUser,
    };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash: _, ...safeUser } = updatedUser;

    return jsonResponse(safeUser);
  } catch (e: any) {
    console.error("PUT /api/users/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getSessionAdmin(request);
    if (!adminSession) {
      return errorResponse("Access denied", 401);
    }

    const { id } = await params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return errorResponse("User not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    return jsonResponse({ message: "User deleted successfully" });
  } catch (e: any) {
    console.error("DELETE /api/users/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}
