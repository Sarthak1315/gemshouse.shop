"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  sku: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  category: string;
  productId: string | null;
  product: Product | null;
}

const defaultCategories = ["Acquisition", "Heritage", "Certification", "General"];

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Form Fields
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState("Acquisition");
  const [formCustomCategory, setFormCustomCategory] = useState("");
  const [formOrder, setFormOrder] = useState("");
  const [formProductId, setFormProductId] = useState("");

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategoryFilter === "all" ? "/api/faqs" : `/api/faqs?category=${selectedCategoryFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data);
      }
    } catch (err) {
      console.error("Failed loading FAQs", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=100");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed loading products", err);
    }
  };

  useEffect(() => {
    loadFaqs();
    loadProducts();
  }, [selectedCategoryFilter]);

  // Extract unique categories dynamically from seeded/existing FAQs
  const allCategories = Array.from(
    new Set([...defaultCategories, ...faqs.map((f) => f.category)])
  );

  const openCreateModal = () => {
    setFormMode("create");
    setActiveId(null);
    setErrorMsg(null);

    setFormQuestion("");
    setFormAnswer("");
    setFormCategory("Acquisition");
    setFormCustomCategory("");
    setFormOrder("0");
    setFormProductId("");

    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setFormMode("edit");
    setActiveId(faq.id);
    setErrorMsg(null);

    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    
    if (defaultCategories.includes(faq.category)) {
      setFormCategory(faq.category);
      setFormCustomCategory("");
    } else {
      setFormCategory("custom");
      setFormCustomCategory(faq.category);
    }
    
    setFormOrder(String(faq.order));
    setFormProductId(faq.productId || "");

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCategory = formCategory === "custom" ? formCustomCategory.trim() : formCategory;
    if (!finalCategory) {
      setErrorMsg("Please enter a custom category name");
      return;
    }

    const payload = {
      question: formQuestion,
      answer: formAnswer,
      category: finalCategory,
      order: parseInt(formOrder || "0", 10),
      productId: formProductId || null,
    };

    try {
      const url = formMode === "create" ? "/api/faqs" : `/api/faqs/${activeId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save FAQ");
        return;
      }

      setSuccessMsg("FAQ saved successfully!");
      setIsModalOpen(false);
      loadFaqs();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error saving FAQ");
    }
  };

  const handleDelete = async (faq: FAQ) => {
    if (!confirm("Are you certain you want to delete this FAQ?")) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete");
        return;
      }

      setSuccessMsg("FAQ deleted successfully!");
      loadFaqs();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete FAQ");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Storefront Assistance
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Frequently Asked Questions
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2.5 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-emerald-deep focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none font-bold"
          >
            <option value="all">All FAQ Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow shrink-0"
          >
            <span className="material-symbols-outlined text-base select-none">add</span>
            Create FAQ
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

      {/* FAQs List */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading FAQs...
        </div>
      ) : faqs.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-surface-container-lowest border border-outline-variant/20 p-5 shadow-sm hover:border-champagne-gold/20 transition-all flex justify-between items-start gap-4"
            >
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant/15 font-label-caps text-[8px] uppercase tracking-wider font-bold text-emerald-deep">
                    {faq.category}
                  </span>
                  {faq.product && (
                    <span className="px-2 py-0.5 bg-champagne-gold/15 text-emerald-deep border border-champagne-gold/25 font-label-caps text-[8px] uppercase tracking-wider">
                      Product: {faq.product.title} ({faq.product.sku})
                    </span>
                  )}
                  <span className="text-[10px] text-on-surface-variant/60 font-label-caps font-medium">
                    Order Index: {faq.order}
                  </span>
                </div>
                <h3 className="font-headline-sm text-sm text-emerald-deep font-bold">
                  {faq.question}
                </h3>
                <p className="font-body-md text-xs text-on-surface-variant/85 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
              <div className="space-x-1 flex items-center shrink-0">
                <button
                  onClick={() => openEditModal(faq)}
                  className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                  title="Edit FAQ"
                >
                  <span className="material-symbols-outlined text-base select-none">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(faq)}
                  className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer"
                  title="Delete FAQ"
                >
                  <span className="material-symbols-outlined text-base select-none">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            quiz
          </span>
          <p className="text-on-surface-variant text-sm">No FAQs created yet.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {formMode === "create" ? "Create Frequently Asked Question" : "Edit FAQ Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Assigned Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer font-body-md"
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">-- Create Custom Category --</option>
                  </select>
                </div>
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
              </div>

              {formCategory === "custom" && (
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Enter Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomCategory}
                    onChange={(e) => setFormCustomCategory(e.target.value)}
                    placeholder="e.g. Sourcing Protocols"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
              )}

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Link to Specific Gemstone Product (Optional)
                </label>
                <select
                  value={formProductId}
                  onChange={(e) => setFormProductId(e.target.value)}
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer font-body-md"
                >
                  <option value="">Global FAQ (Storewide)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  FAQ Question Text *
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Do you provide GIA reports?"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  FAQ Answer Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Explain details in a professional, clear manner..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                ></textarea>
              </div>

              <div className="border-t border-outline-variant/15 pt-5 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
