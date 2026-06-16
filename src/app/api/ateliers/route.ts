import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const ateliers = await prisma.atelier.findMany({
      orderBy: { order: "asc" },
    });
    return jsonResponse(ateliers);
  } catch (e) {
    console.error("GET /api/ateliers error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.atelier(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { city, name, role, phone, address, services, description, mapCoords, order } = validation.data;

    const atelier = await prisma.atelier.create({
      data: {
        city,
        name,
        role,
        phone,
        address,
        services,
        description,
        mapCoords,
        order,
      },
    });

    return jsonResponse(atelier, 201);
  } catch (e) {
    console.error("POST /api/ateliers error:", e);
    return errorResponse("Internal server error", 500);
  }
}
