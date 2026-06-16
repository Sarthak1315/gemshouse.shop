export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationResult<T> =
  | { success: true; data: T; errors?: never }
  | { success: false; errors: ValidationError[]; data?: never };

function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

export const validators = {
  login(body: any): ValidationResult<{ email: string; passwordHashOrPlain: string }> {
    const errors: ValidationError[] = [];
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");

    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!isEmail(email)) errors.push({ field: "email", message: "Invalid email format" });

    if (!password) errors.push({ field: "password", message: "Password is required" });

    if (errors.length > 0) return { success: false, errors };
    return { success: true, data: { email, passwordHashOrPlain: password } };
  },

  product(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    const sku = String(body?.sku || "").trim();
    const price = parseFloat(body?.price);
    const dealerPrice = body?.dealerPrice ? parseFloat(body?.dealerPrice) : null;
    const gemType = String(body?.gemType || "Gemstone").trim();
    const carat = parseFloat(body?.carat);
    const categoryId = String(body?.categoryId || "").trim();

    if (!title) errors.push({ field: "title", message: "Title is required" });
    if (!description) errors.push({ field: "description", message: "Description is required" });
    if (!sku) errors.push({ field: "sku", message: "SKU is required" });
    if (isNaN(price) || price <= 0) errors.push({ field: "price", message: "Price must be a positive number" });
    if (!categoryId) errors.push({ field: "categoryId", message: "Category ID is required" });
    if (isNaN(carat) || carat <= 0) errors.push({ field: "carat", message: "Carat must be a positive number" });
    if (gemType !== "Gemstone" && gemType !== "Diamond") {
      errors.push({ field: "gemType", message: "Gem type must be 'Gemstone' or 'Diamond'" });
    }

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        title,
        description,
        sku,
        price,
        dealerPrice,
        gemType,
        carat,
        categoryId,
        color: body?.color ? String(body.color).trim() : null,
        clarity: body?.clarity ? String(body.clarity).trim() : null,
        cut: body?.cut ? String(body.cut).trim() : null,
        origin: body?.origin ? String(body.origin).trim() : null,
        certification: body?.certification ? String(body.certification).trim() : null,
        certNumber: body?.certNumber ? String(body.certNumber).trim() : null,
        featured: Boolean(body?.featured),
        inStock: body?.inStock !== undefined ? Boolean(body.inStock) : true,
      },
    };
  },

  category(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const name = String(body?.name || "").trim();
    const slug = String(body?.slug || "").trim();

    if (!name) errors.push({ field: "name", message: "Name is required" });
    if (!slug) errors.push({ field: "slug", message: "Slug is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        name,
        slug,
        description: body?.description ? String(body.description).trim() : null,
        image: body?.image ? String(body.image).trim() : null,
      },
    };
  },

  collection(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const name = String(body?.name || "").trim();
    const slug = String(body?.slug || "").trim();

    if (!name) errors.push({ field: "name", message: "Name is required" });
    if (!slug) errors.push({ field: "slug", message: "Slug is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        name,
        slug,
        description: body?.description ? String(body.description).trim() : null,
        imageUrl: body?.imageUrl ? String(body.imageUrl).trim() : null,
        featured: Boolean(body?.featured),
        order: body?.order !== undefined ? parseInt(body.order, 10) : 0,
      },
    };
  },

  review(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const author = String(body?.author || "").trim();
    const rating = parseInt(body?.rating, 10);
    const title = String(body?.title || "").trim();
    const comment = String(body?.comment || "").trim();

    if (!author) errors.push({ field: "author", message: "Author is required" });
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push({ field: "rating", message: "Rating must be between 1 and 5" });
    }
    if (!title) errors.push({ field: "title", message: "Title is required" });
    if (!comment) errors.push({ field: "comment", message: "Comment is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        author,
        rating,
        title,
        comment,
        location: body?.location ? String(body.location).trim() : null,
        productId: body?.productId ? String(body.productId).trim() : null,
        approved: Boolean(body?.approved),
      },
    };
  },

  faq(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const question = String(body?.question || "").trim();
    const answer = String(body?.answer || "").trim();
    const category = String(body?.category || "Acquisition").trim();

    if (!question) errors.push({ field: "question", message: "Question is required" });
    if (!answer) errors.push({ field: "answer", message: "Answer is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        question,
        answer,
        category,
        order: body?.order !== undefined ? parseInt(body.order, 10) : 0,
        productId: body?.productId ? String(body.productId).trim() : null,
      },
    };
  },

  inquiry(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name) errors.push({ field: "name", message: "Name is required" });
    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!isEmail(email)) errors.push({ field: "email", message: "Invalid email format" });
    if (!message) errors.push({ field: "message", message: "Message is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        name,
        email,
        phone: body?.phone ? String(body.phone).trim() : null,
        message,
        productId: body?.productId ? String(body.productId).trim() : null,
        productSkus: body?.productSkus ? String(body.productSkus).trim() : null,
        inquiryType: body?.inquiryType ? String(body.inquiryType).trim() : "DIRECT",
        userId: body?.userId ? String(body.userId).trim() : null,
        status: body?.status ? String(body.status).trim() : "PENDING",
      },
    };
  },

  register(body: any): ValidationResult<{ name: string; email: string; passwordHashOrPlain: string; isBusinessUser: boolean }> {
    const errors: ValidationError[] = [];
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const password = String(body?.password || "");
    const isBusinessUser = Boolean(body?.isBusinessUser);

    if (!name) errors.push({ field: "name", message: "Name is required" });
    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!isEmail(email)) errors.push({ field: "email", message: "Invalid email format" });
    
    if (!password) errors.push({ field: "password", message: "Password is required" });
    else if (password.length < 6) errors.push({ field: "password", message: "Password must be at least 6 characters" });

    if (errors.length > 0) return { success: false, errors };
    return { success: true, data: { name, email, passwordHashOrPlain: password, isBusinessUser } };
  },

  inquiryMessage(body: any): ValidationResult<{ inquiryId: string; sender: string; message: string; senderId?: string | null }> {
    const errors: ValidationError[] = [];
    const inquiryId = String(body?.inquiryId || "").trim();
    const sender = String(body?.sender || "").trim();
    const message = String(body?.message || "").trim();

    if (!inquiryId) errors.push({ field: "inquiryId", message: "Inquiry ID is required" });
    if (!sender) errors.push({ field: "sender", message: "Sender type is required" });
    else if (sender !== "CLIENT" && sender !== "ADMIN") {
      errors.push({ field: "sender", message: "Sender must be 'CLIENT' or 'ADMIN'" });
    }
    if (!message) errors.push({ field: "message", message: "Message cannot be empty" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        inquiryId,
        sender,
        message,
        senderId: body?.senderId ? String(body.senderId).trim() : null,
      },
    };
  },

  dealer(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const companyName = String(body?.companyName || "").trim();

    if (!companyName) errors.push({ field: "companyName", message: "Company name is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        companyName,
        taxId: body?.taxId ? String(body.taxId).trim() : null,
        website: body?.website ? String(body.website).trim() : null,
        address: body?.address ? String(body.address).trim() : null,
        businessType: body?.businessType ? String(body.businessType).trim() : null,
        status: body?.status ? String(body.status).trim() : "PENDING",
      },
    };
  },

  blog(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const title = String(body?.title || "").trim();
    const content = String(body?.content || "").trim();
    const categoryId = String(body?.categoryId || "").trim();

    if (!title) errors.push({ field: "title", message: "Title is required" });
    if (!content) errors.push({ field: "content", message: "Content is required" });
    if (!categoryId) errors.push({ field: "categoryId", message: "Category ID is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        title,
        content,
        categoryId,
        slug: body?.slug ? String(body.slug).trim() : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        excerpt: body?.excerpt ? String(body.excerpt).trim() : null,
        featuredImage: body?.featuredImage ? String(body.featuredImage).trim() : null,
        published: Boolean(body?.published),
      },
    };
  },

  user(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();

    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!isEmail(email)) errors.push({ field: "email", message: "Invalid email format" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        name: name || null,
        email,
        isBusinessUser: body?.isBusinessUser !== undefined ? Boolean(body.isBusinessUser) : undefined,
        password: body?.password ? String(body.password) : undefined,
      },
    };
  },

  menu(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const label = String(body?.label || "").trim();
    const href = String(body?.href || "").trim();

    if (!label) errors.push({ field: "label", message: "Label is required" });
    if (!href) errors.push({ field: "href", message: "Href is required" });

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        label,
        href,
        order: body?.order !== undefined ? parseInt(body.order, 10) : 0,
        isActive: body?.isActive !== undefined ? Boolean(body.isActive) : true,
        parentMenuId: body?.parentMenuId ? String(body.parentMenuId).trim() : null,
      },
    };
  },

  atelier(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const city = String(body?.city || "").trim();
    const name = String(body?.name || "").trim();
    const role = String(body?.role || "").trim();
    const phone = String(body?.phone || "").trim();
    const address = String(body?.address || "").trim();
    const description = String(body?.description || "").trim();
    const mapCoords = String(body?.mapCoords || "").trim();
    const order = body?.order !== undefined ? parseInt(body.order, 10) : 0;

    let services: string[] = [];
    if (Array.isArray(body?.services)) {
      services = body.services.map((s: any) => String(s || "").trim()).filter(Boolean);
    } else if (typeof body?.services === "string") {
      services = body.services.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }

    if (!city) errors.push({ field: "city", message: "City is required" });
    if (!name) errors.push({ field: "name", message: "Name is required" });
    if (!role) errors.push({ field: "role", message: "Role is required" });
    if (!phone) errors.push({ field: "phone", message: "Phone is required" });
    if (!address) errors.push({ field: "address", message: "Address is required" });
    if (!description) errors.push({ field: "description", message: "Description is required" });
    if (!mapCoords) errors.push({ field: "mapCoords", message: "Map coordinates are required" });
    if (services.length === 0) {
      errors.push({ field: "services", message: "At least one service is required" });
    }

    if (errors.length > 0) return { success: false, errors };
    return {
      success: true,
      data: {
        city,
        name,
        role,
        phone,
        address,
        services,
        description,
        mapCoords,
        order: isNaN(order) ? 0 : order,
      },
    };
  },

  subscriber(body: any): ValidationResult<any> {
    const errors: ValidationError[] = [];
    const email = String(body?.email || "").trim();

    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!isEmail(email)) errors.push({ field: "email", message: "Invalid email format" });

    if (errors.length > 0) return { success: false, errors };
    return { success: true, data: { email } };
  },
};

export const schemas = {};