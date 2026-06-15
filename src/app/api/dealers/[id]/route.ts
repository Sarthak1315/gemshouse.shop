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

    const existingDealer = await prisma.dealer.findUnique({
      where: { id },
    });

    if (!existingDealer) {
      return errorResponse("Dealer not found", 404);
    }

    const status = body?.status;
    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];
    
    if (status && !allowedStatuses.includes(status)) {
      return errorResponse(`Invalid status: must be one of ${allowedStatuses.join(", ")}`, 400);
    }

    const updatedDealer = await prisma.dealer.update({
      where: { id },
      data: {
        status: status || existingDealer.status,
        companyName: body?.companyName !== undefined ? String(body.companyName).trim() : existingDealer.companyName,
        taxId: body?.taxId !== undefined ? String(body.taxId).trim() : existingDealer.taxId,
        website: body?.website !== undefined ? String(body.website).trim() : existingDealer.website,
        address: body?.address !== undefined ? String(body.address).trim() : existingDealer.address,
        businessType: body?.businessType !== undefined ? String(body.businessType).trim() : existingDealer.businessType,
      },
    });

    return jsonResponse(updatedDealer);
  } catch (e: any) {
    console.error("PUT /api/dealers/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingDealer = await prisma.dealer.findUnique({
      where: { id },
    });

    if (!existingDealer) {
      return errorResponse("Dealer not found", 404);
    }

    await prisma.dealer.delete({
      where: { id },
    });

    return jsonResponse({ message: "Dealer deleted successfully" });
  } catch (e: any) {
    console.error("DELETE /api/dealers/[id] error:", e);
    return errorResponse("Internal server error", 500);
  }
}
