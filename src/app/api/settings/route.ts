import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    
    // Map array to key-value object for easier frontend consumption
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return jsonResponse(settingsMap);
  } catch (e: any) {
    console.error("GET /api/settings error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body || typeof body !== "object") {
      return errorResponse("Invalid settings payload", 400);
    }

    // Process all keys in parallel transaction
    const upserts = Object.entries(body).map(([key, value]) => {
      const trimmedKey = String(key).trim();
      const stringValue = String(value !== null && value !== undefined ? value : "").trim();
      
      return prisma.setting.upsert({
        where: { key: trimmedKey },
        update: { value: stringValue },
        create: { key: trimmedKey, value: stringValue },
      });
    });

    await prisma.$transaction(upserts);

    // Fetch updated settings
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    return jsonResponse(settingsMap);
  } catch (e: any) {
    console.error("PUT /api/settings error:", e);
    return errorResponse("Internal server error", 500);
  }
}
