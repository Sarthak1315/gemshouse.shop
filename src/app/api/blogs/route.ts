import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";
import { getSessionAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published");
    const getCategories = searchParams.get("getCategories");

    // Shortcut to get blog categories
    if (getCategories === "true") {
      const categories = await prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
      });
      return jsonResponse(categories);
    }

    const where: any = {};
    if (category) {
      where.category = {
        slug: category,
      };
    }
    if (published !== null) {
      where.published = published === "true";
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse(blogs);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Auth check: get session admin
    const adminUser = await getSessionAdmin(request);
    if (!adminUser) {
      return errorResponse("Unauthorized access", 401);
    }

    const validation = validators.blog(body);
    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const { title, slug, content, excerpt, featuredImage, categoryId, published } = validation.data;

    // Check unique slug
    const existingSlug = await prisma.blog.findUnique({
      where: { slug },
    });

    let uniqueSlug = slug;
    if (existingSlug) {
      uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        excerpt,
        featuredImage,
        published,
        publishedAt: published ? new Date() : null,
        authorId: adminUser.adminId,
        categoryId,
      },
    });

    return jsonResponse(blog, 201);
  } catch (e) {
    return errorResponse("Internal server error", 500);
  }
}