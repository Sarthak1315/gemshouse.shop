import React from "react";
import Navbar from "@/components/website/navbar/Navbar";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ArrivalsSlider from "@/components/website/collection/ArrivalsSlider";
import GemstoneExplorer from "@/components/website/collection/GemstoneExplorer";
import ProvenanceTimeline from "@/components/website/collection/ProvenanceTimeline";
import AteliersNetwork from "@/components/website/collection/AteliersNetwork";
import Footer from "@/components/website/footer/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <Navbar />

      <main className="pt-16 md:pt-28">
        {/* Hero Section (Aesthetic Fade and Scale on Load) */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-charcoal overflow-hidden">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              alt="Hero background - dramatic macro emerald and diamond on velvet"
              className="w-full h-full object-cover animate-hero-bg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4Cca5I5N9aNG_CxkpcmRo3xRwGlq5fiEgUG4nf4pNX7DPWg2Nlq1sKSRyVN3HTqvwAJE9bb1vSQhBva_DDuQKclfg_YtTOEKNeAg2mSHH_3La3mApCMLDnmZI4dfPR8kyeItbTY3vWcnMPd2HPrPdEuVzC-Y9008crgF8EjwxhfrkUyj4j2gyQiW2VvCuWGb8HjKuCvbOqb4j1fGkhCvDvBsyDT6vu9onuqKX2riI_2vxQ893ktC8mcEaFgbiTfLbN2x-hYc8--"
            />
            {/* Elegant dark gradient overlay to ensure complete text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/45 to-charcoal/80 z-10"></div>
          </div>
          {/* Text/Content Overlay */}
          <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col items-center gap-8 py-16">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-linen-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-tight animate-fade-in-up">
              Natural Gemstones &amp; Fancy Diamonds Direct From Source
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] animate-fade-in-up animation-delay-200">
              Trusted by Jewelers, Wholesalers &amp; Collectors Worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto animate-fade-in-up animation-delay-300">
              <button className="shimmer-hover bg-emerald-deep text-linen-white px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-95 active:scale-[0.98] transition-all duration-300 cursor-pointer sharp-clip-path">
                Explore Collection
              </button>
              <button className="shimmer-hover bg-transparent border border-champagne-gold text-champagne-gold px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest hover:bg-gold-glimmer active:scale-[0.98] transition-all duration-300 cursor-pointer sharp-clip-path">
                Request Inventory
              </button>
            </div>
          </div>
        </section>

        {/* Curated Selections Section (Bento Grid) */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center mb-16">
              <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
                Aesthetic Excellence
              </span>
              <h2 className="font-headline-md text-2xl md:text-headline-md text-emerald-deep mb-4">
                Curated Selections
              </h2>
              <div className="w-16 h-0.5 bg-champagne-gold mx-auto"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Large Feature Card - Ceylon Sapphires */}
            <div className="md:col-span-8">
              <ScrollReveal direction="up" delay={150} className="h-full">
                <div className="group relative overflow-hidden bg-surface-container-low border border-outline-variant/30 transition-all duration-500 hover:border-champagne-gold/50 hover:shadow-xl cursor-pointer h-full">
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      alt="Sapphire Collection - macro faceted royal blue sapphire"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsIBXog5Vz8Z8GS0xOhDj2rkHSKBB2k3JtBA5OoRjF8qmNtgjwYlQKLr_8tmVFUtMqjI0K4jxIBYAsf1kmLBsbecJtj9Tb2JrQHSI-bkeTHkist9NUYSLAgzZPBYwTYRIGxygZzbhvMLL547VhMKZJLkyJSdGSBzDuZIieLxKXoZaCfy5qSrcIYoHG9OHI6RYNtkqNspK3M5WSllFWLAM_lf61ibO0VWalQ5RmrXhYQxiU9J6D8R_sdRC0u8XuDnkQHkym_QDTf2jH"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent p-8 flex flex-col justify-end">
                    <span className="inline-block bg-emerald-deep text-champagne-gold font-label-caps text-label-caps px-3 py-1 mb-3 self-start border border-champagne-gold/20 select-none">
                      Investment Grade
                    </span>
                    <h3 className="font-headline-sm text-xl md:text-headline-sm text-linen-white tracking-wide">
                      Ceylon Sapphires
                    </h3>
                    <p className="font-body-md text-body-md text-surface-variant/90 mt-2">
                      Unheated, pristine clarity.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Small Features Stack */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              {/* Burmese Rubies */}
              <ScrollReveal direction="left" delay={250} className="flex-1">
                <div className="group relative overflow-hidden bg-surface-container-low border border-outline-variant/30 transition-all duration-500 hover:border-champagne-gold/50 hover:shadow-xl cursor-pointer min-h-[220px] h-full">
                  <div className="absolute inset-0 z-0">
                    <img
                      alt="Burmese Rubies - macro glowing pigeon blood ruby"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKhsHXSE1e1-v_t1QXjB33P9bCcmXIcdV-lcfAHQFNyhn9-1xxh5YGSfxW5YDfMn8_tyhzmfOBa_GMT0ZsOq3E7Oly5_hgiex2QW5NCB4Za23TZIufc1M4LTMaynEQ0V0UUaUCyI7xn0juKS1FOJDJd4V7B4Tp7r0W_zkQZlEsfAkHK1CwaCXqC9iQjc5fImy4lmOl1EYVJa_Krofqa1RICx59lOa3aWcj_BW-yz1ZEHG7hEjiRqP3g6C69DXoBpwQGRcfPjcOaS4G"
                    />
                  </div>
                  <div className="relative z-10 h-full bg-gradient-to-t from-charcoal/90 to-transparent p-6 flex flex-col justify-end min-h-[220px]">
                    <h3 className="font-headline-sm text-xl md:text-headline-sm text-linen-white tracking-wide">
                      Burmese Rubies
                    </h3>
                  </div>
                </div>
              </ScrollReveal>

              {/* Fancy Color Diamonds */}
              <ScrollReveal direction="left" delay={350} className="flex-1">
                <div className="group relative overflow-hidden bg-surface-container-low border border-outline-variant/30 transition-all duration-500 hover:border-champagne-gold/50 hover:shadow-xl cursor-pointer min-h-[220px] h-full">
                  <div className="absolute inset-0 z-0">
                    <img
                      alt="Fancy Diamonds - macro radiant cut yellow diamond"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3SoUOa3N3pLiBylikbr7TjBlxahWLQvbgIbqvy4gMA7L5igXjYYkFahBoT2O_PTMCBZn_JovsOyNg68iQckfn1M5EyPp1nlwniH7stMC6eLh7FEVv9KC_t1D_jjZgO2NUSBPpZsZraDAJhJb4CaPdduY5PykPFkZSuwpq7iEv7O-B__krjWPYxadiEAjDBj-6b4yuScWv9u3DoajQRl2PEALHaZCQB-SkMLGgEqx3dZEU87k7qlqYJ6xbNMAy18DoXl3b8EPI7Jqs"
                    />
                  </div>
                  <div className="relative z-10 h-full bg-gradient-to-t from-charcoal/90 to-transparent p-6 flex flex-col justify-end min-h-[220px]">
                    <h3 className="font-headline-sm text-xl md:text-headline-sm text-linen-white tracking-wide">
                      Fancy Color Diamonds
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Exceptional Arrivals Product Carousel Section */}
        <section className="py-24 bg-surface-container-low border-y border-outline-variant/20 overflow-hidden">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <ScrollReveal direction="up" delay={0}>
              <ArrivalsSlider />
            </ScrollReveal>
          </div>
        </section>

        {/* Interactive Gemstone Explorer Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center mb-16">
              <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
                Technical Mastery
              </span>
              <h2 className="font-headline-md text-2xl md:text-headline-md text-emerald-deep mb-4">
                Explore Gemstone Standards
              </h2>
              <div className="w-16 h-0.5 bg-champagne-gold mx-auto"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <GemstoneExplorer />
          </ScrollReveal>
        </section>

        {/* Provenance timeline and Global Ateliers Section */}
        <section className="py-24 bg-surface-container-low border-t border-outline-variant/20">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 xl:grid-cols-12 gap-gutter items-stretch">
            {/* The Provenance Journey */}
            <div className="xl:col-span-7 flex flex-col justify-between">
              <ScrollReveal direction="right" delay={100} className="h-full">
                <div className="p-8 md:p-12 bg-surface-container-lowest border border-outline-variant/30 relative flex flex-col justify-center h-full">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-champagne-gold to-transparent opacity-50"></div>
                  
                  <div className="mb-8">
                    <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
                      Our Ethics &amp; Standards
                    </span>
                    <h2 className="font-headline-md text-2xl md:text-headline-md text-emerald-deep">
                      The Provenance Journey
                    </h2>
                  </div>
                  
                  <ProvenanceTimeline />
                </div>
              </ScrollReveal>
            </div>

            {/* Global Reach (Ateliers Network Dashboard) */}
            <div className="xl:col-span-5">
              <ScrollReveal direction="left" delay={200} className="h-full">
                <AteliersNetwork />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
