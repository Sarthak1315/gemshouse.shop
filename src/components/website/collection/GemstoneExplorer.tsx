"use client";

import React, { useState, useEffect } from "react";

interface Gemstone {
  id: string;
  name: string;
  chemicalFormula: string;
  hardness: string;
  refractiveIndex: string;
  typicalOrigin: string;
  description: string;
  imageUrl: string;
  colorHex: string;
  badge: string;
}

const gemstones: Gemstone[] = [
  {
    id: "sapphire",
    name: "Ceylon Blue Sapphire",
    chemicalFormula: "Al₂O₃ (Corundum)",
    hardness: "9.0 Mohs Scale",
    refractiveIndex: "1.762 – 1.770",
    typicalOrigin: "Ratnapura, Sri Lanka",
    description: "Famous for their vibrant cornflower to royal blue tones, Ceylon Sapphires are highly sought after by connoisseurs. These natural gems are mined using ethical, small-scale artisanal methods, preserving the local environment while delivering pristine crystals of unparalleled clarity and fire.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH",
    colorHex: "10, 48, 110", // Blue RGB
    badge: "Rare Heat-Free Specimen",
  },
  {
    id: "ruby",
    name: "Burmese Pigeon Blood Ruby",
    chemicalFormula: "Al₂O₃:Cr (Chromium Corundum)",
    hardness: "9.0 Mohs Scale",
    refractiveIndex: "1.762 – 1.770",
    typicalOrigin: "Mogok, Myanmar",
    description: "The legendary Mogok Valley yields rubies that exhibit a deep, glowing red hue with a natural fluorescence. Often referred to as 'Pigeon Blood' red, these rare minerals represent the peak of gemstone investment, commanding record prices at international auctions.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G",
    colorHex: "155, 17, 30", // Red RGB
    badge: "Museum Grade",
  },
  {
    id: "emerald",
    name: "Muzo Emerald",
    chemicalFormula: "Be₃Al₂Si₆O₁₈ (Beryl)",
    hardness: "7.5 – 8.0 Mohs Scale",
    refractiveIndex: "1.577 – 1.583",
    typicalOrigin: "Muzo Mines, Colombia",
    description: "Characterized by an intense, saturated green color with soft golden undertones, Muzo Emeralds are the crown jewels of South American mining history. Their unique inclusions, or 'jardin', tell the story of their ancient formation deep in the Colombian Andes.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--",
    colorHex: "15, 81, 50", // Emerald RGB
    badge: "Insignia Green",
  },
  {
    id: "diamond",
    name: "Fancy Color Diamond",
    chemicalFormula: "C (Crystalline Carbon)",
    hardness: "10.0 Mohs Scale",
    refractiveIndex: "2.417",
    typicalOrigin: "Argyle, Australia / South Africa",
    description: "Fancy color diamonds obtain their vibrant yellow, pink, or blue shades through natural structural anomalies and trace elements present during crystallisation. Known as the hardest known natural substance on Earth, their visual dispersion and scintillation are legendary.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs",
    colorHex: "212, 175, 55", // Yellow RGB
    badge: "VVS1 Clarity Certified",
  },
];

export default function GemstoneExplorer() {
  const [activeTab, setActiveTab] = useState<string>("sapphire");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayedStone, setDisplayedStone] = useState<Gemstone>(gemstones[0]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      const stone = gemstones.find((g) => g.id === activeTab);
      if (stone) {
        setDisplayedStone(stone);
      }
      setIsTransitioning(false);
    }, 250); // duration of fade-out

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="w-full">
      {/* Interactive Tabs Header */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 border-b border-outline-variant/30 pb-4">
        {gemstones.map((stone) => {
          const isActive = activeTab === stone.id;
          return (
            <button
              key={stone.id}
              onClick={() => setActiveTab(stone.id)}
              className={`px-4 md:px-6 py-3 font-label-caps text-xs md:text-sm uppercase tracking-widest border transition-all duration-500 cursor-pointer ${
                isActive
                  ? "bg-emerald-deep text-linen-white border-emerald-deep shadow-md scale-102"
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/50 hover:border-champagne-gold/50 hover:bg-gold-glimmer/5"
              }`}
            >
              {stone.name.split(" ")[0]} {/* First word, e.g. Ceylon, Burmese, Muzo, Fancy */}
            </button>
          );
        })}
      </div>

      {/* Gemstone Detail Layout (Fully Responsive) */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch transition-all duration-500 ${
          isTransitioning ? "opacity-20 scale-[0.98] blur-xs" : "opacity-100 scale-100 blur-0"
        }`}
      >
        {/* Left Col: Macro Zoom Image Viewport */}
        <div className="lg:col-span-5 relative group overflow-hidden bg-charcoal min-h-[350px] md:min-h-[400px]">
          {/* Subtle colored glow overlay */}
          <div
            className="absolute inset-0 z-0 opacity-10 blur-3xl transition-all duration-700 group-hover:opacity-25"
            style={{
              background: `radial-gradient(circle, rgba(${displayedStone.colorHex}, 0.8) 0%, transparent 70%)`,
            }}
          ></div>

          <img
            alt={displayedStone.name}
            className="w-full h-full object-cover relative z-10 transition-transform duration-1000 group-hover:scale-105"
            src={displayedStone.imageUrl}
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-charcoal/80 backdrop-blur-md text-champagne-gold font-label-caps text-[10px] tracking-widest px-3 py-1 border border-champagne-gold/30 uppercase">
              {displayedStone.badge}
            </span>
          </div>
        </div>

        {/* Right Col: Spec Details Sheet */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-10 bg-surface-container-lowest border border-outline-variant/30 relative">
          <div className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: `rgb(${displayedStone.colorHex})` }}></div>

          <div>
            <h3 className="font-headline-md text-headline-sm md:text-headline-md text-emerald-deep mb-4">
              {displayedStone.name}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {displayedStone.description}
            </p>

            {/* Spec Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-outline-variant/30 py-6 mb-8">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant/50 tracking-wider">
                  Chemical Composition
                </span>
                <span className="font-body-md text-sm text-emerald-deep font-semibold">
                  {displayedStone.chemicalFormula}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant/50 tracking-wider">
                  Mohs Hardness
                </span>
                <span className="font-body-md text-sm text-emerald-deep font-semibold">
                  {displayedStone.hardness}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant/50 tracking-wider">
                  Refractive Index
                </span>
                <span className="font-body-md text-sm text-emerald-deep font-semibold">
                  {displayedStone.refractiveIndex}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-[10px] uppercase text-on-surface-variant/50 tracking-wider">
                  Authentic Origin
                </span>
                <span className="font-body-md text-sm text-emerald-deep font-semibold">
                  {displayedStone.typicalOrigin}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="shimmer-hover bg-emerald-deep text-linen-white px-6 py-3 font-label-caps text-xs uppercase tracking-widest hover:opacity-95 active:scale-[0.98] transition-all duration-300 cursor-pointer">
              Enquire About This Stone
            </button>
            <button className="bg-transparent border border-champagne-gold text-champagne-gold px-6 py-3 font-label-caps text-xs uppercase tracking-widest hover:bg-gold-glimmer active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Verify Lab Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
