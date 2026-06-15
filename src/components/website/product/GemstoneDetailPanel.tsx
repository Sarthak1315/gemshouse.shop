"use client";

import React, { useState } from "react";
import { GemstoneProduct } from "@/lib/data/gemstones";

interface GemstoneDetailPanelProps {
  gemstone: GemstoneProduct;
}

export default function GemstoneDetailPanel({ gemstone }: GemstoneDetailPanelProps) {
  const [activeImage, setActiveImage] = useState<string>(gemstone.images[0] || gemstone.imageUrl);
  const [proportionsExpanded, setProportionsExpanded] = useState<boolean>(false);
  const [originExpanded, setOriginExpanded] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <nav className="mb-8 font-label-caps text-[10px] md:text-xs text-on-surface-variant uppercase flex items-center gap-2 tracking-widest select-none">
        <a className="hover:text-emerald-deep transition-colors" href="/collections">
          Collection
        </a>
        <span className="material-symbols-outlined text-[12px] text-champagne-gold">chevron_right</span>
        <span className="hover:text-emerald-deep transition-colors">
          {gemstone.category}
        </span>
        <span className="material-symbols-outlined text-[12px] text-champagne-gold">chevron_right</span>
        <span className="text-emerald-deep font-semibold">Ref. {gemstone.id.toUpperCase()}</span>
      </nav>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
        
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Display Image */}
          <div className="relative w-full aspect-[4/5] bg-surface-container-low border border-outline-variant/30 overflow-hidden group">
            <img
              alt={gemstone.title}
              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-103"
              src={activeImage}
            />
            {/* Top Status Badge */}
            <div className="absolute top-6 left-6">
              <span className="inline-block bg-emerald-deep text-champagne-gold font-label-caps text-[10px] uppercase tracking-widest px-4 py-2 border border-champagne-gold/25 shadow-md">
                {gemstone.badge}
              </span>
            </div>
            
            {/* Favorite button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Add to wishlist"
              className="absolute top-6 right-6 w-11 h-11 bg-surface-container-lowest/80 backdrop-blur-md rounded-full border border-outline-variant/30 flex items-center justify-center text-emerald-deep hover:bg-gold-glimmer shadow-sm transition-all duration-300 cursor-pointer"
            >
              <span
                className="material-symbols-outlined select-none text-xl transition-all duration-300"
                style={{
                  fontVariationSettings: isFavorite ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300",
                  color: isFavorite ? "#0F5132" : "inherit",
                }}
              >
                favorite
              </span>
            </button>

            {/* Gallery Tools Overlay */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2.5">
              <button
                aria-label="360 View Toggle"
                className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur-md border border-champagne-gold/30 flex items-center justify-center text-emerald-deep hover:bg-emerald-deep hover:text-linen-white transition-all duration-500 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">360</span>
              </button>
              <button
                aria-label="Macro Zoom"
                className="w-12 h-12 bg-surface-container-lowest/90 backdrop-blur-md border border-champagne-gold/30 flex items-center justify-center text-emerald-deep hover:bg-emerald-deep hover:text-linen-white transition-all duration-500 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">zoom_in</span>
              </button>
            </div>
          </div>

          {/* Thumbnail Images list */}
          <div className="flex gap-4 overflow-x-auto scrollbar-none py-2">
            {gemstone.images.map((imgUrl, index) => {
              const isSelected = activeImage === imgUrl;
              return (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border transition-all duration-300 relative cursor-pointer ${
                    isSelected ? "border-emerald-deep opacity-100" : "border-outline-variant/40 opacity-60 hover:opacity-90"
                  }`}
                >
                  <img
                    alt={`Thumbnail view ${index + 1}`}
                    className="w-full h-full object-cover"
                    src={imgUrl}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-emerald-deep pointer-events-none"></div>
                  )}
                </button>
              );
            })}
            
            {/* Video Placeholder Button */}
            <button
              aria-label="Play video"
              className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 border border-outline-variant/40 opacity-60 hover:opacity-100 transition-all duration-300 bg-surface-container flex items-center justify-center text-emerald-deep cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl select-none">play_circle</span>
            </button>
          </div>
        </div>

        {/* Right Column: Spec Details (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between pt-4 lg:pl-6">
          <div>
            <h1 className="font-display-lg text-3xl md:text-headline-md lg:text-display-lg text-emerald-deep leading-tight mb-2 tracking-wide">
              {gemstone.title}
            </h1>
            <p className="font-headline-sm text-base md:text-headline-sm text-on-surface-variant font-normal mb-6">
              {gemstone.carat} ct • {gemstone.cut} • {gemstone.clarity}
            </p>

            {/* Status indicators */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="font-label-caps text-[10px] md:text-xs text-on-surface-variant/80 uppercase tracking-widest">
                Available for Viewing &amp; Acquisition
              </span>
            </div>

            {/* Core Specs Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8 py-6 border-y border-outline-variant/30">
              <div>
                <span className="font-label-caps text-[9px] md:text-[10px] text-outline uppercase tracking-wider block mb-1">
                  Carat Weight
                </span>
                <span className="font-body-lg text-sm md:text-base text-emerald-deep font-semibold">
                  {gemstone.carat} ct
                </span>
              </div>
              <div>
                <span className="font-label-caps text-[9px] md:text-[10px] text-outline uppercase tracking-wider block mb-1">
                  Cut Shape
                </span>
                <span className="font-body-lg text-sm md:text-base text-emerald-deep font-semibold">
                  {gemstone.cut}
                </span>
              </div>
              <div>
                <span className="font-label-caps text-[9px] md:text-[10px] text-outline uppercase tracking-wider block mb-1">
                  Color Designation
                </span>
                <span className="font-body-lg text-sm md:text-base text-emerald-deep font-semibold">
                  {gemstone.category === "Diamond" ? "D (Colorless)" : gemstone.category}
                </span>
              </div>
              <div>
                <span className="font-label-caps text-[9px] md:text-[10px] text-outline uppercase tracking-wider block mb-1">
                  Grading Laboratory
                </span>
                <span className="font-body-lg text-sm md:text-base text-emerald-deep font-semibold">
                  {gemstone.certificate}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 mb-6">
              <button className="shimmer-hover w-full py-4 bg-emerald-deep text-linen-white font-label-caps text-xs uppercase tracking-widest hover:opacity-95 active:scale-[0.99] transition-all duration-300 cursor-pointer sharp-clip-path">
                Request Sourcing Quote
              </button>
              <button className="w-full py-4 bg-transparent border border-champagne-gold text-champagne-gold font-label-caps text-xs uppercase tracking-widest hover:bg-gold-glimmer active:scale-[0.99] transition-all duration-300 cursor-pointer sharp-clip-path">
                Add to Inquiry Tray
              </button>
            </div>

            {/* Dealer actions line */}
            <div className="flex justify-center mb-8">
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-emerald-deep transition-all duration-300 group cursor-pointer">
                <span className="material-symbols-outlined text-sm select-none text-champagne-gold group-hover:text-emerald-deep">
                  lock
                </span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider border-b border-transparent group-hover:border-emerald-deep pb-0.5">
                  Dealer Pricing (Verified Partners Only)
                </span>
              </button>
            </div>

            {/* Expandable Technical Specs Accordions */}
            <div className="flex flex-col border-t border-outline-variant/30">
              
              {/* Proportions Accordion */}
              <div className="border-b border-outline-variant/30">
                <button
                  onClick={() => setProportionsExpanded(!proportionsExpanded)}
                  className="w-full py-5 flex justify-between items-center text-left group cursor-pointer"
                >
                  <span className="font-headline-sm text-sm md:text-base text-emerald-deep tracking-wide uppercase font-semibold">
                    Proportions &amp; Measurements
                  </span>
                  <span
                    className={`material-symbols-outlined text-champagne-gold select-none text-base transition-transform duration-300 ${
                      proportionsExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden font-body-md text-xs md:text-sm text-on-surface-variant ${
                    proportionsExpanded ? "max-h-[250px] pb-5 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <ul className="space-y-3 pt-1">
                    <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                      <span className="text-on-surface-variant/60">Measurements</span>
                      <span className="font-semibold text-emerald-deep">{gemstone.dimensions}</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                      <span className="text-on-surface-variant/60">Depth Percentage</span>
                      <span className="font-semibold text-emerald-deep">{gemstone.depth}</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                      <span className="text-on-surface-variant/60">Table Percentage</span>
                      <span className="font-semibold text-emerald-deep">{gemstone.table}</span>
                    </li>
                    <li className="flex justify-between border-b border-outline-variant/10 pb-2">
                      <span className="text-on-surface-variant/60">Culet Size</span>
                      <span className="font-semibold text-emerald-deep">{gemstone.culet}</span>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span className="text-on-surface-variant/60">Fluorescence Grade</span>
                      <span className="font-semibold text-emerald-deep">{gemstone.fluorescence}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Origin Accordion */}
              <div className="border-b border-outline-variant/30">
                <button
                  onClick={() => setOriginExpanded(!originExpanded)}
                  className="w-full py-5 flex justify-between items-center text-left group cursor-pointer"
                >
                  <span className="font-headline-sm text-sm md:text-base text-emerald-deep tracking-wide uppercase font-semibold">
                    Origin &amp; Treatment History
                  </span>
                  <span
                    className={`material-symbols-outlined text-champagne-gold select-none text-base transition-transform duration-300 ${
                      originExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden font-body-md text-xs md:text-sm text-on-surface-variant ${
                    originExpanded ? "max-h-[200px] pb-5 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="leading-relaxed pt-1 text-on-surface-variant">
                    {gemstone.extendedDescription} This stone represents a completely untreated natural crystal, certified to be of {gemstone.origin} extraction, carrying an ecological mining trace registry.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Certification Box Card */}
          <div className="mt-8 p-5 border border-champagne-gold/30 bg-surface-container-lowest flex items-start gap-4 hover:bg-surface-container-low transition-colors duration-300 cursor-pointer group sharp-clip-path select-none">
            <div className="w-14 h-16 bg-surface-container flex items-center justify-center flex-shrink-0 border border-outline-variant/20 text-emerald-deep">
              <span className="material-symbols-outlined text-2xl select-none">description</span>
            </div>
            <div className="flex-1">
              <h4 className="font-headline-sm text-sm text-emerald-deep mb-0.5 tracking-wide">
                Grading Certificate Sheet
              </h4>
              <p className="font-body-md text-[11px] text-on-surface-variant/70 mb-2">
                Report Number: {gemstone.reportNumber}
              </p>
              <span className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-widest group-hover:text-emerald-deep transition-colors flex items-center gap-1">
                View Report PDF
                <span className="material-symbols-outlined text-xs select-none transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
