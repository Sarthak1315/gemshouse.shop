import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, jsonResponse, parsePagination } from "@/lib/api-helpers";
import { validators } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const gemType = searchParams.get("gemType") || "";
    const inStock = searchParams.get("inStock");
    const sortBy = searchParams.get("sortBy") || "newest";

    const { limit, skip, page } = parsePagination(request.url);

    // Build Prisma query filters
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { origin: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (gemType) {
      where.gemType = gemType;
    }

    if (inStock !== null) {
      where.inStock = inStock === "true";
    }

    // Sort order
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price-high") {
      orderBy = { price: "desc" };
    } else if (sortBy === "price-low") {
      orderBy = { price: "asc" };
    } else if (sortBy === "carat-high") {
      orderBy = { carat: "desc" };
    }

    // Query DB
    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: true,
          category: true,
        },
      }),
    ]);

    return jsonResponse({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e: any) {
    console.error("GET /api/products error:", e);
    return errorResponse("Internal server error", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validators.product(body);

    if (!validation.success) {
      return errorResponse("Validation failed: " + JSON.stringify(validation.errors), 400);
    }

    const data = validation.data;

    // Check unique SKU
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingSku) {
      return errorResponse(`Product with SKU '${data.sku}' already exists`, 409);
    }

    // Generate product slug
    const productSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug is unique, append timestamp if not
    let slug = productSlug;
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      slug = `${productSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        price: data.price,
        dealerPrice: data.dealerPrice,
        sku: data.sku,
        gemType: data.gemType,
        carat: data.carat,
        color: data.color,
        clarity: data.clarity,
        cut: data.cut,
        origin: data.origin,
        certification: data.certification,
        certNumber: data.certNumber,
        featured: data.featured,
        inStock: data.inStock,
        categoryId: data.categoryId,
      },
    });

    // Create product images if provided in body.images
    if (body.images && Array.isArray(body.images)) {
      for (let i = 0; i < body.images.length; i++) {
        await prisma.productImage.create({
          data: {
            url: String(body.images[i]),
            isPrimary: i === 0,
            productId: product.id,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
      },
    });

    return jsonResponse(fullProduct, 201);
  } catch (e: any) {
    console.error("POST /api/products error:", e);
    return errorResponse("Internal server error", 500);
  }
}