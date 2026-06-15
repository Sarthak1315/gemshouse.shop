"use client";

import React, { useState, useEffect } from "react";
import { uploadFile } from "@/lib/upload";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  _count: {
    products: number;
  };
}

interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isProductsDrawerOpen, setIsProductsDrawerOpen] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formOrder, setFormOrder] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [addProductId, setAddProductId] = useState("");

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/collections");
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (err) {
      console.error("Failed loading collections", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      if (res.ok) {
        const data = await res.json();
        setAllProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed loading all products", err);
    }
  };

  useEffect(() => {
    loadCollections();
    loadAllProducts();
  }, []);

  const handleNameChange = (nameVal: string) => {
    setFormName(nameVal);
    if (formMode === "create") {
      setFormSlug(
        nameVal
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploadLoading(true);
    setErrorMsg(null);
    try {
      const uploaded = await uploadFile(files[0]);
      setFormImageUrl(uploaded.url);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload image");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormMode("create");
    setActiveId(null);
    setErrorMsg(null);

    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("");
    setFormFeatured(false);
    setFormOrder("0");

    setIsFormOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setFormMode("edit");
    setActiveId(col.id);
    setErrorMsg(null);

    setFormName(col.name);
    setFormSlug(col.slug);
    setFormDescription(col.description || "");
    setFormImageUrl(col.imageUrl || "");
    setFormFeatured(col.featured);
    setFormOrder(String(col.order));

    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      name: formName,
      slug: formSlug,
      description: formDescription || null,
      imageUrl: formImageUrl || null,
      featured: formFeatured,
      order: parseInt(formOrder || "0", 10),
    };

    try {
      const url = formMode === "create" ? "/api/collections" : `/api/collections/${activeId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save collection");
        return;
      }

      setSuccessMsg("Collection saved successfully!");
      setIsFormOpen(false);
      loadCollections();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error saving collection");
    }
  };

  const handleDelete = async (col: Collection) => {
    if (!confirm(`Are you certain you want to delete collection '${col.name}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/collections/${col.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete");
        return;
      }

      setSuccessMsg("Collection deleted successfully!");
      loadCollections();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete collection");
    }
  };

  // Link products management
  const openProductsDrawer = async (col: Collection) => {
    setSelectedCollection(col);
    setAddProductId("");
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/collections/${col.id}`);
      if (res.ok) {
        const data = await res.json();
        setCollectionProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed loading collection products", err);
    }
    setIsProductsDrawerOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addProductId || !selectedCollection) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/collections/${selectedCollection.id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: addProductId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to add product");
        return;
      }

      // Reload
      const prod = allProducts.find((p) => p.id === addProductId);
      if (prod && !collectionProducts.some((p) => p.id === addProductId)) {
        setCollectionProducts((prev) => [...prev, prod]);
      }
      setAddProductId("");
      loadCollections(); // Update product count in list
    } catch (err) {
      setErrorMsg("Failed to link product");
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    if (!selectedCollection) return;

    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/collections/${selectedCollection.id}/products?productId=${productId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to remove product");
        return;
      }

      setCollectionProducts((prev) => prev.filter((p) => p.id !== productId));
      loadCollections();
    } catch (err) {
      setErrorMsg("Failed to unlink product");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Showcase management
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Curated Collections
          </h1>
        </div>
        <div>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow"
          >
            <span className="material-symbols-outlined text-base select-none">add</span>
            Create Collection
          </button>
        </div>
      </div>

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

      {/* Grid of collections */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading collections...
        </div>
      ) : collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Header Image */}
                <div className="aspect-[16/7] w-full bg-charcoal/5 relative overflow-hidden border-b border-outline-variant/15">
                  {col.imageUrl ? (
                    <img alt={col.name} className="w-full h-full object-cover" src={col.imageUrl} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-label-caps text-on-surface-variant/40 uppercase">
                      No Showcase Image
                    </div>
                  )}
                  {col.featured && (
                    <span className="absolute top-3 left-3 bg-champagne-gold text-charcoal font-label-caps text-[8px] uppercase tracking-widest px-2 py-0.5 border border-linen-white/30 font-semibold shadow-sm">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-headline-sm text-base text-emerald-deep font-bold mb-1">
                    {col.name}
                  </h3>
                  <p className="font-mono text-[10px] text-on-surface-variant/70 mb-3">{col.slug}</p>
                  <p className="font-body-md text-xs text-on-surface-variant/85 line-clamp-2 leading-relaxed">
                    {col.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Footer specs & actions */}
              <div className="px-5 py-4 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low/10">
                <div className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                  <span>Order: {col.order}</span>
                  <span className="mx-2">•</span>
                  <button
                    onClick={() => openProductsDrawer(col)}
                    className="text-emerald-deep hover:underline cursor-pointer font-bold"
                  >
                    {col._count.products} Products
                  </button>
                </div>
                <div className="space-x-1.5">
                  <button
                    onClick={() => openEditModal(col)}
                    className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                    title="Edit Collection"
                  >
                    <span className="material-symbols-outlined text-base select-none">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(col)}
                    className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base select-none">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            folder_open
          </span>
          <p className="text-on-surface-variant text-sm">No curated collections registered yet.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {formMode === "create" ? "Create Collection Showcase" : "Edit Showcase Details"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Showcase Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Signature Sourced"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Collection Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. signature-sourced"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Sort Index Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
                <div className="flex items-end pb-3 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                    />
                    <span className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                      Featured Showcase
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Featured Header Image
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="Paste image URL or upload file..."
                    className="flex-grow bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                  <label className="px-3 py-2 border border-champagne-gold text-emerald-deep hover:bg-champagne-gold/10 font-label-caps text-[9px] uppercase tracking-widest cursor-pointer transition-colors shrink-0">
                    {imageUploadLoading ? "..." : "Upload"}
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

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Introduce the theme or exclusivity of this collection..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                ></textarea>
              </div>

              <div className="border-t border-outline-variant/15 pt-5 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer"
                >
                  Save Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Products Drawer Modal */}
      {isProductsDrawerOpen && selectedCollection && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-surface-container-lowest border-l border-outline-variant/30 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-fade-in-right">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-outline-variant/15 bg-surface-container-low/30">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-caps text-[8px] tracking-widest text-champagne-gold uppercase block mb-0.5">
                    Showcase Mapping
                  </span>
                  <h3 className="font-headline-sm text-base text-emerald-deep font-bold">
                    {selectedCollection.name}
                  </h3>
                </div>
                <button
                  onClick={() => setIsProductsDrawerOpen(false)}
                  className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">close</span>
                </button>
              </div>

              {/* Add Product Form */}
              <form onSubmit={handleAddProduct} className="mt-5 flex gap-2">
                <select
                  value={addProductId}
                  onChange={(e) => setAddProductId(e.target.value)}
                  className="flex-grow bg-surface-container-low/50 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer"
                >
                  <option value="">Select product to link...</option>
                  {allProducts
                    .filter((p) => !collectionProducts.some((cp) => cp.id === p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.sku})
                      </option>
                    ))}
                </select>
                <button
                  type="submit"
                  disabled={!addProductId}
                  className="px-4 py-2 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 disabled:bg-emerald-deep/40 disabled:cursor-not-allowed font-label-caps text-[9px] uppercase tracking-wider border border-champagne-gold/25 cursor-pointer shrink-0 transition-colors"
                >
                  Link
                </button>
              </form>
            </div>

            {/* Link List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-none">
              <h4 className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-3 border-b border-outline-variant/10 pb-1.5 font-bold">
                Mapped products ({collectionProducts.length})
              </h4>
              {collectionProducts.length > 0 ? (
                collectionProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 border border-outline-variant/10 bg-surface-container-low/15 hover:bg-surface-container-low/30 hover:border-champagne-gold/25 transition-all"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="font-semibold text-xs text-on-surface truncate">{p.title}</p>
                      <p className="font-mono text-[9px] text-on-surface-variant/65 mt-0.5 uppercase">
                        SKU: {p.sku} • Price: ${Number(p.price).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer transition-colors"
                      title="Unlink"
                    >
                      <span className="material-symbols-outlined text-base select-none">link_off</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-on-surface-variant/50 text-xs">
                  No products currently linked to this collection.
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low/20 flex justify-end">
              <button
                onClick={() => setIsProductsDrawerOpen(false)}
                className="px-4 py-2 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
