import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get("roleId") || "";
    const search = searchParams.get("search") || "";

    const where: any = {};

    if (roleId) {
      where.roleId = roleId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
      },
    });

    // Strip password hashes from response
    const safeUsers = users.map((user) => {
      const { passwordHash, ...rest } = user;
      return rest;
    });

    // Also load roles for convenience in select dropdowns
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return jsonResponse({ users: safeUsers, roles });
  } catch (e: any) {
    console.error("GET /api/users error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.user(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    // Check unique email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return errorResponse(`User with email '${data.email}' already exists`, 409);
    }

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: data.roleId },
    });

    if (!role) {
      return errorResponse("Invalid role ID selected", 400);
    }

    // Validate password is provided for new user
    if (!data.password) {
      return errorResponse("Password is required for new users", 400);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        passwordHash,
      },
      include: {
        role: true,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return jsonResponse(safeUser, 201);
  } catch (e: any) {
    console.error("POST /api/users error:", e);
    return errorResponse("Internal server error", 500);
  }
}
