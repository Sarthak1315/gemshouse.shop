import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { validators } from "@/lib/validations";
import { errorResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.register(body);

    if (!validation.success) {
      return errorResponse(validation.errors?.[0]?.message || "Invalid registration data", 400);
    }

    const { name, email, passwordHashOrPlain, isBusinessUser } = validation.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("Email is already registered", 400);
    }

    // Get USER role
    const userRole = await prisma.role.findUnique({
      where: { name: "USER" },
    });

    if (!userRole) {
      return errorResponse("User role not initialized", 500);
    }

    // Hash password
    const passwordHash = await hashPassword(passwordHashOrPlain);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isBusinessUser,
        roleId: userRole.id,
      },
      include: { role: true },
    });

    // Create JWT
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
    });

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          isBusinessUser: user.isBusinessUser,
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (e: any) {
    console.error("Register API Error:", e);
    return errorResponse("Internal server error", 500);
  }
}
