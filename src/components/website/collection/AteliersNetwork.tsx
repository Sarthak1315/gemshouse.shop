"use client";

import React, { useState } from "react";

interface Atelier {
  id: string;
  city: string;
  name: string;
  role: string;
  phone: string;
  address: string;
  services: string[];
  description: string;
  mapCoords: string; // for display
}

const ateliers: Atelier[] = [
  {
    id: "london",
    city: "London",
    name: "Mayfair Concierge",
    role: "Headquarters & Private Sourcing",
    phone: "+44 (0) 20 7946 0192",
    address: "Bruton Place, Mayfair, London W1J",
    services: [
      "Bespoke Sourcing Consultations",
      "Wholesale Inventory Inspections",
      "HNW Private Sales Suite",
    ],
    description: "Located in the heart of Mayfair, our London headquarters manages all global logistics and houses our primary private client concierge team.",
    mapCoords: "51.5074° N, 0.1278° W",
  },
  {
    id: "newyork",
    city: "New York",
    name: "Fifth Avenue Atelier",
    role: "Custom Fine Jewelry Design",
    phone: "+1 (212) 555-0143",
    address: "Fifth Avenue, Midtown Manhattan, NY 10019",
    services: [
      "Custom Fine Jewelry Crafting",
      "3D Model & Gemstone Fitting",
      "Certified Appraisals & Insurances",
    ],
    description: "Our New York atelier features master designers who specialize in setting our loose sapphires, rubies, and diamonds into custom-crafted jewelry masterpieces.",
    mapCoords: "40.7128° N, 74.0060° W",
  },
  {
    id: "geneva",
    city: "Geneva",
    name: "Swiss Vaults & Logistics",
    role: "Secure Depository & Trading",
    phone: "+41 (0) 22 731 8290",
    address: "Route de Meyrin, Geneva Airport Free-port",
    services: [
      "Swiss Free-port Vault Storage",
      "International Duties Handling",
      "GIA/SSEF Certification Escrow",
    ],
    description: "Partnered with Geneva's highest-security depositories, our Swiss branch manages high-value shipping logistics and secure storage for collectors worldwide.",
    mapCoords: "46.2044° N, 6.1432° E",
  },
  {
    id: "surat",
    city: "Surat",
    name: "Surat Cutting & Polishing Center",
    role: "Diamond Cutting, Polishing & Custom Crafting",
    phone: "+91 261 555 0192",
    address: "Surat Diamond Bourse, Khajod, Surat, Gujarat 395007, India",
    services: [
      "Master Diamond Cutting & Faceting",
      "GIA Laboratory Export Preparations",
      "Secure Indian Custody Vaults",
    ],
    description: "Located inside the world-class Surat Diamond Bourse, our state-of-the-art Surat atelier manages precision diamond cutting, lapidary shaping, and security logistics for our Southeast Asian partners.",
    mapCoords: "21.1702° N, 72.8311° E",
  },
];

export default function AteliersNetwork() {
  const [activeAtelier, setActiveAtelier] = useState<string>("london");

  const currentAtelier = ateliers.find((a) => a.id === activeAtelier) || ateliers[0];

  return (
    <div className="bg-charcoal text-surface-variant p-8 md:p-12 relative overflow-hidden flex flex-col justify-between min-h-[450px] border border-outline/10 group">
      {/* Background radial gold glow grid */}
      <div className="absolute inset-0 bg-gold-glimmer/[0.03] pointer-events-none z-0"></div>
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-champagne-gold/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 w-full">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-champagne-gold text-3xl animate-pulse">
            public
          </span>
          <div>
            <span className="font-label-caps text-[9px] text-champagne-gold tracking-widest uppercase block">
              Global Presence
            </span>
            <h3 className="font-headline-sm text-lg md:text-xl text-linen-white tracking-wide">
              The Ateliers Network
            </h3>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 border-b border-surface-variant/10 pb-4 mb-6">
          {ateliers.map((atelier) => {
            const isActive = activeAtelier === atelier.id;
            return (
              <button
                key={atelier.id}
                onClick={() => setActiveAtelier(atelier.id)}
                className={`px-4 py-2 font-label-caps text-[10px] md:text-xs tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-champagne-gold text-charcoal border-champagne-gold font-bold shadow-md"
                    : "bg-transparent text-surface-variant/70 border-surface-variant/20 hover:border-champagne-gold/40 hover:text-linen-white"
                }`}
              >
                {atelier.city}
              </button>
            );
          })}
        </div>

        {/* Active Atelier Content */}
        <div className="transition-all duration-500 min-h-[180px] flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <h4 className="font-headline-sm text-base text-linen-white tracking-wide">
                {currentAtelier.name}
              </h4>
              <span className="font-body-md text-[10px] text-champagne-gold opacity-80 font-mono">
                {currentAtelier.mapCoords}
              </span>
            </div>
            
            <span className="font-label-caps text-[10px] text-surface-variant/50 uppercase block mb-3">
              {currentAtelier.role}
            </span>
            
            <p className="font-body-md text-xs md:text-sm text-surface-variant/80 leading-relaxed max-w-xl mb-4">
              {currentAtelier.description}
            </p>

            {/* Local Services */}
            <div className="flex flex-col gap-2 mt-2">
              {currentAtelier.services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-surface-variant/90">
                  <span className="material-symbols-outlined text-champagne-gold text-sm select-none">
                    circle_notifications
                  </span>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact details */}
      <div className="relative z-10 border-t border-surface-variant/10 pt-4 mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div>
          <span className="text-[10px] text-surface-variant/40 block uppercase">Atelier Address</span>
          <span className="text-linen-white font-semibold">{currentAtelier.address}</span>
        </div>
        
        <a
          href={`tel:${currentAtelier.phone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-2 bg-emerald-deep text-linen-white px-4 py-2 hover:bg-emerald-deep/90 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-sm select-none">phone</span>
          <span>{currentAtelier.phone}</span>
        </a>
      </div>
    </div>
  );
}
