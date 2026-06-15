import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";
import { hashPassword, getSessionUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
      roleId: body?.roleId !== undefined ? body.roleId : existingUser.roleId,
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

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: data.roleId },
    });
    if (!role) {
      return errorResponse("Invalid role ID selected", 400);
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
    };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
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
    const { id } = await params;

    // Check if user is trying to delete their own account
    const session = await getSessionUser(request);
    if (session && session.userId === id) {
      return errorResponse("Security violation: You cannot delete your own account.", 400);
    }

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
