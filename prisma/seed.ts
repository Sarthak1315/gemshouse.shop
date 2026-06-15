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
  const adminUser = await prisma.user.upsert({
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

  // 3. Clear existing product-related data to avoid unique constraint conflicts
  console.log("Cleaning up existing product-related data...");
  await prisma.inquiryMessage.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 4. Import categories and gemstones
  console.log("Seeding categories and gemstone products...");
  const createdProducts = [];
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
      where: { sku: stone.sku },
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
        sku: stone.sku,
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

    createdProducts.push(product);

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

  // 4. Create Default FAQs
  console.log("Seeding FAQs...");
  await prisma.faq.deleteMany({}); // Reset FAQs

  const defaultFaqs = [
    {
      question: "Can I inspect the gemstone in person prior to final acquisition?",
      answer: "Yes. Viewings can be scheduled at any of our secure client centers, including our main hub in Surat (Diamond Bourse), as well as London, New York, or Geneva. Please contact our concierge team at least 48 hours in advance to arrange a viewing.",
      category: "Acquisition",
      order: 1,
    },
    {
      question: "What secure logistics are used for shipping high-value items?",
      answer: "All acquisitions are shipped via fully-insured, armored courier services (Malca-Amit or Brinks). Shipments are dispatched in tamper-evident sealed packaging, tracked via GPS, and require secure signature verification upon hand-delivery.",
      category: "Acquisition",
      order: 2,
    },
    {
      question: "How do I independently verify the grading certificate?",
      answer: "Every stone is accompanied by a physical grading report from GIA, SSEF, GRS, or Gübelin. You can enter the unique report number printed on the certificate directly into the laboratory's official online database to verify all specs.",
      category: "Acquisition",
      order: 3,
    },
    {
      question: "What is your returns policy for investment-grade gemstones?",
      answer: "Due to the unique, high-value asset class of these natural stones, all sales are final once transit has cleared. To ensure absolute satisfaction, we support secure escrow inspect-on-delivery options prior to releasing funds.",
      category: "Acquisition",
      order: 4,
    },
    {
      question: "Where does Gemshouse source its natural gemstones?",
      answer: "We source our gemstones directly from ethical, independent mine partners in historically significant origins—including Ceylon (Sri Lanka) for royal blue sapphires, Muzo (Colombia) for vibrant emeralds, and Mogok (Burma) for rare pigeon-blood rubies. Every stone is traced from extraction to faceting.",
      category: "Heritage",
      order: 5,
    },
    {
      question: "Are your diamonds fully certified and conflict-free?",
      answer: "Yes. All diamonds sold by Gemshouse are 100% conflict-free, complying strictly with the Kimberley Process certification scheme. Every investment-grade diamond is graded and certified by the Gemological Institute of America (GIA).",
      category: "Heritage",
      order: 6,
    },
    {
      question: "How do I request a private vault viewing?",
      answer: "Private viewings can be arranged through our contact page or by contacting your dedicated client concierge. Viewings are hosted at our high-security depositories in London (Mayfair), New York (Midtown), Geneva (Free-port), or Surat (Diamond Bourse).",
      category: "Heritage",
      order: 7,
    },
    {
      question: "What independent gemological laboratories do you trust?",
      answer: "We verify our stones exclusively with the world's most rigorous gemological authorities, including GIA (Gemological Institute of America), SSEF (Swiss Gemmological Institute), GRS (Gemresearch Swisslab), and Gübelin Gem Lab.",
      category: "Heritage",
      order: 8,
    },
  ];

  for (const faq of defaultFaqs) {
    await prisma.faq.create({
      data: faq,
    });
  }

  // 5. Create Default Reviews
  console.log("Seeding Reviews...");
  await prisma.review.deleteMany({}); // Reset Reviews

  if (createdProducts.length >= 2) {
    await prisma.review.create({
      data: {
        author: "Alistair V.",
        location: "London, UK",
        rating: 5,
        title: "Exquisite Royal Blue Sapphire",
        comment: "The Ceylon sapphire exceeded all expectations. The clarity and cut under studio lighting are mesmerizing. The service from Gemshouse was impeccable.",
        approved: true,
        productId: createdProducts[0].id,
      },
    });

    await prisma.review.create({
      data: {
        author: "Charlotte M.",
        location: "Geneva, CH",
        rating: 5,
        title: "Outstanding Colombia Emerald",
        comment: "A magnificent piece. The description was completely accurate and the Gübelin report was verified instantly.",
        approved: true,
        productId: createdProducts[1].id,
      },
    });
  }

  // 6. Create Blog Categories & Blog Posts
  console.log("Seeding Blogs...");
  await prisma.blog.deleteMany({});
  await prisma.blogCategory.deleteMany({});

  const catEducation = await prisma.blogCategory.create({
    data: { name: "Gemology & Education", slug: "gemology-education" },
  });

  const catHeritage = await prisma.blogCategory.create({
    data: { name: "Heritage & History", slug: "heritage-history" },
  });

  await prisma.blogCategory.create({
    data: { name: "Market Trends", slug: "market-trends" },
  });

  await prisma.blog.create({
    data: {
      title: "Understanding Gemstone Origin & Authenticity",
      slug: "understanding-gemstone-origin-authenticity",
      content: "Origin plays a critical role in the value and prestige of emeralds, rubies, and sapphires. Historically, certain regions have produced stones of exceptional character. In this article, we explore how geographical location affects gemstone trace elements and spectral profiles, and how laboratories like GIA and Gübelin determine origin verification...",
      excerpt: "Why origin plays a critical role in the value and prestige of emeralds, rubies, and sapphires.",
      featuredImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      published: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: catEducation.id,
    },
  });

  await prisma.blog.create({
    data: {
      title: "The Art of Faceting: Precision Craftsmanship",
      slug: "the-art-of-faceting-precision-craftsmanship",
      content: "How expert lapidaries bring out the inner fire and brilliance of raw crystals. Faceting is the delicate balance of mathematics, optics, and intuition. We step inside the ateliers of Surat and Antwerp where master craftsmen transform rough minerals into works of wearable art, analyzing the physics of internal reflection and refractive indices...",
      excerpt: "Inside the ateliers where master craftsmen work to bring out the brilliant fire of raw crystals.",
      featuredImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800",
      published: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: catHeritage.id,
    },
  });

  // 7. Create Default Collections & Links
  console.log("Seeding Collections...");
  await prisma.productCollection.deleteMany({});
  await prisma.collection.deleteMany({});

  const colSignature = await prisma.collection.create({
    data: {
      name: "Signature Sourced",
      slug: "signature-sourced",
      description: "Our finest, hand-selected natural gemstones from legendary origins",
      featured: true,
      order: 1,
    },
  });

  const colBridal = await prisma.collection.create({
    data: {
      name: "Bridal & Diamonds",
      slug: "bridal-diamonds",
      description: "GIA-certified conflict-free diamonds and bespoke ring settings",
      featured: true,
      order: 2,
    },
  });

  const colInvestment = await prisma.collection.create({
    data: {
      name: "Investment Grade",
      slug: "investment-grade",
      description: "Exceptional quality gemstones representing stable, tangible assets",
      featured: true,
      order: 3,
    },
  });

  // Link products to collections
  if (createdProducts.length >= 3) {
    // Signature Sourced
    await prisma.productCollection.create({
      data: { productId: createdProducts[0].id, collectionId: colSignature.id },
    });
    await prisma.productCollection.create({
      data: { productId: createdProducts[1].id, collectionId: colSignature.id },
    });

    // Bridal & Diamonds (the ones that are Diamond)
    const diamond = createdProducts.find(p => p.gemType === "Diamond");
    if (diamond) {
      await prisma.productCollection.create({
        data: { productId: diamond.id, collectionId: colBridal.id },
      });
    }

    // Investment Grade
    await prisma.productCollection.create({
      data: { productId: createdProducts[2].id, collectionId: colInvestment.id },
    });
  }

  // 8. Create Menu Items
  console.log("Seeding Menus...");
  await prisma.menu.deleteMany({});

  const menuItems = [
    { label: "Loose Diamonds", href: "/collections?gemType=Diamond", order: 1 },
    { label: "Gemstones", href: "/collections", order: 2 },
    { label: "Wholesale", href: "/wholesale", order: 3 },
    { label: "Journal", href: "/blogs", order: 4 },
    { label: "About Us", href: "/about", order: 5 },
    { label: "Contact Us", href: "/contact", order: 6 },
  ];

  for (const item of menuItems) {
    await prisma.menu.create({
      data: {
        label: item.label,
        href: item.href,
        order: item.order,
        isActive: true,
      },
    });
  }

  // 9. Create Settings
  console.log("Seeding Settings...");
  await prisma.setting.deleteMany({});

  const settingsData = [
    { key: "CONTACT_PHONE", value: "+91 261 400 9000" },
    { key: "CONTACT_EMAIL", value: "concierge@gemshouse.shop" },
    { key: "WHATSAPP_NUMBER", value: "+919876543210" },
    { key: "INSTAGRAM_URL", value: "https://instagram.com/gemshouse" },
    { key: "FACEBOOK_URL", value: "https://facebook.com/gemshouse" },
    { key: "LINKEDIN_URL", value: "https://linkedin.com/company/gemshouse" },
    { key: "COMPANY_ADDRESS", value: "Surat Diamond Bourse, Surat, Gujarat, India" },
  ];

  for (const setting of settingsData) {
    await prisma.setting.create({
      data: setting,
    });
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
