"use client";

import React, { useState, useEffect } from "react";
import { uploadFile } from "@/lib/upload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  dealerPrice: number | null;
  gemType: string;
  carat: number;
  color: string | null;
  clarity: string | null;
  cut: string | null;
  origin: string | null;
  certification: string | null;
  certNumber: string | null;
  featured: boolean;
  inStock: boolean;
  categoryId: string;
  description: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
}

export default function InventoryPage() {
  // Lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filtering / Search
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGemType, setSelectedGemType] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDealerPrice, setFormDealerPrice] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formGemType, setFormGemType] = useState("Gemstone");
  const [formCarat, setFormCarat] = useState("");
  const [formCut, setFormCut] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formClarity, setFormClarity] = useState("");
  const [formOrigin, setFormOrigin] = useState("");
  const [formCertification, setFormCertification] = useState("");
  const [formCertNumber, setFormCertNumber] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formInStock, setFormInStock] = useState(true);
  const [formDescription, setFormDescription] = useState("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Categories & Products on start
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed loading categories", err);
      }
    }
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        category: selectedCategory,
        gemType: selectedGemType,
        sortBy,
      });
      if (selectedStock === "true") queryParams.append("inStock", "true");
      if (selectedStock === "false") queryParams.append("inStock", "false");

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalItems(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed loading products", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search, selectedCategory, selectedGemType, selectedStock, sortBy]);

  // Reset page when filters change
  const handleFilterChange = (filterSetter: Function, value: string) => {
    filterSetter(value);
    setPage(1);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploadLoading(true);
    setErrorMsg(null);
    try {
      const uploaded = await uploadFile(files[0]);
      setFormImages((prev) => [...prev, uploaded.url]);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setActiveProductId(null);
    setErrorMsg(null);

    // Reset fields
    setFormTitle("");
    setFormSku("");
    setFormPrice("");
    setFormDealerPrice("");
    setFormCategoryId(categories[0]?.id || "");
    setFormGemType("Gemstone");
    setFormCarat("");
    setFormCut("");
    setFormColor("");
    setFormClarity("");
    setFormOrigin("");
    setFormCertification("");
    setFormCertNumber("");
    setFormFeatured(false);
    setFormInStock(true);
    setFormDescription("");
    setFormImages([]);

    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode("edit");
    setActiveProductId(product.id);
    setErrorMsg(null);

    // Populate fields
    setFormTitle(product.title);
    setFormSku(product.sku);
    setFormPrice(String(product.price));
    setFormDealerPrice(product.dealerPrice ? String(product.dealerPrice) : "");
    setFormCategoryId(product.categoryId);
    setFormGemType(product.gemType);
    setFormCarat(String(product.carat));
    setFormCut(product.cut || "");
    setFormColor(product.color || "");
    setFormClarity(product.clarity || "");
    setFormOrigin(product.origin || "");
    setFormCertification(product.certification || "");
    setFormCertNumber(product.certNumber || "");
    setFormFeatured(product.featured);
    setFormInStock(product.inStock);
    setFormDescription(product.description);
    setFormImages(product.images.map((img) => img.url));

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formCategoryId) {
      setErrorMsg("Please select a category");
      return;
    }

    const payload = {
      title: formTitle,
      sku: formSku,
      price: parseFloat(formPrice),
      dealerPrice: formDealerPrice ? parseFloat(formDealerPrice) : null,
      categoryId: formCategoryId,
      gemType: formGemType,
      carat: parseFloat(formCarat),
      cut: formCut || null,
      color: formColor || null,
      clarity: formClarity || null,
      origin: formOrigin || null,
      certification: formCertification || null,
      certNumber: formCertNumber || null,
      featured: formFeatured,
      inStock: formInStock,
      description: formDescription,
      images: formImages,
    };

    try {
      const url = modalMode === "create" ? "/api/products" : `/api/products/${activeProductId}`;
      const method = modalMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save product");
        return;
      }

      setSuccessMsg(
        modalMode === "create" ? "Product added successfully!" : "Product updated successfully!"
      );
      setIsModalOpen(false);
      loadProducts();

      // Clear success alert after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("An error occurred while saving.");
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you certain you want to delete product '${product.title}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete product");
        return;
      }

      setSuccessMsg("Product deleted successfully!");
      loadProducts();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete product");
    }
  };

  return (
    <div className="w-full">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Product Catalog
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Inventory Management
          </h1>
        </div>
        <div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow"
          >
            <span className="material-symbols-outlined text-base select-none">add</span>
            Add Gemstone
          </button>
        </div>
      </div>

      {/* Alert overlays */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6 bg-surface-container-lowest p-4 border border-outline-variant/20 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant select-none">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-transparent border-b border-outline-variant/40 focus:border-emerald-deep focus:ring-0 focus:outline-none text-xs font-body-md text-emerald-deep placeholder-outline-variant rounded-none"
              placeholder="Search by SKU, Name, Origin..."
            />
          </div>

          <div className="h-6 w-[0.5px] bg-outline-variant/30 hidden sm:block"></div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Gem Type Filter */}
          <select
            value={selectedGemType}
            onChange={(e) => handleFilterChange(setSelectedGemType, e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none"
          >
            <option value="">All Gem Types</option>
            <option value="Gemstone">Loose Gemstones</option>
            <option value="Diamond">Fancy Diamonds</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => handleFilterChange(setSelectedStock, e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none"
          >
            <option value="">All Statuses</option>
            <option value="true">Available</option>
            <option value="false">Sold</option>
          </select>
        </div>

        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-emerald-deep focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="carat-high">Carat: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/55">
                <th className="py-4 px-5 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Image
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  SKU
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Gemstone Product
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Weight (ct)
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Origin
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Cert
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Price (USD)
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold text-center">
                  Status
                </th>
                <th className="py-4 px-5 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-xs font-body-md text-on-surface divide-y divide-outline-variant/10">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-on-surface-variant/60 font-semibold">
                    Loading gemstones inventory...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => {
                  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-surface-container-low/25 transition-all duration-150"
                    >
                      <td className="py-3.5 px-5">
                        <div className="w-12 h-12 bg-charcoal/10 overflow-hidden border border-outline-variant/15 flex items-center justify-center">
                          {primaryImage ? (
                            <img
                              alt={product.title}
                              className="w-full h-full object-cover"
                              src={primaryImage.url}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-outline-variant select-none">
                              image
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-on-surface-variant">
                        {product.sku}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-deep">
                        {product.title}
                        <span className="block text-[10px] text-on-surface-variant/65 font-normal tracking-wide uppercase mt-0.5">
                          {product.category.name} • {product.gemType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-on-surface">
                        {product.carat} ct
                        {product.cut && (
                          <span className="block text-[10px] text-on-surface-variant/65 font-normal">
                            {product.cut}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant font-medium">
                        {product.origin || "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        {product.certification ? (
                          <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant/20 rounded-none font-label-caps text-[9px] uppercase tracking-wider font-bold">
                            {product.certification}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/40">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-deep">
                        ${Number(product.price).toLocaleString()}
                        {product.dealerPrice && (
                          <span className="block text-[9px] text-amber-600 font-normal mt-0.5">
                            B2B: ${Number(product.dealerPrice).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-label-caps uppercase tracking-wider font-semibold ${
                            product.inStock
                              ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-600"
                              : "bg-red-500/10 border-red-500/15 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              product.inStock ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          ></span>
                          {product.inStock ? "Available" : "Sold"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-on-surface-variant hover:text-emerald-deep transition-colors p-1 cursor-pointer"
                          title="Edit Details"
                        >
                          <span className="material-symbols-outlined text-lg select-none">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-on-surface-variant hover:text-red-600 transition-colors p-1 cursor-pointer"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-lg select-none">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-on-surface-variant/50">
                    No matching gemstones found in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low/20 flex items-center justify-between">
            <div className="font-body-md text-xs text-on-surface-variant">
              Showing Page <span className="font-bold text-on-surface">{page}</span> of{" "}
              <span className="font-bold text-on-surface">{totalPages}</span> ({totalItems} total items)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-outline-variant/35 rounded-none text-outline hover:text-emerald-deep hover:border-emerald-deep/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-base select-none">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                const isSelected = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center font-label-caps text-xs transition-colors rounded-none cursor-pointer ${
                      isSelected
                        ? "bg-emerald-deep text-linen-white font-bold"
                        : "hover:bg-surface-container-low text-on-surface"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-outline-variant/35 rounded-none text-outline hover:text-emerald-deep hover:border-emerald-deep/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-base select-none">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {modalMode === "create" ? "Add New Gemstone Product" : "Edit Gemstone Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Royal Blue Ceylon Sapphire"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Unique SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. CSR-001"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Storefront Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer"
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Gem Type Grouping *
                  </label>
                  <select
                    value={formGemType}
                    onChange={(e) => setFormGemType(e.target.value)}
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer"
                  >
                    <option value="Gemstone">Loose Gemstone</option>
                    <option value="Diamond">Fancy Diamond</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 28000"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Wholesale B2B Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formDealerPrice}
                    onChange={(e) => setFormDealerPrice(e.target.value)}
                    placeholder="e.g. 23800"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
              </div>

              {/* Gemstone Specifications Section */}
              <div className="border-t border-outline-variant/20 pt-6">
                <h4 className="font-headline-sm text-xs text-emerald-deep font-semibold tracking-wide uppercase mb-4">
                  Gemological Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Carat Weight *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={formCarat}
                      onChange={(e) => setFormCarat(e.target.value)}
                      placeholder="e.g. 4.12"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Facet Cut / Shape
                    </label>
                    <input
                      type="text"
                      value={formCut}
                      onChange={(e) => setFormCut(e.target.value)}
                      placeholder="e.g. Oval Cushion"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Authentic Origin
                    </label>
                    <input
                      type="text"
                      value={formOrigin}
                      onChange={(e) => setFormOrigin(e.target.value)}
                      placeholder="e.g. Sri Lanka (Ceylon)"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Color Grade
                    </label>
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      placeholder="e.g. Vivid Blue"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Clarity Rating
                    </label>
                    <input
                      type="text"
                      value={formClarity}
                      onChange={(e) => setFormClarity(e.target.value)}
                      placeholder="e.g. Eye Clean"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Grading Lab Certificate
                    </label>
                    <input
                      type="text"
                      value={formCertification}
                      onChange={(e) => setFormCertification(e.target.value)}
                      placeholder="e.g. GRS"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Certificate Report Number
                    </label>
                    <input
                      type="text"
                      value={formCertNumber}
                      onChange={(e) => setFormCertNumber(e.target.value)}
                      placeholder="e.g. GRS-2026-89421"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Flags */}
              <div className="border-t border-outline-variant/20 pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                      Extended Editorial Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Write an elegant provenance history and visual characteristics..."
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    ></textarea>
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                      />
                      <span className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                        Feature on Homepage
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formInStock}
                        onChange={(e) => setFormInStock(e.target.checked)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                      />
                      <span className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                        Item Available In Stock
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="border-t border-outline-variant/20 pt-6">
                <h4 className="font-headline-sm text-xs text-emerald-deep font-semibold tracking-wide uppercase mb-3">
                  Product Image Gallery
                </h4>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* Add Image URL */}
                    <div className="flex-1 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              setFormImages((prev) => [...prev, val]);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                      />
                    </div>
                    <div className="font-label-caps text-[9px] text-on-surface-variant/50 uppercase">Or</div>
                    {/* File Upload Button */}
                    <div>
                      <label className="px-4 py-2 border border-champagne-gold text-emerald-deep hover:bg-champagne-gold/10 font-label-caps text-[10px] uppercase tracking-widest cursor-pointer inline-flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-sm select-none">upload</span>
                        {imageUploadLoading ? "Uploading..." : "Upload File"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={imageUploadLoading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Previews */}
                  {formImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 border border-outline-variant/20 p-4 bg-surface-container-low/20">
                      {formImages.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square border border-outline-variant/30 group bg-charcoal/5"
                        >
                          <img
                            alt={`Product preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            src={url}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-linen-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-colors shadow cursor-pointer border border-linen-white"
                          >
                            <span className="material-symbols-outlined text-[10px] select-none">close</span>
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 left-0 right-0 text-center bg-emerald-deep/90 text-linen-white text-[8px] font-label-caps uppercase tracking-wider py-0.5">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-outline-variant/15 pt-6 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer transition-colors shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}