"use client";

import React, { useState, useEffect } from "react";

interface Review {
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

const reviewsByCategory: Record<string, Review[]> = {
  Sapphire: [
    {
      author: "Alistair V.",
      location: "Zurich, Switzerland",
      rating: 5,
      date: "May 12, 2026",
      title: "Exceptional Ceylon Saturation",
      comment: "Acquired this Royal Blue Ceylon Sapphire for my private portfolio. The velvet saturation is absolutely mesmerizing in natural light. The GIA/SSEF certificates match perfectly with the physical report.",
    },
    {
      author: "Lady Diana M.",
      location: "London, UK",
      rating: 5,
      date: "April 29, 2026",
      title: "A Magnificent Heirloom Piece",
      comment: "The cushion cut is perfectly balanced and faceted. Gemshouse concierge team arranged a secure private viewing in Mayfair within 24 hours. Phenomenal service.",
    },
  ],
  Ruby: [
    {
      author: "Hiroshi T.",
      location: "Tokyo, Japan",
      rating: 5,
      date: "June 02, 2026",
      title: "Pigeon Blood Perfection",
      comment: "The fluorescence under UV is incredibly intense, a hallmark of true Mogok origin. A rare find and a proud addition to my family collection.",
    },
    {
      author: "Marcus Aurelius B.",
      location: "Geneva, Switzerland",
      rating: 5,
      date: "February 18, 2026",
      title: "Flawless Vault Acquisition",
      comment: "Extremely professional transaction. The ruby was shipped via Brinks in tamper-evident packaging. Graded exactly to specs with a detailed GRS report.",
    },
  ],
  Emerald: [
    {
      author: "Elena R.",
      location: "Geneva, Switzerland",
      rating: 5,
      date: "March 15, 2026",
      title: "Stunning Muzo Green",
      comment: "The jardin in this emerald is delicate and beautiful, authenticating its natural Colombian origin. Truly professional certification and escrow delivery process.",
    },
    {
      author: "David S.",
      location: "New York, USA",
      rating: 5,
      date: "May 08, 2026",
      title: "Uncompromising Quality",
      comment: "A magnificent collector emerald. The color is deep and vibrant with insignificant oil treatment. Sourcing documentation was absolutely flawless.",
    },
  ],
  Diamond: [
    {
      author: "Charles K.",
      location: "New York, USA",
      rating: 5,
      date: "January 20, 2026",
      title: "Unparalleled Brilliance & IF Grading",
      comment: "The GIA report was verified instantly online. This orange diamond exceeds all expectations. Fast, armored courier delivery by Malca-Amit.",
    },
    {
      author: "Sophia L.",
      location: "Singapore",
      rating: 5,
      date: "April 05, 2026",
      title: "Exquisite Collector Grade",
      comment: "I have worked with Gemshouse for several years. Their curation of untreated natural stones and fancy colored diamonds is unmatched in the industry.",
    },
  ],
};

const defaultReviews: Review[] = [
  {
    author: "Marcus Aurelius B.",
    location: "Geneva, Switzerland",
    rating: 5,
    date: "February 18, 2026",
    title: "Flawless Vault Acquisition",
    comment: "Extremely professional transaction. The stone was shipped via Brinks in tamper-evident packaging. Graded exactly to specs.",
  },
  {
    author: "Sophia L.",
    location: "Singapore",
    rating: 5,
    date: "April 05, 2026",
    title: "Exquisite Collector Grade",
    comment: "I have worked with Gemshouse for several years. Their curation of untreated natural stones is unparalleled in the industry.",
  },
];

interface ProductReviewsProps {
  category: string;
  productId?: string;
}

export default function ProductReviews({ category, productId }: ProductReviewsProps) {
  const [activeReviews, setActiveReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", rating: 5, title: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        let url = "/api/reviews?approved=true";
        if (productId) {
          url += `&productId=${productId}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setActiveReviews(data.map((r: any) => ({
              author: r.author,
              location: r.location || "Verified Acquisition",
              rating: r.rating,
              date: new Date(r.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              title: r.title,
              comment: r.comment,
            })));
          } else {
            setActiveReviews(reviewsByCategory[category] || defaultReviews);
          }
        } else {
          setActiveReviews(reviewsByCategory[category] || defaultReviews);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
        setActiveReviews(reviewsByCategory[category] || defaultReviews);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, [category, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: formData.name,
          email: formData.email,
          rating: Number(formData.rating),
          title: formData.title,
          comment: formData.comment,
          location: "Collector Vault",
          productId: productId || null,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowReviewModal(false);
          setFormData({ name: "", email: "", rating: 5, title: "", comment: "" });
        }, 2000);
      } else {
        alert("Failed to submit feedback. Please check your inputs.");
      }
    } catch (err) {
      console.error("Error submitting review", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
        <div className="text-left">
          <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
            Collector Verification
          </span>
          <h3 className="font-headline-md text-xl md:text-headline-md text-emerald-deep">
            Acquisition Reviews
          </h3>
          <div className="w-12 h-0.5 bg-champagne-gold mt-4 hidden md:block"></div>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="font-label-caps text-[10px] md:text-xs uppercase text-champagne-gold hover:text-emerald-deep transition-all duration-300 border border-champagne-gold/30 hover:border-emerald-deep px-4 py-2 sharp-clip-path bg-transparent cursor-pointer"
        >
          Submit Portfolio Feedback
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {activeReviews.map((review, idx) => (
          <div
            key={idx}
            className="p-6 border border-outline-variant/20 bg-surface-container-lowest flex flex-col gap-3 transition-all duration-300 hover:border-champagne-gold/40 hover:shadow-md sharp-clip-path"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h4 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide">
                  {review.title}
                </h4>
                <p className="font-label-caps text-[10px] text-on-surface-variant/50 uppercase tracking-wider mt-0.5">
                  {review.author} • {review.location}
                </p>
              </div>
              <span className="font-body-md text-[10px] text-on-surface-variant/60">{review.date}</span>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-champagne-gold select-none text-sm"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  star
                </span>
              ))}
            </div>

            <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Review Dialog Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-champagne-gold/40 p-8 max-w-md w-full relative sharp-clip-path shadow-2xl flex flex-col gap-6">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-emerald-deep transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined select-none text-xl">close</span>
            </button>

            <div>
              <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                Share Acquisition Experience
              </span>
              <h4 className="font-headline-md text-lg text-emerald-deep">
                Collector Portfolio Feedback
              </h4>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <span className="material-symbols-outlined text-emerald-deep text-4xl animate-bounce">
                  check_circle
                </span>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Thank you. Your acquisition feedback has been transmitted securely and is awaiting concierge verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline">
                    Collector Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-2.5 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline">
                    Secure Email (Verification Only)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-2.5 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-2.5 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold"
                  >
                    <option value={5}>5 Stars (Excellent Sourcing)</option>
                    <option value={4}>4 Stars (Good Quality)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Below Expectation)</option>
                    <option value={1}>1 Star (Concierge Resolution Required)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline">
                    Review Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-2.5 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline">
                    Detailed Verification Comments
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-2.5 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="shimmer-hover w-full mt-2 py-3 bg-emerald-deep text-linen-white font-label-caps text-xs uppercase tracking-widest hover:opacity-95 transition-all duration-300 sharp-clip-path cursor-pointer"
                >
                  Transmit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
