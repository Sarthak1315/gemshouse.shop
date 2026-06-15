"use client";

import React, { useState, useEffect } from "react";
import { uploadFile } from "@/lib/upload";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  name: string | null;
  email: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: BlogCategory;
  categoryId: string;
  author: Author;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formFeaturedImage, setFormFeaturedImage] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategoryFilter === "all" ? "/api/blogs" : `/api/blogs?category=${selectedCategoryFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error("Failed loading blogs", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/blogs?getCategories=true");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed loading categories", err);
    }
  };

  useEffect(() => {
    loadBlogs();
    loadCategories();
  }, [selectedCategoryFilter]);

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (formMode === "create") {
      setFormSlug(
        val
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
      setFormFeaturedImage(uploaded.url);
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

    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent("");
    setFormFeaturedImage("");
    setFormCategoryId(categories[0]?.id || "");
    setFormPublished(false);

    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setFormMode("edit");
    setActiveId(post.id);
    setErrorMsg(null);

    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt || "");
    setFormContent(post.content);
    setFormFeaturedImage(post.featuredImage || "");
    setFormCategoryId(post.categoryId);
    setFormPublished(post.published);

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
      slug: formSlug,
      excerpt: formExcerpt || null,
      content: formContent,
      featuredImage: formFeaturedImage || null,
      categoryId: formCategoryId,
      published: formPublished,
    };

    try {
      const url = formMode === "create" ? "/api/blogs" : `/api/blogs/${activeId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save blog post");
        return;
      }

      setSuccessMsg("Blog post saved successfully!");
      setIsModalOpen(false);
      loadBlogs();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error saving blog post");
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you certain you want to delete blog post '${post.title}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/blogs/${post.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete");
        return;
      }

      setSuccessMsg("Blog post deleted successfully!");
      loadBlogs();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete blog post");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Editorial CMS
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Heritage & Craftsmanship Blog
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2.5 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-emerald-deep focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none font-bold"
          >
            <option value="all">All Blog Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow shrink-0"
          >
            <span className="material-symbols-outlined text-base select-none">add</span>
            New Blog Post
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

      {/* Blogs List */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading blog posts...
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => (
            <div
              key={post.id}
              className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Featured Cover Image */}
                <div className="aspect-[16/8] w-full bg-charcoal/5 relative overflow-hidden border-b border-outline-variant/15">
                  {post.featuredImage ? (
                    <img alt={post.title} className="w-full h-full object-cover" src={post.featuredImage} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-label-caps text-on-surface-variant/40 uppercase">
                      No Cover Image
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 font-label-caps text-[8px] uppercase tracking-widest px-2.5 py-0.5 border font-semibold shadow-sm ${
                      post.published
                        ? "bg-emerald-deep text-linen-white border-champagne-gold/30"
                        : "bg-surface-variant text-on-surface-variant border-outline-variant"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                    {post.category.name}
                  </span>
                  <h3 className="font-headline-sm text-base text-emerald-deep font-bold mb-2 leading-snug line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="font-mono text-[9px] text-on-surface-variant/65 mb-3">{post.slug}</p>
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {post.excerpt || "No summary excerpt available."}
                  </p>
                </div>
              </div>

              {/* Details & Actions */}
              <div className="px-5 py-3.5 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low/10">
                <div className="text-[9px] font-label-caps text-on-surface-variant/75 uppercase tracking-wide">
                  <span>By: {post.author.name || "Admin"}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="space-x-1.5 flex items-center">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                    title="Edit Post"
                  >
                    <span className="material-symbols-outlined text-base select-none">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
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
            article
          </span>
          <p className="text-on-surface-variant text-sm">No editorial posts created yet.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {formMode === "create" ? "Create Editorial Blog Post" : "Edit Blog Post Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Understanding Sourced Gemstones"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Custom Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. understanding-sourced-gemstones"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Blog Category *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface cursor-pointer font-body-md"
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
                    Cover Image
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formFeaturedImage}
                      onChange={(e) => setFormFeaturedImage(e.target.value)}
                      placeholder="Paste image URL or upload..."
                      className="flex-grow bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                    <label className="px-3 py-2 border border-champagne-gold text-emerald-deep hover:bg-champagne-gold/10 font-label-caps text-[8px] uppercase tracking-widest cursor-pointer transition-colors shrink-0">
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
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Brief Summary Excerpt
                </label>
                <input
                  type="text"
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Summarize the article in 1-2 sentences for catalog cards..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Blog Post Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write full article here. Supports text content..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center pb-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                  />
                  <span className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                    Publish immediately (Visible on website)
                  </span>
                </label>
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
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}