import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createToken, verifyToken } from "@/lib/auth";
import { validators } from "@/lib/validations";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.login(body);

    if (!validation.success) {
      return errorResponse("Invalid input data", 400);
    }

    const { email, passwordHashOrPlain } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.passwordHash) {
      return errorResponse("Invalid email or password", 401);
    }

    // Compare passwords
    const passwordMatch = await comparePassword(passwordHashOrPlain, user.passwordHash);
    if (!passwordMatch) {
      return errorResponse("Invalid email or password", 401);
    }

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
        },
      },
      { status: 200 }
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
    console.error("Login API Error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return jsonResponse({ user: null });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return jsonResponse({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    if (!user) {
      return jsonResponse({ user: null });
    }

    return jsonResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}