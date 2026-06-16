import "dotenv/config";
import prisma from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";
import { gemstones } from "../src/lib/data/gemstones";

async function main() {
  console.log("Starting database seed...");

  // 1. Create Default Admin User conditionally
  const adminEmail = "admin@gemshouse.shop";
  const adminPassword = "AdminSecured2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  let adminUser = await prisma.admin.findFirst();
  if (!adminUser) {
    console.log(`Creating default admin user: ${adminEmail}`);
    adminUser = await prisma.admin.create({
      data: {
        name: "Gemshouse Admin",
        email: adminEmail,
        passwordHash,
      },
    });
  } else {
    console.log("Admin user already exists. Skipping creation.");
  }

  // 2. Import categories and gemstones conditionally
  const productCount = await prisma.product.count();
  const createdProducts = [];
  if (productCount === 0) {
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

      // Create Product
      const product = await prisma.product.create({
        data: {
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

      // Insert images
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
  } else {
    console.log("Products table is not empty. Skipping gemstone product seeding.");
    const existingProducts = await prisma.product.findMany();
    createdProducts.push(...existingProducts);
  }

  // 3. Create Default FAQs conditionally
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    console.log("Seeding FAQs...");
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
  } else {
    console.log("FAQs table is not empty. Skipping FAQ seeding.");
  }

  // 4. Create Default Reviews conditionally
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0 && createdProducts.length >= 2) {
    console.log("Seeding Reviews...");
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
  } else {
    console.log("Reviews table is not empty or insufficient products. Skipping review seeding.");
  }

  // 5. Create Blog Categories & Blog Posts conditionally
  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    console.log("Seeding Blogs...");

    let catEducation = await prisma.blogCategory.findUnique({
      where: { slug: "gemology-education" },
    });
    if (!catEducation) {
      catEducation = await prisma.blogCategory.create({
        data: { name: "Gemology & Education", slug: "gemology-education" },
      });
    }

    let catHeritage = await prisma.blogCategory.findUnique({
      where: { slug: "heritage-history" },
    });
    if (!catHeritage) {
      catHeritage = await prisma.blogCategory.create({
        data: { name: "Heritage & History", slug: "heritage-history" },
      });
    }

    let catTrends = await prisma.blogCategory.findUnique({
      where: { slug: "market-trends" },
    });
    if (!catTrends) {
      await prisma.blogCategory.create({
        data: { name: "Market Trends", slug: "market-trends" },
      });
    }

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
  } else {
    console.log("Blogs table is not empty. Skipping blog seeding.");
  }

  // 6. Create Default Collections & Links conditionally
  const collectionCount = await prisma.collection.count();
  if (collectionCount === 0) {
    console.log("Seeding Collections...");
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
      await prisma.productCollection.create({
        data: { productId: createdProducts[0].id, collectionId: colSignature.id },
      });
      await prisma.productCollection.create({
        data: { productId: createdProducts[1].id, collectionId: colSignature.id },
      });

      const diamond = createdProducts.find(p => p.gemType === "Diamond");
      if (diamond) {
        await prisma.productCollection.create({
          data: { productId: diamond.id, collectionId: colBridal.id },
        });
      }

      await prisma.productCollection.create({
        data: { productId: createdProducts[2].id, collectionId: colInvestment.id },
      });
    }
  } else {
    console.log("Collections table is not empty. Skipping collection seeding.");
  }

  // 7. Create Menu Items conditionally
  const menuCount = await prisma.menu.count();
  if (menuCount === 0) {
    console.log("Seeding Menus...");
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
  } else {
    console.log("Menus table is not empty. Skipping menu seeding to protect custom admin structures.");
  }

  // 8. Create Settings conditionally
  console.log("Seeding Settings...");
  const settingsData = [
    { key: "CONTACT_PHONE", value: "+91 261 400 9000" },
    { key: "CONTACT_EMAIL", value: "concierge@gemshouse.shop" },
    { key: "WHATSAPP_NUMBER", value: "+919876543210" },
    { key: "INSTAGRAM_URL", value: "https://instagram.com/gemshouse" },
    { key: "FACEBOOK_URL", value: "https://facebook.com/gemshouse" },
    { key: "LINKEDIN_URL", value: "https://linkedin.com/company/gemshouse" },
    { key: "COMPANY_ADDRESS", value: "Surat Diamond Bourse, Surat, Gujarat, India" },
    { key: "NAV_LOGO_TYPE", value: "text" },
    { key: "NAV_LOGO_TEXT", value: "GEMSHOUSE" },
    { key: "NAV_LOGO_IMAGE", value: "" },
    { key: "COMPANY_GST", value: "24AAAAG1234A1Z1" },
    { key: "FOOTER_ABOUT_TEXT", value: "Purveyors of fine natural gemstones and investment-grade diamonds. Trusted by jewelers, wholesalers, and collectors worldwide." },
    { key: "LEGAL_PRIVACY_POLICY", value: `# Privacy Policy

**Last Updated: June 16, 2026**

At Gemshouse, we value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your personal information when you visit our website or make an inquiry.

## 1. Information We Collect
We collect information you provide directly to us, such as when you fill out contact forms, submit inquiry portfolios, or request wholesale registration:
- Name, email address, phone number.
- Product preferences and interest parameters.

## 2. Secure Operations
All transactions and logistics details are managed under strict security protocols. We do not disclose HNW client listings or private vault arrangements.
` },
    { key: "LEGAL_TERMS_OF_SERVICE", value: `# Terms of Service

**Last Updated: June 16, 2026**

Welcome to Gemshouse. By accessing or utilizing our platform, you agree to comply with and be bound by the following terms and conditions.

## 1. Gemological Certifications
Every investment-grade stone is sold with its verified certification report (GIA, SSEF, GRS, or Gübelin). Spec descriptions on our site represent the official grading logs.

## 2. Acquisition Protocols
Due to the high-value asset class, viewings must be scheduled at least 48 hours in advance at our secure depositories.
` }
  ];

  for (const setting of settingsData) {
    const existing = await prisma.setting.findUnique({
      where: { key: setting.key },
    });
    if (!existing) {
      console.log(`Seeding missing setting key: ${setting.key}`);
      await prisma.setting.create({
        data: setting,
      });
    }
  }

  // 9. Create Ateliers conditionally
  const atelierCount = await prisma.atelier.count();
  if (atelierCount === 0) {
    console.log("Seeding Ateliers...");
    const defaultAteliers = [
      {
        city: "London",
        name: "Mayfair Concierge",
        role: "Headquarters & Private Sourcing",
        phone: "+44 (0) 20 7946 0192",
        address: "Bruton Place, Mayfair, London W1J",
        services: [
          "Bespoke Sourcing Consultations",
          "Wholesale Inventory Inspections",
          "HNW Private Sales Suite",
        ],
        description: "Located in the heart of Mayfair, our London headquarters manages all global logistics and houses our primary private client concierge team.",
        mapCoords: "51.5074° N, 0.1278° W",
        order: 1,
      },
      {
        city: "New York",
        name: "Fifth Avenue Atelier",
        role: "Custom Fine Jewelry Design",
        phone: "+1 (212) 555-0143",
        address: "Fifth Avenue, Midtown Manhattan, NY 10019",
        services: [
          "Custom Fine Jewelry Crafting",
          "3D Model & Gemstone Fitting",
          "Certified Appraisals & Insurances",
        ],
        description: "Our New York atelier features master designers who specialize in setting our loose sapphires, rubies, and diamonds into custom-crafted jewelry masterpieces.",
        mapCoords: "40.7128° N, 74.0060° W",
        order: 2,
      },
      {
        city: "Geneva",
        name: "Swiss Vaults & Logistics",
        role: "Secure Depository & Trading",
        phone: "+41 (0) 22 731 8290",
        address: "Route de Meyrin, Geneva Airport Free-port",
        services: [
          "Swiss Free-port Vault Storage",
          "International Duties Handling",
          "GIA/SSEF Certification Escrow",
        ],
        description: "Partnered with Geneva's highest-security depositories, our Swiss branch manages high-value shipping logistics and secure storage for collectors worldwide.",
        mapCoords: "46.2044° N, 6.1432° E",
        order: 3,
      },
      {
        city: "Surat",
        name: "Surat Cutting & Polishing Center",
        role: "Diamond Cutting, Polishing & Custom Crafting",
        phone: "+91 261 555 0192",
        address: "Surat Diamond Bourse, Khajod, Surat, Gujarat 395007, India",
        services: [
          "Master Diamond Cutting & Faceting",
          "GIA Laboratory Export Preparations",
          "Secure Indian Custody Vaults",
        ],
        description: "Located inside the world-class Surat Diamond Bourse, our state-of-the-art Surat atelier manages precision diamond cutting, lapidary shaping, and security logistics for our Southeast Asian partners.",
        mapCoords: "21.1702° N, 72.8311° E",
        order: 4,
      },
    ];

    for (const atelier of defaultAteliers) {
      await prisma.atelier.create({
        data: atelier,
      });
    }
  } else {
    console.log("Ateliers table is not empty. Skipping atelier seeding.");
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
