"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Loose Diamonds", href: "/collections?gemType=Diamond" },
    { label: "Gemstones", href: "/collections" },
    { label: "Fine Jewelry", href: "/collections" },
    { label: "Investment Grade", href: "/collections" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  /** Check if a nav link matches the current route */
  const isActive = (href: string) => {
    // Strip query params for comparison
    const linkPath = href.split("?")[0];
    // Exact match for root, prefix match for other routes
    if (linkPath === "/") return pathname === "/";
    return pathname === linkPath || pathname.startsWith(linkPath + "/");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b-[0.5px] ${
        isScrolled
          ? "bg-surface-container-lowest/95 backdrop-blur-xl border-champagne-gold/30 py-2 shadow-lg"
          : "bg-surface-container-lowest/70 backdrop-blur-md border-champagne-gold/10 py-4"
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto relative">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-4 text-emerald-deep">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden hover:bg-gold-glimmer p-2 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
          
          <button
            aria-label="Search"
            className="hover:bg-gold-glimmer p-2 rounded-full opacity-80 scale-[0.99] transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">search</span>
          </button>
        </div>

        {/* Brand Logo - Centered absolutely */}
        <a
          className="font-headline-md text-headline-sm md:text-headline-md tracking-widest text-emerald-deep uppercase absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity duration-300"
          href="/"
        >
          Gemshouse
        </a>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4 text-emerald-deep">
          <button
            aria-label="Favorite"
            className="hover:bg-gold-glimmer p-2 rounded-full transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">favorite</span>
          </button>
          <button
            aria-label="Mail"
            className="hover:bg-gold-glimmer p-2 rounded-full transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">mail</span>
          </button>
          <button
            aria-label="Person"
            className="hover:bg-gold-glimmer p-2 rounded-full transition-all duration-300 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">person</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex justify-center items-center gap-8 pb-3 mt-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <a
              key={link.label}
              className={`font-label-caps text-xs tracking-wider transition-colors duration-300 relative pb-1 ${
                active
                  ? "text-champagne-gold font-semibold"
                  : "text-on-surface-variant hover:text-emerald-deep nav-link-hover"
              }`}
              href={link.href}
            >
              {link.label}
              {/* Active indicator bar */}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] bg-champagne-gold transition-all duration-400 ${
                  active ? "w-full" : "w-0"
                }`}
              />
            </a>
          );
        })}
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        className={`fixed inset-0 top-[72px] bg-charcoal/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`w-[280px] h-full bg-surface-container-lowest p-6 border-r border-champagne-gold/20 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-6 mt-4">
            {navLinks.map((link, idx) => {
              const active = isActive(link.href);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    transitionDelay: `${idx * 50}ms`,
                  }}
                  className={`font-label-caps text-sm uppercase tracking-wider py-2 border-b transition-all duration-300 block ${
                    isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  } ${
                    active
                      ? "text-champagne-gold border-champagne-gold/60 pl-3 border-l-2 border-l-champagne-gold"
                      : "text-emerald-deep border-outline-variant/20 hover:text-champagne-gold hover:border-champagne-gold/40"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="mt-12 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-deep opacity-80">
              <span className="material-symbols-outlined select-none text-xl">phone_in_talk</span>
              <span className="font-body-md text-xs">+1 (800) GEM-LINE</span>
            </div>
            <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-widest leading-relaxed">
              Gemshouse London • New York • Geneva • Surat
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}