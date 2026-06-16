import React, { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/website/navbar/Navbar";
import CollectionsGrid from "@/components/website/collection/CollectionsGrid";

export const metadata: Metadata = {
  title: "Curated Gemstones Collection | Gemshouse Sourcing",
  description: "Discover our curated catalog of investment-grade Ceylon Sapphires, Burmese Rubies, Colombian Emeralds, and Fancy Color Diamonds direct from their origins.",
};

export default function CollectionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Canvas */}
      <main className="flex-grow max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 pt-24 md:pt-36">
        <Suspense fallback={
          <div className="py-24 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-champagne-gold/20 animate-ping"></div>
              <div className="absolute w-8 h-8 rounded-full border-2 border-t-emerald-deep border-r-emerald-deep border-b-champagne-gold border-l-champagne-gold animate-spin"></div>
            </div>
            <p className="font-label-caps text-xs text-champagne-gold tracking-widest uppercase">
              Opening secure vault
            </p>
          </div>
        }>
          <CollectionsGrid />
        </Suspense>
      </main>

      {/* Editorial Footer */}
      <footer className="bg-charcoal pt-20 pb-10 border-t border-outline/10 text-surface-variant mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16">
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="font-headline-md text-2xl md:text-headline-sm text-linen-white tracking-widest uppercase">
              Gemshouse
            </div>
            <p className="font-body-md text-body-md text-surface-variant/60 max-w-xs leading-relaxed">
              Purveyors of fine natural gemstones and investment-grade diamonds.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Locations
              </h4>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                London Office
              </a>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                New York Atelier
              </a>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                Geneva Vault
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Client Services
              </h4>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                Contact Concierge
              </a>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                Certification FAQ
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Legal
              </h4>
              <a
                className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8 border-t border-surface-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-caps text-label-caps text-surface-variant/40">
            © 2024 Gemshouse Editorial. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}