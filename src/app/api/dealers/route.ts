import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse, parsePagination } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const { limit, skip, page } = parsePagination(request.url);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { taxId: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { businessType: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, dealers] = await prisma.$transaction([
      prisma.dealer.count({ where }),
      prisma.dealer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return jsonResponse({
      dealers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e: any) {
    console.error("GET /api/dealers error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.dealer(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    const dealer = await prisma.dealer.create({
      data: {
        companyName: data.companyName,
        taxId: data.taxId,
        website: data.website,
        address: data.address,
        businessType: data.businessType,
        status: data.status,
      },
    });

    return jsonResponse(dealer, 201);
  } catch (e: any) {
    console.error("POST /api/dealers error:", e);
    return errorResponse("Internal server error", 500);
  }
}