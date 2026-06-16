"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  submenus?: { label: string; href: string }[];
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [trayItems, setTrayItems] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [trayName, setTrayName] = useState("");
  const [trayEmail, setTrayEmail] = useState("");
  const [trayPhone, setTrayPhone] = useState("");
  const [trayMessage, setTrayMessage] = useState("I would like to inquire about the collection of gemstones in my tray.");
  const [isSubmittingTray, setIsSubmittingTray] = useState(false);
  const [trayError, setTrayError] = useState<string | null>(null);
  const [traySuccess, setTraySuccess] = useState(false);

  const [logoType, setLogoType] = useState<string>("text");
  const [logoText, setLogoText] = useState("Gemshouse");
  const [logoImage, setLogoImage] = useState("");
  const [phone, setPhone] = useState("+1 (800) GEM-LINE");

  const loadTray = () => {
    try {
      const stored = localStorage.getItem("gemshouse_inquiry_tray");
      setTrayItems(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTray();
    window.addEventListener("inquiry_tray_updated", loadTray);
    return () => window.removeEventListener("inquiry_tray_updated", loadTray);
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setCurrentUser(data.user);
            setTrayName(data.user.name || "");
            setTrayEmail(data.user.email || "");
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadLogoSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (settings.NAV_LOGO_TYPE) setLogoType(settings.NAV_LOGO_TYPE);
          if (settings.NAV_LOGO_TEXT) setLogoText(settings.NAV_LOGO_TEXT);
          if (settings.NAV_LOGO_IMAGE) setLogoImage(settings.NAV_LOGO_IMAGE);
          if (settings.CONTACT_PHONE) setPhone(settings.CONTACT_PHONE);
        }
      } catch (err) {
        console.error("Failed to load settings in Navbar:", err);
      }
    }
    loadLogoSettings();
  }, []);

  const handleRemoveFromTray = (id: string) => {
    const updated = trayItems.filter((item) => item.id !== id);
    setTrayItems(updated);
    localStorage.setItem("gemshouse_inquiry_tray", JSON.stringify(updated));
    window.dispatchEvent(new Event("inquiry_tray_updated"));
  };

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

  const fallbackNavLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Gemstones", href: "/collections" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Journal", href: "/blogs" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const [links, setLinks] = useState<NavLink[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("/api/menus");
        if (res.ok) {
          const data = await res.json();
          const activeMenus = data.filter((item: any) => item.isActive);
          if (activeMenus && activeMenus.length > 0) {
            setLinks(activeMenus.map((item: any) => {
              const activeSubmenus = (item.submenus || []).filter((sub: any) => sub.isActive);
              return {
                label: item.label,
                href: item.href,
                submenus: activeSubmenus.length > 0
                  ? activeSubmenus.map((sub: any) => ({ label: sub.label, href: sub.href }))
                  : undefined,
              };
            }));
          } else {
            setLinks(fallbackNavLinks);
          }
        } else {
          setLinks(fallbackNavLinks);
        }
      } catch (err) {
        console.error("Failed to load custom menus, using fallback", err);
        setLinks(fallbackNavLinks);
      } finally {
        setIsMenuLoading(false);
      }
    }
    loadMenu();
  }, []);

  /** Check if a nav link matches the current route */
  const isActive = (href: string) => {
    // Strip query params for comparison
    const linkPath = href.split("?")[0];
    // Exact match for root, prefix match for other routes
    if (linkPath === "/") return pathname === "/";
    return pathname === linkPath || pathname.startsWith(linkPath + "/");
  };

  return (
    <>
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

          {/* Brand Logo - Centered absolutely with optimized mobile spacing */}
          <Link
            className="font-headline-md text-lg sm:text-xl md:text-headline-sm lg:text-headline-md tracking-wider md:tracking-widest text-emerald-deep uppercase absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-all duration-300 flex items-center justify-center h-12"
            href="/"
          >
            {logoType === "image" && logoImage ? (
              <img
                src={logoImage}
                alt={logoText}
                className="max-h-8 sm:max-h-10 w-auto object-contain"
              />
            ) : (
              logoText
            )}
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4 text-emerald-deep">
            <button
              aria-label="Favorite"
              className="hover:bg-gold-glimmer p-2 rounded-full transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined select-none">favorite</span>
            </button>
            <button
              onClick={() => setIsTrayOpen(true)}
              aria-label="Inquiry Tray"
              className="hover:bg-gold-glimmer p-2 rounded-full transition-all duration-300 cursor-pointer relative"
            >
              <span className="material-symbols-outlined select-none">mail</span>
              {trayItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-champagne-gold text-[#fcf9f8] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#fcf9f8]">
                  {trayItems.length}
                </span>
              )}
            </button>
            <Link
              href={currentUser ? "/profile" : "/login"}
              aria-label={currentUser ? "Profile" : "Login"}
              className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                currentUser
                  ? "bg-champagne-gold/20 text-emerald-deep ring-1 ring-champagne-gold/40"
                  : "hover:bg-gold-glimmer text-emerald-deep"
              }`}
            >
              {currentUser ? (
                <span className="w-5 h-5 rounded-full bg-emerald-deep text-linen-white text-[10px] font-bold flex items-center justify-center select-none">
                  {(currentUser.name || currentUser.email || "U").charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="material-symbols-outlined select-none">person</span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex justify-center items-center gap-8 pb-3 mt-1">
          {isMenuLoading ? (
            <div className="flex items-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-3 rounded-sm animate-pulse bg-champagne-gold/15"
                  style={{ width: `${50 + i * 12}px` }}
                />
              ))}
            </div>
          ) : links.map((link) => {
            const active = isActive(link.href);
            const hasSubmenus = link.submenus && link.submenus.length > 0;
            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => hasSubmenus && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  className={`font-label-caps text-xs tracking-wider transition-colors duration-300 relative pb-1 flex items-center gap-1 ${
                    active
                      ? "text-champagne-gold font-semibold"
                      : "text-on-surface-variant hover:text-emerald-deep nav-link-hover"
                  }`}
                  href={link.href}
                >
                  {link.label}
                  {hasSubmenus && (
                    <span className={`material-symbols-outlined text-[10px] select-none transition-transform duration-300 ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}>expand_more</span>
                  )}
                  {/* Active indicator bar */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-champagne-gold transition-all duration-400 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>

                {/* Dropdown submenu */}
                {hasSubmenus && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 z-50 ${
                      openDropdown === link.label
                        ? "opacity-100 pointer-events-auto translate-y-0"
                        : "opacity-0 pointer-events-none -translate-y-1"
                    }`}
                  >
                    <div className="bg-surface-container-lowest border border-champagne-gold/20 shadow-xl min-w-[200px] py-2">
                      {link.submenus!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-5 py-2.5 font-label-caps text-[11px] tracking-wider text-on-surface-variant hover:text-emerald-deep hover:bg-gold-glimmer/30 transition-colors duration-200"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Backdrop - Placed outside nav to prevent blur constraint */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Navigation Panel - Placed outside nav to prevent blur constraint */}
      <div
        className={`fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[#fcf9f8] h-full z-50 p-6 border-r border-champagne-gold/20 shadow-2xl ease-[cubic-bezier(0.16,1,0.3,1)] transition-transform duration-500 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center pb-6 border-b border-outline-variant/20">
          <Link
            className="font-headline-md text-lg tracking-widest text-emerald-deep uppercase flex items-center h-10 hover:opacity-80 transition-opacity"
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {logoType === "image" && logoImage ? (
              <img
                src={logoImage}
                alt={logoText}
                className="max-h-8 w-auto object-contain"
              />
            ) : (
              logoText
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
            className="hover:bg-gold-glimmer p-2 rounded-full text-emerald-deep cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 mt-6">
          {isMenuLoading ? (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div
                    className="h-4 rounded-sm animate-pulse bg-champagne-gold/15"
                    style={{ width: `${60 + i * 15}px` }}
                  />
                  <div className="border-b border-outline-variant/20" />
                </div>
              ))}
            </div>
          ) : links.map((link, idx) => {
            const active = isActive(link.href);
            const hasSubmenus = link.submenus && link.submenus.length > 0;
            const isMobileExpanded = expandedMobile === link.label;
            return (
              <div
                key={link.label}
                style={{ transitionDelay: `${idx * 50}ms` }}
                className={`transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-caps text-sm uppercase tracking-wider py-2 transition-all duration-300 block flex-grow ${
                      active
                        ? "text-champagne-gold pl-3 border-l-2 border-l-champagne-gold font-semibold"
                        : "text-emerald-deep hover:text-champagne-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {hasSubmenus && (
                    <button
                      onClick={() => setExpandedMobile(isMobileExpanded ? null : link.label)}
                      className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer transition-colors"
                      aria-label="Toggle submenu"
                    >
                      <span className={`material-symbols-outlined text-sm select-none transition-transform duration-300 ${
                        isMobileExpanded ? "rotate-180" : ""
                      }`}>expand_more</span>
                    </button>
                  )}
                </div>
                {/* Mobile Submenus */}
                {hasSubmenus && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="pl-6 pt-1 pb-2 space-y-1">
                      {link.submenus!.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block font-label-caps text-xs uppercase tracking-wider py-1.5 text-on-surface-variant hover:text-champagne-gold transition-colors duration-200"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-b border-outline-variant/20" />
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-deep opacity-80">
            <span className="material-symbols-outlined select-none text-xl">phone_in_talk</span>
            <span className="font-body-md text-xs">{phone}</span>
          </div>
          <p className="font-label-caps text-[10px] text-on-surface-variant/60 uppercase tracking-widest leading-relaxed">
            Gemshouse London • New York • Geneva • Surat
          </p>
        </div>
      </div>

      {/* Inquiry Tray Side Drawer */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isTrayOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsTrayOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#fcf9f8] h-full z-[101] p-6 border-l border-champagne-gold/20 shadow-2xl flex flex-col justify-between transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isTrayOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-5 border-b border-outline-variant/20 mb-5">
            <div>
              <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-0.5">
                Acquisition Portfolio
              </span>
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                Acquisition Inquiry Tray
              </h3>
            </div>
            <button
              onClick={() => setIsTrayOpen(false)}
              className="text-emerald-deep hover:text-champagne-gold p-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined select-none text-xl">close</span>
            </button>
          </div>

          {traySuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-2xl select-none">check_circle</span>
              </div>
              <h4 className="font-headline-sm text-emerald-deep font-semibold text-sm">Portfolio Transmitted</h4>
              <p className="text-xs text-on-surface-variant/80 max-w-xs leading-relaxed">
                Your portfolio inquiry has been filed. A concierge agent will email you a combined procurement proposal.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Items List */}
              <div className="flex-grow overflow-y-auto scrollbar-none pr-1 space-y-4 pb-4">
                {trayItems.length > 0 ? (
                  trayItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3.5 bg-surface-container-low/35 border border-outline-variant/20 relative group hover:border-champagne-gold/40 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-14 h-18 object-cover border border-outline-variant/20 flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0 pr-6">
                        <h4 className="text-xs font-semibold text-emerald-deep truncate leading-tight mb-1">{item.title}</h4>
                        <p className="text-[10px] text-on-surface-variant/75 font-mono mb-1.5">
                          {item.carat} • {item.cut} • SKU: {item.sku}
                        </p>
                        <p className="text-xs font-semibold text-champagne-gold">
                          ${item.price ? Number(item.price).toLocaleString() : "P.O.A"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromTray(item.id)}
                        className="absolute top-2 right-2 text-on-surface-variant hover:text-red-600 p-1 cursor-pointer transition-colors"
                        title="Remove stone"
                      >
                        <span className="material-symbols-outlined text-sm select-none">delete</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <span className="material-symbols-outlined text-outline/50 text-4xl mb-2 select-none">
                      database
                    </span>
                    <p className="text-xs text-on-surface-variant/65">
                      Your inquiry tray is empty. Add rare stones to catalog them for a unified quote.
                    </p>
                  </div>
                )}
              </div>

              {/* Form Block (only if tray has items) */}
              {trayItems.length > 0 && (
                <div className="border-t border-outline-variant/20 pt-4 bg-[#fcf9f8] space-y-4 flex-shrink-0">
                  {trayError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-700 font-body-sm text-[11px] p-3 flex items-start gap-2">
                      <span className="material-symbols-outlined text-xs select-none mt-0.5">error</span>
                      <span>{trayError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={trayName}
                        onChange={(e) => setTrayName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full bg-white border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-[11px] py-2 px-2.5 transition-colors rounded-none text-on-surface font-body-md"
                      />
                    </div>
                    <div>
                      <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={trayEmail}
                        onChange={(e) => setTrayEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-white border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-[11px] py-2 px-2.5 transition-colors rounded-none text-on-surface font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={trayPhone}
                      onChange={(e) => setTrayPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-[11px] py-2 px-2.5 transition-colors rounded-none text-on-surface font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1">
                      Procurement Notes *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={trayMessage}
                      onChange={(e) => setTrayMessage(e.target.value)}
                      placeholder="Specify customized settings or delivery parameters..."
                      className="w-full bg-white border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-[11px] py-2 px-2.5 transition-colors rounded-none text-on-surface font-body-md resize-none"
                    />
                  </div>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!trayName || !trayEmail || !trayMessage) {
                        setTrayError("Please complete all required fields.");
                        return;
                      }
                      setIsSubmittingTray(true);
                      setTrayError(null);
                      try {
                        const res = await fetch("/api/inquiries", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: trayName,
                            email: trayEmail,
                            phone: trayPhone,
                            message: trayMessage,
                            productSkus: trayItems.map((item) => item.sku).join(", "),
                            inquiryType: "MULTI_PRODUCT",
                            userId: currentUser?.id || null
                          })
                        });

                        if (!res.ok) {
                          const data = await res.json();
                          setTrayError(data.error || "Failed to submit inquiry.");
                          setIsSubmittingTray(false);
                          return;
                        }

                        setTraySuccess(true);
                        localStorage.removeItem("gemshouse_inquiry_tray");
                        setTrayItems([]);
                        window.dispatchEvent(new Event("inquiry_tray_updated"));
                        setTimeout(() => {
                          setIsTrayOpen(false);
                          setTraySuccess(false);
                          setTrayMessage("I would like to inquire about the collection of gemstones in my tray.");
                        }, 2500);
                      } catch (err) {
                        setTrayError("Network issue. Please try again.");
                      } finally {
                        setIsSubmittingTray(false);
                      }
                    }}
                    disabled={isSubmittingTray}
                    className="w-full py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-xs tracking-widest uppercase transition-colors border border-champagne-gold/30 disabled:opacity-50 cursor-pointer text-center flex items-center justify-center"
                  >
                    {isSubmittingTray ? "Transmitting Portfolio..." : "Submit Combined Inquiry"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}