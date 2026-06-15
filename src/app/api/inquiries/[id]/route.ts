import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return errorResponse("Inquiry not found", 404);
    }

    // Accept status update
    const status = body?.status;
    const allowedStatuses = ["PENDING", "UNDER_NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
    
    if (status && !allowedStatuses.includes(status)) {
      return errorResponse(`Invalid status: must be one of ${allowedStatuses.join(", ")}`, 400);
    }

    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        status: status || existingInquiry.status,
        name: body?.name !== undefined ? String(body.name).trim() : existingInquiry.name,
        email: body?.email !== undefined ? String(body.email).trim() : existingInquiry.email,
        phone: body?.phone !== undefined ? String(body.phone).trim() : existingInquiry.phone,
        message: body?.message !== undefined ? String(body.message).trim() : existingInquiry.message,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            sku: true,
          },
        },
      },
    });

    return jsonResponse(updatedInquiry);
  } catch (e: any) {
    console.error("PUT /api/inquiries/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return errorResponse("Inquiry not found", 404);
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return jsonResponse({ message: "Inquiry deleted successfully" });
  } catch (e: any) {
    console.error("DELETE /api/inquiries/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}
