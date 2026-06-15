import React from "react";
import Navbar from "@/components/website/navbar/Navbar";
import Footer from "@/components/website/footer/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest text-on-background">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col items-center justify-center text-center gap-6">
        <span className="material-symbols-outlined text-5xl text-champagne-gold select-none animate-pulse">
          diamond
        </span>
        
        <h1 className="font-headline-lg text-3xl md:text-5xl text-emerald-deep font-semibold tracking-wide">
          404 — Asset Not Found
        </h1>
        
        <p className="font-body-md text-xs md:text-sm text-on-surface-variant max-w-md leading-relaxed">
          The requested gem page, collection, or dossier could not be retrieved from our secure vault databases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a
            href="/"
            className="bg-emerald-deep text-linen-white px-8 py-3.5 font-label-caps text-[10px] uppercase tracking-widest hover:opacity-95 active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Return to Salon
          </a>
          <a
            href="/collections"
            className="border border-champagne-gold text-champagne-gold px-8 py-3.5 font-label-caps text-[10px] uppercase tracking-widest hover:bg-gold-glimmer active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">diamond</span>
            Inspect Gemstones
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
