"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
  { label: "Collections", href: "/admin/collections", icon: "folder_open" },
  { label: "Menu Management", href: "/admin/menus", icon: "schema" },
  { label: "Reviews", href: "/admin/reviews", icon: "star" },
  { label: "FAQs", href: "/admin/faqs", icon: "quiz" },
  { label: "Blogs", href: "/admin/blogs", icon: "article" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "mail" },
  { label: "Dealers", href: "/admin/dealers", icon: "handshake" },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Fetch session user
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data?.user) {
          setAdminUser(data.user);
        } else {
          // Fallback redirect if session died
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed loading session user", err);
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleViewStorefront = () => {
    const isLocalhost = window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1");
    const mainUrl = isLocalhost 
      ? `http://localhost:${window.location.port || "3000"}` 
      : "https://gemshouse.shop";
    window.open(mainUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md antialiased">
      {/* SideNavbar for Desktop */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest dark:bg-charcoal border-r border-outline-variant/20 z-40 py-4 gap-2">
        {/* Header */}
        <div className="px-6 py-6 flex flex-col items-center border-b border-outline-variant/10 mb-4">
          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-3 border border-champagne-gold/30">
            <span className="material-symbols-outlined text-2xl text-emerald-deep dark:text-champagne-gold select-none">
              diamond
            </span>
          </div>
          <h1 className="font-headline-sm text-lg text-emerald-deep dark:text-linen-white tracking-wider uppercase">
            GEMSHOUSE
          </h1>
          <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">
            Console Suite
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-none">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-emerald-deep text-linen-white"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-emerald-deep dark:hover:text-champagne-gold"
                }`}
              >
                <span
                  className={`material-symbols-outlined mr-3 text-lg select-none ${
                    isActive ? "text-champagne-gold" : "group-hover:text-champagne-gold transition-colors"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-4 pt-4 border-t border-outline-variant/10">
          <button
            onClick={handleViewStorefront}
            className="w-full mb-3 bg-emerald-deep text-linen-white font-label-caps text-[10px] uppercase tracking-widest py-3 hover:bg-emerald-deep/90 transition-colors flex items-center justify-center gap-2 rounded-none border border-champagne-gold/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm select-none">open_in_new</span>
            View Storefront
          </button>
          <div className="space-y-0.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-on-surface-variant hover:bg-red-950/10 hover:text-red-600 rounded transition-all duration-200 group cursor-pointer text-left"
            >
              <span className="material-symbols-outlined mr-3 text-base group-hover:text-red-500 transition-colors select-none">
                logout
              </span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <div
          className={`w-[260px] h-full bg-surface-container-lowest dark:bg-charcoal flex flex-col justify-between p-4 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
              <span className="font-headline-sm text-base text-emerald-deep dark:text-linen-white tracking-wider">
                GEMSHOUSE
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep dark:hover:text-champagne-gold p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-2.5 rounded transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "bg-emerald-deep text-linen-white"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-emerald-deep dark:hover:text-champagne-gold"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined mr-3 text-lg select-none ${
                        isActive ? "text-champagne-gold" : "group-hover:text-champagne-gold"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-outline-variant/20 space-y-2">
            <button
              onClick={() => {
                setIsMobileOpen(false);
                handleViewStorefront();
              }}
              className="w-full bg-emerald-deep text-linen-white font-label-caps text-[10px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 border border-champagne-gold/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">open_in_new</span>
              View Storefront
            </button>
            <button
              onClick={() => {
                setIsMobileOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-red-950/10 text-red-600 hover:bg-red-900/20 rounded transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined mr-2 text-base select-none">logout</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center h-20 px-6 md:px-10 w-full z-30 bg-linen-white/80 dark:bg-charcoal/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden text-emerald-deep dark:text-linen-white p-2 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">menu</span>
          </button>

          {/* Mobile title */}
          <div className="md:hidden font-headline-sm text-base tracking-widest text-emerald-deep dark:text-linen-white text-center flex-1">
            GEMSHOUSE
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block">
            <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-0.5">
              Secure Operations
            </span>
            <h2 className="font-headline-sm text-lg text-emerald-deep dark:text-linen-white font-semibold tracking-wide">
              Management Portal
            </h2>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            {/* Session profile info */}
            {adminUser && (
              <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
                <div className="text-right hidden sm:block">
                  <p className="font-label-caps text-[10px] text-emerald-deep dark:text-linen-white font-semibold uppercase tracking-wider">
                    {adminUser.name || "Administrator"}
                  </p>
                  <p className="text-[8px] text-on-surface-variant dark:text-champagne-gold font-label-caps uppercase tracking-widest">
                    {adminUser.role || "ADMIN"}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-deep flex items-center justify-center border border-champagne-gold/45 text-linen-white text-xs font-semibold select-none shadow">
                  {(adminUser.name || "A").charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-grow p-6 md:p-10 max-w-container-max w-full mx-auto pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}