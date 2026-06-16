import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createToken, getSessionAdmin } from "@/lib/auth";
import { validators } from "@/lib/validations";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  console.log("[API/Admin/Auth] POST request received");
  try {
    const body = await request.json();
    console.log("[API/Admin/Auth] Parsed body:", { email: body?.email });
    const validation = validators.login(body);

    if (!validation.success) {
      console.log("[API/Admin/Auth] Validation failed:", validation.errors);
      return errorResponse("Invalid input data", 400);
    }

    const { email, passwordHashOrPlain } = validation.data;
    console.log("[API/Admin/Auth] Querying database for admin:", email);

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    console.log("[API/Admin/Auth] Database query result. Found admin:", !!admin);

    if (!admin) {
      return errorResponse("Invalid email or password", 401);
    }

    // Compare passwords
    console.log("[API/Admin/Auth] Comparing password hashes...");
    const passwordMatch = await comparePassword(passwordHashOrPlain, admin.passwordHash);
    console.log("[API/Admin/Auth] Password comparison result:", passwordMatch);
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
