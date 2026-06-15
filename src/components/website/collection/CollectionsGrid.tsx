"use client";

import React, { useState, useMemo, useEffect } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";

const ITEMS_PER_PAGE = 6;

export default function CollectionsGrid() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.products || []).map((dbProduct: any) => {
            const primaryImage = dbProduct.images?.find((img: any) => img.isPrimary) || dbProduct.images?.[0];
            return {
              id: dbProduct.id,
              sku: dbProduct.sku,
              title: dbProduct.title,
              category: dbProduct.category?.name || "Gemstone",
              carat: dbProduct.carat,
              cut: dbProduct.cut || "N/A",
              origin: dbProduct.origin || "Unknown",
              clarity: dbProduct.clarity || "N/A",
              certificate: dbProduct.certification || "GIA",
              imageUrl: primaryImage?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
              price: Number(dbProduct.price),
              badge: dbProduct.featured ? "Investment Grade" : (dbProduct.inStock ? "In Stock" : "Reserved"),
              images: dbProduct.images?.map((img: any) => img.url) || [],
              dimensions: "N/A",
              depth: "N/A",
              table: "N/A",
              culet: "N/A",
              fluorescence: "N/A",
              extendedDescription: dbProduct.description,
              reportNumber: dbProduct.certNumber || "N/A",
            };
          });
          setProductsList(mapped);
        }
      } catch (err) {
        console.error("Failed to load products from API", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>(" sapphire"); // Default search to Ceylon Sapphire for initial visual impact
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Clear query on mount so it shows all cards by default, but defaults to all
  useEffect(() => {
    setSearchQuery("");
  }, []);

  const categoriesList = ["Ruby", "Sapphire", "Emerald", "Diamond", "Spinel"];
  const originsList = [
    "Ceylon (Sri Lanka)",
    "Burma (Myanmar)",
    "Colombia",
    "South Africa",
    "Madagascar",
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, selectedOrigins, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const toggleOrigin = (orig: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(orig) ? prev.filter((item) => item !== orig) : [...prev, orig]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedOrigins([]);
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return productsList
      .filter((product) => {
        // Search filter
        const matchesSearch =
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.origin.toLowerCase().includes(searchQuery.toLowerCase());

        // Category filter
        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(product.category);

        // Origin filter
        const matchesOrigin =
          selectedOrigins.length === 0 || selectedOrigins.includes(product.origin);

        return matchesSearch && matchesCategory && matchesOrigin;
      })
      .sort((a, b) => {
        // Sort filters
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "carat-high") return b.carat - a.carat;
        return b.id.localeCompare(a.id); // 'newest' default
      });
  }, [searchQuery, selectedCategories, selectedOrigins, sortBy]);

  // Paginated Results
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full">
      {/* Search & Header Sorting bar */}
      <header className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6 mb-12 border-b-[0.5px] border-champagne-gold/30 pb-6">
        <div className="flex-1 max-w-xl">
          <h1 className="font-headline-md text-2xl md:text-headline-md text-emerald-deep mb-4">
            Curated Gemstones
          </h1>
          {/* Search bar input */}
          <div className="relative w-full max-w-md mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-b-[0.5px] border-champagne-gold text-emerald-deep font-body-md py-2 pr-10 pl-2 w-full focus:outline-none focus:border-emerald-deep focus:ring-0 placeholder-on-surface-variant/40 rounded-none text-sm"
              placeholder="Search by name or origin..."
            />
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-champagne-gold select-none">
              search
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-label-caps">
          <span className="text-on-surface-variant/70 uppercase tracking-wider">Sort By:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent border-b-[0.5px] border-champagne-gold text-emerald-deep font-body-md py-2 pr-8 pl-2 focus:outline-none focus:border-emerald-deep focus:ring-0 cursor-pointer rounded-none text-xs"
            >
              <option value="newest">New Arrivals</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="carat-high">Carat: High to Low</option>
            </select>
            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-champagne-gold pointer-events-none text-sm">
              expand_more
            </span>
          </div>
        </div>
      </header>

      {/* Grid Layout: Sidebar + Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Sticky Filter Sidebar (Desktop View) */}
        <aside className="lg:col-span-3 sticky top-32 max-h-[calc(100vh-144px)] overflow-y-auto pr-4 hidden lg:block scrollbar-none">
          <div className="mb-10">
            <h3 className="font-headline-sm text-lg text-emerald-deep mb-6">Refine Search</h3>
            <div className="space-y-8">
              {/* Gem Type Accordion */}
              <div className="border-b-[0.5px] border-champagne-gold/20 pb-6">
                <span className="font-label-caps text-xs text-on-surface uppercase tracking-widest block mb-4">
                  Gem Type
                </span>
                <div className="space-y-3 font-body-md text-xs text-on-surface-variant">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                      />
                      <span className="group-hover:text-emerald-deep transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin Accordion */}
              <div className="border-b-[0.5px] border-champagne-gold/20 pb-6">
                <span className="font-label-caps text-xs text-on-surface uppercase tracking-widest block mb-4">
                  Authentic Origin
                </span>
                <div className="space-y-3 font-body-md text-xs text-on-surface-variant">
                  {originsList.map((orig) => (
                    <label key={orig} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(orig)}
                        onChange={() => toggleOrigin(orig)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                      />
                      <span className="group-hover:text-emerald-deep transition-colors">
                        {orig}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={clearAllFilters}
            className="w-full border-[0.5px] border-champagne-gold text-champagne-gold font-label-caps text-xs uppercase py-3 hover:bg-gold-glimmer transition-all duration-300 rounded-none cursor-pointer"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Product Canvas */}
        <div className="lg:col-span-9">
          {/* Mobile Filter Button Drawer Trigger */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-full lg:hidden border-[0.5px] border-champagne-gold text-emerald-deep font-label-caps text-xs uppercase py-3 flex justify-center items-center gap-2 mb-8 bg-surface-container-low cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">tune</span> Filter Results
          </button>

          {/* Catalog Cards Grid */}
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="relative w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-champagne-gold/20 animate-ping"></div>
                <div className="absolute w-8 h-8 rounded-full border-2 border-t-emerald-deep border-r-emerald-deep border-b-champagne-gold border-l-champagne-gold animate-spin"></div>
              </div>
              <p className="font-label-caps text-xs text-champagne-gold tracking-widest uppercase">
                Opening secure vault
              </p>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {paginatedProducts.map((product, idx) => (
                <ScrollReveal
                  key={product.id}
                  direction="up"
                  delay={(idx % 3) * 100}
                >
                  <a href={`/gemstones/${product.id}`} className="block h-full group">
                    <article className="flex flex-col bg-surface-container-lowest border border-outline-variant/30 rounded-none overflow-hidden hover:border-champagne-gold/60 hover:shadow-xl transition-all duration-500 relative h-full">
                      {/* Status badge */}
                      <div className="absolute top-4 left-4 z-10 bg-emerald-deep text-linen-white font-label-caps text-[9px] uppercase px-2.5 py-1 tracking-widest border border-champagne-gold/30">
                        {product.badge}
                      </div>

                      {/* Image viewport */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                        <img
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                          src={product.imageUrl}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-emerald-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Meta Detail section */}
                      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                        <div>
                          <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                            {product.category}
                          </span>
                          <h4 className="font-headline-sm text-base text-emerald-deep group-hover:text-champagne-gold transition-colors duration-300 tracking-wide mb-3 leading-tight">
                            {product.title}
                          </h4>
                          
                          <hr className="border-champagne-gold/20 mb-4 w-10" />

                          {/* Specs Grid */}
                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 font-label-caps text-[10px] text-on-surface-variant uppercase">
                            <div>
                              <span className="text-on-surface-variant/40 block text-[9px]">Carat</span>
                              <strong>{product.carat} ct</strong>
                            </div>
                            <div>
                              <span className="text-on-surface-variant/40 block text-[9px]">Origin</span>
                              <strong className="truncate block">{product.origin.split(" ")[0]}</strong>
                            </div>
                            <div>
                              <span className="text-on-surface-variant/40 block text-[9px]">Certificate</span>
                              <strong className="truncate block">{product.certificate}</strong>
                            </div>
                            <div>
                              <span className="text-on-surface-variant/40 block text-[9px]">Clarity</span>
                              <strong>{product.clarity}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Card Price / Inquiry action */}
                        <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 mt-auto">
                          <span className="font-body-md text-xs font-semibold text-emerald-deep">
                            ${product.price.toLocaleString()}
                          </span>
                          <span className="font-label-caps text-[9px] uppercase text-champagne-gold group-hover:text-emerald-deep transition-colors tracking-widest flex items-center gap-1">
                            Inquire
                            <span className="material-symbols-outlined text-xs transition-transform duration-300 group-hover:translate-x-1">
                              arrow_forward
                            </span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-outline-variant/30">
              <span className="material-symbols-outlined text-champagne-gold text-4xl mb-4 select-none">
                search_off
              </span>
              <p className="font-body-md text-on-surface-variant">
                No matching gemstones found in our vault. Try clearing filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 border border-emerald-deep text-emerald-deep px-6 py-2.5 font-label-caps text-xs uppercase tracking-wider hover:bg-emerald-deep hover:text-linen-white transition-all duration-300 cursor-pointer"
              >
                Reset Selection
              </button>
            </div>
          )}

          {/* Premium Pagination Component */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center justify-center border-t border-champagne-gold/30 pt-10 gap-4">
              <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-widest">
                Showing Page {currentPage} of {totalPages} ({filteredProducts.length} Gems Available)
              </p>

              <div className="flex items-center gap-2">
                {/* Prev page button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    currentPage > 1
                      ? "border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-linen-white"
                      : "border-outline-variant/20 text-on-surface-variant/30 pointer-events-none"
                  }`}
                  aria-label="Previous Page"
                >
                  <span className="material-symbols-outlined select-none text-base">chevron_left</span>
                </button>

                {/* Page number buttons */}
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isSelected = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 border text-xs font-label-caps transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-deep text-linen-white border-emerald-deep font-bold"
                          : "bg-transparent border-outline-variant/30 text-on-surface-variant hover:border-champagne-gold/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next page button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    currentPage < totalPages
                      ? "border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-linen-white"
                      : "border-outline-variant/20 text-on-surface-variant/30 pointer-events-none"
                  }`}
                  aria-label="Next Page"
                >
                  <span className="material-symbols-outlined select-none text-base">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-in Overlay for Refined Search */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 flex justify-end lg:hidden ${
          isMobileDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileDrawerOpen(false)}
      >
        <div
          className={`w-[300px] h-full bg-surface-container-lowest p-6 shadow-2xl overflow-y-auto flex flex-col justify-between transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-base text-emerald-deep">Refine Search</h3>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Mobile Gem Types */}
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant/50 uppercase tracking-wider block mb-3">
                  Gem Type
                </span>
                <div className="space-y-2.5">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep"
                      />
                      <span className="text-xs text-on-surface-variant">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Sourced Origins */}
              <div>
                <span className="font-label-caps text-[10px] text-on-surface-variant/50 uppercase tracking-wider block mb-3">
                  Authentic Origin
                </span>
                <div className="space-y-2.5">
                  {originsList.map((orig) => (
                    <label key={orig} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedOrigins.includes(orig)}
                        onChange={() => toggleOrigin(orig)}
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep"
                      />
                      <span className="text-xs text-on-surface-variant">{orig}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-outline-variant/30 space-y-3">
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="w-full bg-emerald-deep text-linen-white font-label-caps text-xs uppercase py-3 cursor-pointer hover:bg-emerald-deep/95"
            >
              Apply Refinements
            </button>
            <button
              onClick={() => {
                clearAllFilters();
                setIsMobileDrawerOpen(false);
              }}
              className="w-full border border-champagne-gold text-champagne-gold font-label-caps text-xs uppercase py-3 cursor-pointer hover:bg-gold-glimmer/10"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
