import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";
import { hashPassword, getSessionAdmin } from "@/lib/auth";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const adminSession = await getSessionAdmin(request);
    if (!adminSession) {
      return errorResponse("Access denied", 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const isBusinessUserParam = searchParams.get("isBusinessUser");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isBusinessUserParam !== null) {
      where.isBusinessUser = isBusinessUserParam === "true";
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Strip password hashes from response
    const safeUsers = users.map((user) => {
      const { passwordHash, ...rest } = user;
      return rest;
    });

    return jsonResponse({ users: safeUsers, roles: [] });
  } catch (e: any) {
    console.error("GET /api/users error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminSession = await getSessionAdmin(request);
    if (!adminSession) {
      return errorResponse("Access denied", 401);
    }

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

    // Validate password is provided for new user
    if (!data.password) {
      return errorResponse("Password is required for new users", 400);
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        isBusinessUser: data.isBusinessUser || false,
        passwordHash,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return jsonResponse(safeUser, 201);
  } catch (e: any) {
    console.error("POST /api/users error:", e);
    return errorResponse("Internal server error", 500);
  }
}
