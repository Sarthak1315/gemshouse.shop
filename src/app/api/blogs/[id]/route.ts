import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
        },
      },
    });

    if (!blog) {
      return errorResponse("Blog post not found", 404);
    }

    return jsonResponse(blog);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = validators.blog(body);

    if (!validation.success) {
      return errorResponse("Validation failed", 400);
    }

    const { title, slug, content, excerpt, featuredImage, categoryId, published } = validation.data;

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return errorResponse("Blog post not found", 404);
    }

    // Check unique slug if changed
    if (slug !== blog.slug) {
      const existingSlug = await prisma.blog.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        return errorResponse("Blog slug already exists", 409);
      }
    }

    // Determine publishedAt date transitions
    let publishedAt = blog.publishedAt;
    if (published && !blog.published) {
      publishedAt = new Date();
    } else if (!published) {
      publishedAt = null;
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        published,
        publishedAt,
        categoryId,
      },
    });

    return jsonResponse(updated);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return errorResponse("Blog post not found", 404);
    }

    await prisma.blog.delete({
      where: { id },
    });

    return jsonResponse({ success: true, message: "Blog post deleted successfully" });
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}
