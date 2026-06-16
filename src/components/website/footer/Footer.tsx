"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [ateliers, setAteliers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, ateliersRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/ateliers"),
        ]);

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }

        if (ateliersRes.ok) {
          const ateliersData = await ateliersRes.json();
          setAteliers(ateliersData);
        }
      } catch (err) {
        console.error("Failed to load footer data:", err);
      }
    }
    fetchData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("A network error occurred. Please try again.");
    }
  };

  const logoType = settings.NAV_LOGO_TYPE || "text";
  const logoText = settings.NAV_LOGO_TEXT || "GEMSHOUSE";
  const logoImage = settings.NAV_LOGO_IMAGE || "";
  const phone = settings.CONTACT_PHONE || "+91 261 400 9000";
  const emailContact = settings.CONTACT_EMAIL || "concierge@gemshouse.shop";
  const gst = settings.COMPANY_GST || "";
  const aboutText = settings.FOOTER_ABOUT_TEXT || "Purveyors of fine natural gemstones and investment-grade diamonds. Trusted by jewelers, wholesalers, and collectors worldwide.";

  const instagram = settings.INSTAGRAM_URL || "";
  const facebook = settings.FACEBOOK_URL || "";
  const linkedin = settings.LINKEDIN_URL || "";
  const whatsapp = settings.WHATSAPP_NUMBER || "";

  return (
    <footer className="bg-charcoal text-linen-white py-16 border-t border-outline-variant/10 relative overflow-hidden">
      {/* Background visual gold blur effect */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-champagne-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-deep/5 rounded-full blur-3xl pointer-events-none" />

      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Column 1: Brand & Contact Info */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              {logoType === "image" && logoImage ? (
                <img
                  src={logoImage}
                  alt={logoText}
                  className="max-h-12 w-auto object-contain"
                />
              ) : (
                <h3 className="font-headline-sm text-lg text-champagne-gold tracking-widest uppercase font-bold">
                  {logoText}
                </h3>
              )}
            </Link>
            <p className="font-body-md text-xs text-surface-variant/80 max-w-sm leading-relaxed">
              {aboutText}
            </p>
            
            <div className="flex flex-col gap-3 font-mono text-xs text-surface-variant/75 mt-2">
              {phone && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-champagne-gold select-none">phone</span>
                  <a href={`tel:${phone}`} className="hover:text-champagne-gold transition-colors">{phone}</a>
                </div>
              )}
              {emailContact && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-champagne-gold select-none">mail</span>
                  <a href={`mailto:${emailContact}`} className="hover:text-champagne-gold transition-colors">{emailContact}</a>
                </div>
              )}
              {gst && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-champagne-gold select-none">description</span>
                  <span>GST: {gst}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Locations (Dynamic Ateliers) */}
          <div className="flex flex-col gap-5">
            <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
              Ateliers & Vaults
            </h4>
            <div className="flex flex-col gap-3 font-body-md text-xs text-surface-variant/65">
              {ateliers.length > 0 ? (
                ateliers.map((atelier: any) => (
                  <Link
                    key={atelier.id}
                    href="/contact"
                    className="hover:text-linen-white transition-colors duration-300 flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-surface-variant">{atelier.name}</span>
                    <span className="text-[10px] text-surface-variant/50">{atelier.city}</span>
                  </Link>
                ))
              ) : (
                <>
                  <span className="hover:text-linen-white transition-colors duration-300">London Atelier</span>
                  <span className="hover:text-linen-white transition-colors duration-300">New York Depository</span>
                  <span className="hover:text-linen-white transition-colors duration-300">Geneva Vault</span>
                  <span className="hover:text-linen-white transition-colors duration-300">Surat Diamond Bourse</span>
                </>
              )}
            </div>
          </div>

          {/* Column 3: Client Services & Legal */}
          <div className="flex flex-col gap-5">
            <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
              Client Portal
            </h4>
            <div className="flex flex-col gap-3 font-body-md text-xs text-surface-variant/65">
              <Link href="/contact" className="hover:text-linen-white transition-colors duration-300">
                Contact Concierge
              </Link>
              <Link href="/about" className="hover:text-linen-white transition-colors duration-300">
                About Our House
              </Link>
              <Link href="/wholesale" className="hover:text-linen-white transition-colors duration-300">
                Wholesale Program
              </Link>
              <Link href="/blogs" className="hover:text-linen-white transition-colors duration-300">
                Journal
              </Link>
              <div className="h-px bg-surface-variant/10 my-1" />
              <Link href="/privacy-policy" className="hover:text-linen-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-linen-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Column 4: Newsletter & Socials */}
          <div className="flex flex-col gap-5">
            <h4 className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-semibold">
              Newsletter
            </h4>
            <p className="font-body-md text-[11px] text-surface-variant/80 leading-relaxed">
              Subscribe to receive private catalog updates and acquisition alerts.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex bg-surface-container-high/30 border border-outline-variant/30 focus-within:border-champagne-gold transition-colors duration-300 p-0.5">
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-linen-white placeholder-surface-variant/50 text-xs px-3 py-2 w-full focus:outline-none font-mono"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-champagne-gold hover:bg-champagne-gold/90 text-charcoal px-3 py-2 font-label-caps text-[10px] tracking-wider uppercase font-semibold transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                >
                  {status === "loading" ? "..." : "Join"}
                </button>
              </div>
              {message && (
                <p className={`text-[10px] font-body-sm mt-1 leading-normal ${
                  status === "success" ? "text-emerald-400" : "text-red-400"
                }`}>
                  {message}
                </p>
              )}
            </form>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-variant/60 hover:text-champagne-gold transition-colors flex items-center justify-center p-1.5 bg-surface-container-high/20 rounded-full hover:bg-surface-container-high/40"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-variant/60 hover:text-champagne-gold transition-colors flex items-center justify-center p-1.5 bg-surface-container-high/20 rounded-full hover:bg-surface-container-high/40"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-variant/60 hover:text-champagne-gold transition-colors flex items-center justify-center p-1.5 bg-surface-container-high/20 rounded-full hover:bg-surface-container-high/40"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-surface-variant/60 hover:text-champagne-gold transition-colors flex items-center justify-center p-1.5 bg-surface-container-high/20 rounded-full hover:bg-surface-container-high/40"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.167 1.452 4.767 1.453 5.486 0 9.948-4.461 9.951-9.95.002-2.66-1.019-5.162-2.88-7.026C16.566 1.767 14.06 1.096 11.993 1.096c-5.492 0-9.956 4.462-9.959 9.951-.001 1.724.471 3.4 1.365 4.966L2.398 21.24l5.249-1.378-.002-1.002zM16.5 13.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.3-.6.8-.8.9-.1.2-.3.2-.5.1-.7-.3-1.6-.6-2.5-1.4-.7-.6-1.2-1.4-1.3-1.6-.2-.3 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.2-.2.2-.3 0-.2 0-.4-.1-.5-.2-.5-.8-2-1.1-2.7-.3-.6-.6-.5-.8-.5-.2 0-.4 0-.6.1-.2.1-.6.5-.6 1.3 0 .8.6 1.6.7 1.7.1.1 1.2 1.9 2.8 2.6.4.2.7.3 1 .4.4.1.7.1 1 .1.3 0 .9-.5 1-1 .2-.5.2-.9.1-1-.1-.1-.3-.2-.5-.3z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-label-caps text-[9px] text-surface-variant/40 uppercase tracking-widest">
            © {new Date().getFullYear()} {logoText} Editorial. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}