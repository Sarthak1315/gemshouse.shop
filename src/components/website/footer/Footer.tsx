import React from "react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-linen-white py-16 border-t border-outline-variant/10">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Left Column: Brand Description */}
        <div className="flex flex-col gap-4">
          <h3 className="font-headline-sm text-lg text-emerald-deep tracking-wider uppercase">
            GEMSHOUSE
          </h3>
          <p className="font-body-md text-xs text-surface-variant/80 max-w-xs leading-relaxed">
            Purveyors of fine natural gemstones and investment-grade diamonds. Trusted by jewelers, wholesalers, and collectors worldwide.
          </p>
        </div>

        {/* Column 2: Locations */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
            Locations
          </h4>
          <div className="flex flex-col gap-2 font-body-md text-xs text-surface-variant/65">
            <span className="hover:text-linen-white transition-colors duration-300">London Atelier</span>
            <span className="hover:text-linen-white transition-colors duration-300">New York Depository</span>
            <span className="hover:text-linen-white transition-colors duration-300">Geneva Vault</span>
            <span className="hover:text-linen-white transition-colors duration-300">Surat Diamond Bourse</span>
          </div>
        </div>

        {/* Column 3: Client Services */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
            Client Services
          </h4>
          <div className="flex flex-col gap-2 font-body-md text-xs">
            <a
              className="text-surface-variant/65 hover:text-linen-white transition-colors duration-300"
              href="/contact"
            >
              Contact Concierge
            </a>
            <a
              className="text-surface-variant/65 hover:text-linen-white transition-colors duration-300"
              href="/about"
            >
              Certification FAQ
            </a>
            <a
              className="text-surface-variant/65 hover:text-linen-white transition-colors duration-300"
              href="/wholesale"
            >
              Wholesale Program
            </a>
          </div>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
            Legal
          </h4>
          <div className="flex flex-col gap-2 font-body-md text-xs">
            <a
              className="text-surface-variant/65 hover:text-linen-white transition-colors duration-300"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-surface-variant/65 hover:text-linen-white transition-colors duration-300"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8 border-t border-surface-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-label-caps text-[9px] text-surface-variant/40 uppercase tracking-widest">
          © 2026 Gemshouse Editorial. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}