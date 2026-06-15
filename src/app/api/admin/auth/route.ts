import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createToken, getSessionAdmin } from "@/lib/auth";
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

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return errorResponse("Invalid email or password", 401);
    }

    // Compare passwords
    const passwordMatch = await comparePassword(passwordHashOrPlain, admin.passwordHash);
    if (!passwordMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    // Create JWT
    const token = await createToken({
      userIdOrAdminId: admin.id,
      email: admin.email,
      role: "ADMIN",
    });

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "ADMIN",
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
    console.error("Admin Login API Error:", e);
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
    const session = await getSessionAdmin(request);
    if (!session) {
      return jsonResponse({ user: null });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      return jsonResponse({ user: null });
    }

    return jsonResponse({
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
      },
    });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
