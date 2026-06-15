"use client";

import React, { useRef, useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  category: string;
  carat: string;
  cut: string;
  origin: string;
  clarity: string;
  certificate: string;
  imageUrl: string;
  price: string;
}

const newArrivals: Product[] = [
  {
    id: "prod-1",
    title: "Vivid Green Muzo Emerald",
    category: "Emerald",
    carat: "4.12 ct",
    cut: "Oval Cut",
    origin: "Colombia (Muzo)",
    clarity: "Minor Oil (Insignia Grade)",
    certificate: "GRS Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--",
    price: "Price on Application",
  },
  {
    id: "prod-2",
    title: "Royal Blue Ceylon Sapphire",
    category: "Sapphire",
    carat: "8.45 ct",
    cut: "Cushion Cut",
    origin: "Sri Lanka (Ratnapura)",
    clarity: "No Heat (Pristine)",
    certificate: "SSEF Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
    price: "Price on Application",
  },
  {
    id: "prod-3",
    title: "Fancy Intense Yellow Diamond",
    category: "Diamond",
    carat: "3.20 ct",
    cut: "Radiant Cut",
    origin: "South Africa",
    clarity: "VVS1 (Ideal Scintillation)",
    certificate: "GIA Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
    price: "Price on Application",
  },
  {
    id: "prod-4",
    title: "Burmese Pigeon Blood Ruby",
    category: "Ruby",
    carat: "2.80 ct",
    cut: "Oval Cut",
    origin: "Myanmar (Mogok Valley)",
    clarity: "No Heat (High Fluorescence)",
    certificate: "GRS Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
    price: "Price on Application",
  },
  {
    id: "prod-5",
    title: "Vivid Pink Mahenge Spinel",
    category: "Spinel",
    carat: "5.30 ct",
    cut: "Cushion Cut",
    origin: "Tanzania (Mahenge)",
    clarity: "Eye Clean (Collector's Choice)",
    certificate: "GRS Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
    price: "Price on Application",
  },
  {
    id: "prod-6",
    title: "Neon Paraiba Tourmaline",
    category: "Tourmaline",
    carat: "6.15 ct",
    cut: "Pear Cut",
    origin: "Brazil (Batalha Mine)",
    clarity: "Vivid Copper Bearing",
    certificate: "SSEF Certified",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--",
    price: "Price on Application",
  },
];

export default function ArrivalsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const updateScrollStatus = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      // Calculate progress
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      } else {
        setScrollProgress(0);
      }

      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < maxScroll - 5);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollStatus);
      // Run once on load to establish bounds
      updateScrollStatus();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollStatus);
      }
    };
  }, []);

  const slide = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth, scrollLeft } = containerRef.current;
      const amount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      containerRef.current.scrollTo({
        left: scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Slider Controls / Title Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Exclusive Unveiling
          </span>
          <h3 className="font-headline-md text-headline-sm md:text-headline-md text-emerald-deep">
            Exceptional Acquisitions
          </h3>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => slide("left")}
            disabled={!canScrollLeft}
            className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              canScrollLeft
                ? "border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-linen-white"
                : "border-outline-variant/30 text-on-surface-variant/35 pointer-events-none"
            }`}
            aria-label="Previous Slide"
          >
            <span className="material-symbols-outlined select-none text-xl">arrow_back</span>
          </button>
          <button
            onClick={() => slide("right")}
            disabled={!canScrollRight}
            className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              canScrollRight
                ? "border-emerald-deep text-emerald-deep hover:bg-emerald-deep hover:text-linen-white"
                : "border-outline-variant/30 text-on-surface-variant/35 pointer-events-none"
            }`}
            aria-label="Next Slide"
          >
            <span className="material-symbols-outlined select-none text-xl">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel (Native hardware scrolling + Snap alignment) */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {newArrivals.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] max-w-[380px] flex-none snap-start group bg-surface-container-lowest border border-outline-variant/30 transition-all duration-500 hover:border-champagne-gold/60 hover:shadow-xl relative flex flex-col justify-between"
          >
            {/* Image Box */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal relative">
              <img
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={product.imageUrl}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-charcoal/80 backdrop-blur-md text-linen-white font-label-caps text-[9px] tracking-wider px-2.5 py-1 border border-outline-variant/20 uppercase select-none">
                  {product.origin.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Info details */}
            <div className="p-6 flex flex-col flex-grow justify-between gap-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase">
                    {product.category}
                  </span>
                  <span className="font-label-caps text-[10px] tracking-wider text-emerald-deep font-semibold">
                    {product.certificate}
                  </span>
                </div>
                <h4 className="font-headline-sm text-base md:text-lg text-emerald-deep group-hover:text-champagne-gold transition-colors duration-300 tracking-wide mb-3">
                  {product.title}
                </h4>
                
                {/* Highlights Table */}
                <div className="grid grid-cols-2 gap-y-2 border-t border-outline-variant/20 pt-4 text-xs font-body-md text-on-surface-variant">
                  <div>
                    <span className="text-[10px] uppercase text-on-surface-variant/40 block">Carat Weight</span>
                    <strong className="text-emerald-deep font-semibold">{product.carat}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-on-surface-variant/40 block">Cut Shape</span>
                    <strong className="text-emerald-deep font-semibold">{product.cut}</strong>
                  </div>
                  <div className="col-span-2 mt-1">
                    <span className="text-[10px] uppercase text-on-surface-variant/40 block">Clarity &amp; Treatment</span>
                    <strong className="text-emerald-deep font-semibold truncate block">{product.clarity}</strong>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center mt-2">
                <span className="font-label-caps text-xs tracking-wider text-emerald-deep uppercase font-bold">
                  {product.price}
                </span>
                
                <button
                  aria-label="Inquire"
                  className="w-10 h-10 border border-emerald-deep flex items-center justify-center text-emerald-deep hover:bg-emerald-deep hover:text-linen-white transition-all duration-300 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none text-base">forward_to_inbox</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress tracking line */}
      <div className="w-full h-[2px] bg-outline-variant/30 mt-4 relative">
        <div
          className="absolute left-0 top-0 h-full bg-champagne-gold transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
