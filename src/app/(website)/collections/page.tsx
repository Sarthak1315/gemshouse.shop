import React, { Suspense } from "react";
import type { Metadata } from "next";
import CollectionsGrid from "@/components/website/collection/CollectionsGrid";

export const metadata: Metadata = {
  title: "Curated Gemstones Collection | Gemshouse Sourcing",
  description: "Discover our curated catalog of investment-grade Ceylon Sapphires, Burmese Rubies, Colombian Emeralds, and Fancy Color Diamonds direct from their origins.",
};

export default function CollectionsPage() {
  return (
    <>

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

    </>
  );
}