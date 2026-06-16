"use client";

import React, { useState } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function WholesalePage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    companyName: "",
    taxId: "",
    website: "",
    address: "",
    businessType: "Retailer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    try {
      const res = await fetch("/api/dealers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          taxId: formData.taxId || null,
          website: formData.website || null,
          address: formData.address || null,
          businessType: formData.businessType,
          status: "PENDING",
        }),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        alert("Failed to submit application. Please check your inputs.");
        setFormState("idle");
      }
    } catch (err) {
      console.error("Error submitting dealer application", err);
      alert("An error occurred. Please try again.");
      setFormState("idle");
    }
  };

  const resetForm = () => {
    setFormState("idle");
    setFormData({
      companyName: "",
      taxId: "",
      website: "",
      address: "",
      businessType: "Retailer",
    });
  };

  return (
    <>

      {/* Main Canvas */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto mt-2 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Info on wholesale benefits */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <ScrollReveal direction="fade" delay={0}>
              <span className="font-label-caps text-[10px] md:text-xs tracking-widest text-champagne-gold uppercase block mb-1">
                B2B trade portal
              </span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md lg:text-display-lg text-emerald-deep font-serif leading-tight tracking-wide">
                Wholesale Program
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="font-body-md text-sm text-on-surface-variant/80 mt-4 leading-relaxed">
                Gemshouse provides verified B2B partners, prime ateliers, and select wholesalers direct sourcing pathways to the world's most sought-after rough and faceted natural gemstones.
              </p>
            </ScrollReveal>
          </div>

          {/* Program benefits block */}
          <ScrollReveal direction="up" delay={300} className="p-6 bg-surface-container-low border border-outline-variant/30 sharp-clip-path flex flex-col gap-5">
            <h4 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-champagne-gold text-base select-none">
                verified_user
              </span>
              Verified Partner Benefits
            </h4>
            <ul className="space-y-4 font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
              <li className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-emerald-deep text-sm mt-0.5 select-none">check_circle</span>
                <div>
                  <strong className="text-emerald-deep block font-semibold mb-0.5">Wholesale Trade Pricing</strong>
                  Access direct-from-source B2B pricing, offering competitive margins for premier retailers and jewelry manufacturers.
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-emerald-deep text-sm mt-0.5 select-none">check_circle</span>
                <div>
                  <strong className="text-emerald-deep block font-semibold mb-0.5">Tamper-Proof Escrow</strong>
                  Verify certification reports and physical attributes under secure, fully-insured door-to-door escrow logistics.
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-emerald-deep text-sm mt-0.5 select-none">check_circle</span>
                <div>
                  <strong className="text-emerald-deep block font-semibold mb-0.5">Priority Vault Curation</strong>
                  Receive first-access notifications to newly uncarted, rare gemstone arrivals before catalog publication.
                </div>
              </li>
            </ul>
          </ScrollReveal>
        </div>

        {/* Right Column: Wholesale Application Form */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" delay={250} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-8 md:p-12 sharp-clip-path relative min-h-[550px] flex flex-col justify-center shadow-lg">
            
            {formState === "idle" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                    B2B Application
                  </span>
                  <h3 className="font-headline-md text-xl text-emerald-deep font-semibold">
                    Wholesale Merchant Account
                  </h3>
                  <div className="w-12 h-[1px] bg-champagne-gold mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="companyName" className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Registered Company Name *
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold sharp-clip-path"
                      placeholder="e.g. Fine Gems Co."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="taxId" className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Tax ID / Business Registration
                    </label>
                    <input
                      id="taxId"
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold sharp-clip-path"
                      placeholder="e.g. VAT/EIN Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="website" className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Business Website URL
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold sharp-clip-path"
                      placeholder="e.g. https://domain.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessType" className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Business Entity Type *
                    </label>
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold sharp-clip-path"
                    >
                      <option value="Retailer">Retailer (Bespoke Atelier)</option>
                      <option value="Wholesaler">Wholesaler / Trader</option>
                      <option value="Manufacturer">Jewelry Manufacturer</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                    Company Registered Address
                  </label>
                  <textarea
                    id="address"
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold resize-none sharp-clip-path"
                    placeholder="Enter full physical address..."
                  />
                </div>

                <button
                  type="submit"
                  className="shimmer-hover w-full py-4 mt-2 bg-emerald-deep text-linen-white font-label-caps text-xs uppercase tracking-widest hover:opacity-95 active:scale-[0.99] transition-all duration-300 sharp-clip-path cursor-pointer"
                >
                  Submit Trade Application
                </button>
              </form>
            )}

            {formState === "submitting" && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                <div className="w-12 h-12 rounded-full border-2 border-champagne-gold/30 border-t-emerald-deep animate-spin"></div>
                <div>
                  <h4 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
                    Transmitting Secure Application
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant/60 mt-1">
                    Please wait while our concierge network establishes connection.
                  </p>
                </div>
              </div>
            )}

            {formState === "success" && (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-6 animate-fade-in-up">
                <span className="material-symbols-outlined text-emerald-deep text-5xl select-none animate-bounce">
                  verified
                </span>
                <div>
                  <h4 className="font-headline-sm text-lg text-emerald-deep font-semibold tracking-wide">
                    B2B Application Submitted
                  </h4>
                  <p className="font-body-md text-xs md:text-sm text-on-surface-variant/70 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you. Your wholesale application has been logged. Our concierge team will review your business credentials and follow up within 24 business hours to complete verification.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="mt-4 px-6 py-3 border border-champagne-gold text-champagne-gold hover:bg-gold-glimmer font-label-caps text-xs uppercase tracking-wider transition-all duration-300 sharp-clip-path cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            )}

          </ScrollReveal>
        </div>

      </main>
    </>
  );
}