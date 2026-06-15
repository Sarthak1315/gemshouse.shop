import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-gemshouse-2026"
);

// Standard token generator for both users and admins
export async function createToken(payload: { userIdOrAdminId: string; email: string; role: "USER" | "ADMIN" }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userIdOrAdminId: string; email: string; role: "USER" | "ADMIN" };
  } catch (e) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session helper for storefront customers (role: USER)
export async function getSessionUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (payload && payload.role === "USER") {
    return {
      userId: payload.userIdOrAdminId,
      email: payload.email,
      role: "USER" as const
    };
  }
  return null;
}

// Session helper for administrative dashboard (role: ADMIN)
export async function getSessionAdmin(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (payload && payload.role === "ADMIN") {
    return {
      adminId: payload.userIdOrAdminId,
      email: payload.email,
      role: "ADMIN" as const
    };
  }
  return null;
}

export const authOptions = {};