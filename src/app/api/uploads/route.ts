import { NextRequest } from "next/server";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("File size exceeds 5MB limit", 400);
    }

    // Validate type (images only)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed.", 400);
    }

    // Convert file to array buffer and buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filename = `${timestamp}_${random}_${sanitizedName}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    await fs.writeFile(filePath, buffer);

    // Return public url
    const fileUrl = `/uploads/${filename}`;
    return jsonResponse({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
    }, 201);
  } catch (e: any) {
    console.error("Upload error:", e);
    return errorResponse("File upload failed", 500);
  }
}