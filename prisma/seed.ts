import "dotenv/config";
import prisma from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";
import { gemstones } from "../src/lib/data/gemstones";

async function main() {
  console.log("Starting database seed...");

  // 1. Create Roles
  console.log("Upserting user roles...");
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "System Administrator with full access",
    },
  });

  const dealerRole = await prisma.role.upsert({
    where: { name: "DEALER" },
    update: {},
    create: {
      name: "DEALER",
      description: "Verified B2B wholesale partner",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Standard registered customer",
    },
  });

  // 2. Create Default Admin User
  const adminEmail = "admin@gemshouse.shop";
  const adminPassword = "AdminSecured2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  console.log(`Upserting default admin user: ${adminEmail}`);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      roleId: adminRole.id,
    },
    create: {
      name: "Gemshouse Admin",
      email: adminEmail,
      passwordHash,
      roleId: adminRole.id,
    },
  });

  // 3. Import categories and gemstones
  console.log("Seeding categories and gemstone products...");
  for (const stone of gemstones) {
    const categoryName = stone.category;
    const categorySlug = categoryName.toLowerCase();

    // Upsert Category
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        slug: categorySlug,
        description: `Exquisite natural ${categoryName} selection`,
      },
    });

    // Generate product slug
    const productSlug = stone.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Upsert Product
    const product = await prisma.product.upsert({
      where: { sku: stone.id },
      update: {
        title: stone.title,
        description: stone.extendedDescription,
        price: stone.price,
        dealerPrice: stone.price * 0.85, // B2B discount approximation
        gemType: stone.category === "Diamond" ? "Diamond" : "Gemstone",
        carat: stone.carat,
        color: stone.category === "Diamond" ? "D" : stone.category,
        clarity: stone.clarity,
        cut: stone.cut,
        origin: stone.origin,
        certification: stone.certificate,
        certNumber: stone.reportNumber,
        categoryId: category.id,
      },
      create: {
        sku: stone.id,
        title: stone.title,
        slug: productSlug,
        description: stone.extendedDescription,
        price: stone.price,
        dealerPrice: stone.price * 0.85,
        gemType: stone.category === "Diamond" ? "Diamond" : "Gemstone",
        carat: stone.carat,
        color: stone.category === "Diamond" ? "D" : stone.category,
        clarity: stone.clarity,
        cut: stone.cut,
        origin: stone.origin,
        certification: stone.certificate,
        certNumber: stone.reportNumber,
        categoryId: category.id,
      },
    });

    // Delete existing images for this product before re-inserting to avoid duplicate primary image issues
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    // Insert new images
    for (let i = 0; i < stone.images.length; i++) {
      const imgUrl = stone.images[i];
      await prisma.productImage.create({
        data: {
          url: imgUrl,
          isPrimary: i === 0,
          productId: product.id,
        },
      });
    }
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
