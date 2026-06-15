"use client";

import React, { useState, useEffect } from "react";

interface Product {
  title: string;
  sku: string;
}

interface Review {
  id: string;
  author: string;
  location: string | null;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  productId: string | null;
  product: Product | null;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter === "all" ? "/api/reviews" : `/api/reviews?approved=${statusFilter === "approved"}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed loading reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [statusFilter]);

  const toggleApproval = async (review: Review) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !review.approved }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update review");
        return;
      }

      setSuccessMsg(review.approved ? "Review un-approved/hidden!" : "Review approved & published!");
      loadReviews();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to update review status");
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Are you certain you want to delete the review by '${review.author}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete review");
        return;
      }

      setSuccessMsg("Review deleted successfully!");
      loadReviews();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete review");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Moderation Operations
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Client Testimonials & Reviews
          </h1>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-b border-outline-variant/35 py-2.5 pr-8 pl-1 text-[11px] font-label-caps uppercase tracking-wider text-emerald-deep focus:ring-0 focus:border-emerald-deep focus:outline-none cursor-pointer rounded-none font-bold"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending Moderation</option>
            <option value="approved">Approved & Published</option>
          </select>
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

      {/* Reviews Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/55">
                <th className="py-4 px-5 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Author & Rating
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Product Link
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Review Text
                </th>
                <th className="py-4 px-4 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Submitted
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
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant/60 font-semibold">
                    Loading customer reviews...
                  </td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-surface-container-low/25 transition-colors">
                    <td className="py-4 px-5 font-semibold text-emerald-deep">
                      {review.author}
                      {review.location && (
                        <span className="block text-[10px] text-on-surface-variant/65 font-normal">
                          {review.location}
                        </span>
                      )}
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm select-none ${
                              i < review.rating ? "text-champagne-gold font-variation-settings-fill" : "text-outline-variant/40"
                            }`}
                            style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {review.product ? (
                        <a
                          href={`/gemstones/${review.product.sku}`}
                          target="_blank"
                          className="font-semibold text-on-surface hover:text-emerald-deep hover:underline transition-colors block"
                        >
                          {review.product.title}
                          <span className="block text-[10px] text-on-surface-variant/65 font-mono">
                            SKU: {review.product.sku}
                          </span>
                        </a>
                      ) : (
                        <span className="text-on-surface-variant/40 font-semibold">General Storefront</span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-sm">
                      <p className="font-bold text-on-surface leading-tight mb-1">{review.title}</p>
                      <p className="text-on-surface-variant/85 leading-relaxed font-normal">
                        {review.comment}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant/80 text-[11px] whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-label-caps uppercase tracking-wider font-semibold ${
                          review.approved
                            ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-600"
                            : "bg-amber-500/10 border-amber-500/15 text-amber-600"
                        }`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${
                            review.approved ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        ></span>
                        {review.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => toggleApproval(review)}
                        className={`px-3 py-1 font-label-caps text-[9px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                          review.approved
                            ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                            : "bg-emerald-deep text-linen-white border-champagne-gold/25 hover:bg-emerald-deep/90"
                        }`}
                      >
                        {review.approved ? "Hide" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer transition-colors inline-block align-middle"
                        title="Delete Review"
                      >
                        <span className="material-symbols-outlined text-lg select-none">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-on-surface-variant/50">
                    No client reviews recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
