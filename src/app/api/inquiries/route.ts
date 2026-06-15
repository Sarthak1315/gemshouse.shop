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
    const type = searchParams.get("inquiryType") || "";
    const userId = searchParams.get("userId") || "";

    const { limit, skip, page } = parsePagination(request.url);

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.inquiryType = type;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { productSkus: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, inquiries] = await prisma.$transaction([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              title: true,
              sku: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isBusinessUser: true,
            },
          },
        },
      }),
    ]);

    return jsonResponse({
      inquiries,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e: any) {
    console.error("GET /api/inquiries error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.inquiry(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    // Optional product validation
    if (data.productId) {
      const product = await prisma.product.findUnique({
        where: { id: data.productId },
      });
      if (!product) {
        return errorResponse("Invalid product selected", 400);
      }
    }

    // Auto-link to existing user if userId is not explicitly provided
    let targetUserId = data.userId;
    if (!targetUserId && data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        targetUserId = existingUser.id;
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        productId: data.productId,
        productSkus: data.productSkus,
        inquiryType: data.inquiryType,
        userId: targetUserId,
        status: data.status,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            sku: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isBusinessUser: true,
          },
        },
      },
    });

    // Seed initial message into the chat thread
    await prisma.inquiryMessage.create({
      data: {
        inquiryId: inquiry.id,
        sender: "CLIENT",
        message: data.message,
        senderId: targetUserId,
      },
    });

    return jsonResponse(inquiry, 201);
  } catch (e: any) {
    console.error("POST /api/inquiries error:", e);
    return errorResponse("Internal server error", 500);
  }
}