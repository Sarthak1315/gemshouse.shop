"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
      { label: "Inquiries", href: "/admin/inquiries", icon: "mail" },
      { label: "Subscribers", href: "/admin/subscribers", icon: "subscriptions" },
      { label: "Dealers", href: "/admin/dealers", icon: "handshake" },
      { label: "Ateliers Network", href: "/admin/ateliers", icon: "public" },
    ],
  },
  {
    items: [
      { label: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
      { label: "Collections", href: "/admin/collections", icon: "folder_open" },
    ],
  },
  {
    title: "Storefront",
    items: [
      { label: "Menu Management", href: "/admin/menus", icon: "schema" },
      { label: "Reviews", href: "/admin/reviews", icon: "star" },
      { label: "FAQs", href: "/admin/faqs", icon: "quiz" },
      { label: "Blogs", href: "/admin/blogs", icon: "article" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Users", href: "/admin/users", icon: "group" },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-sidebar-collapsed") === "true";
    }
    return false;
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Persist collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("admin-sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Fetch session user
  useEffect(() => {
    if (pathname === "/admin/login") return;

    async function loadUser() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data?.user) {
          setAdminUser(data.user);
        } else {
          // Fallback redirect if session died
          router.push("/admin/login");
        }
      } catch (err) {
        console.error("Failed loading session user", err);
      }
    }
    loadUser();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/login");
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

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md antialiased">
      {/* SideNavbar for Desktop */}
      <aside
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 bg-surface-container-lowest dark:bg-charcoal border-r border-outline-variant/20 z-40 py-4 gap-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {/* Header */}
        <div className={`flex flex-col items-center border-b border-outline-variant/10 mb-4 transition-all duration-300 ${isCollapsed ? "px-2 py-4" : "px-6 py-6"}`}>
          <div className={`rounded-full bg-surface-container-low flex items-center justify-center border border-champagne-gold/30 transition-all duration-300 ${isCollapsed ? "w-10 h-10 mb-0" : "w-14 h-14 mb-3"}`}>
            <span className={`material-symbols-outlined text-emerald-deep dark:text-champagne-gold select-none transition-all duration-300 ${isCollapsed ? "text-xl" : "text-2xl"}`}>
              diamond
            </span>
          </div>
          {!isCollapsed && (
            <>
              <h1 className="font-headline-sm text-lg text-emerald-deep dark:text-linen-white tracking-wider uppercase">
                GEMSHOUSE
              </h1>
              <p className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">
                Console Suite
              </p>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 overflow-y-auto space-y-4 scrollbar-none transition-all duration-300 ${isCollapsed ? "px-1.5" : "px-4"}`}>
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.title && !isCollapsed && (
                <div className="font-label-caps text-[9px] text-on-surface-variant/40 dark:text-linen-white/30 uppercase tracking-widest px-4 pt-2 pb-1 select-none font-semibold">
                  {group.title}
                </div>
              )}
              {group.title && isCollapsed && (
                <div className="h-[1px] bg-outline-variant/15 mx-2 my-2" />
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded transition-all duration-200 group cursor-pointer ${
                      isCollapsed
                        ? "justify-center px-0 py-2.5"
                        : "px-4 py-2.5"
                    } ${
                      isActive
                        ? "bg-emerald-deep text-linen-white"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-emerald-deep dark:hover:text-champagne-gold"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg select-none ${
                        isCollapsed ? "" : "mr-3"
                      } ${
                        isActive ? "text-champagne-gold" : "group-hover:text-champagne-gold transition-colors"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`pb-4 pt-4 border-t border-outline-variant/10 transition-all duration-300 ${isCollapsed ? "px-1.5" : "px-4"}`}>
          {/* View Storefront */}
          {isCollapsed ? (
            <button
              onClick={handleViewStorefront}
              title="View Storefront"
              className="w-full mb-2 bg-emerald-deep text-linen-white py-2.5 hover:bg-emerald-deep/90 transition-colors flex items-center justify-center rounded-none border border-champagne-gold/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">open_in_new</span>
            </button>
          ) : (
            <button
              onClick={handleViewStorefront}
              className="w-full mb-3 bg-emerald-deep text-linen-white font-label-caps text-[10px] uppercase tracking-widest py-3 hover:bg-emerald-deep/90 transition-colors flex items-center justify-center gap-2 rounded-none border border-champagne-gold/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm select-none">open_in_new</span>
              View Storefront
            </button>
          )}

          {/* Logout */}
          <div className="space-y-0.5">
            {isCollapsed ? (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="w-full flex items-center justify-center py-2.5 text-on-surface-variant hover:bg-red-950/10 hover:text-red-600 rounded transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base group-hover:text-red-500 transition-colors select-none">
                  logout
                </span>
              </button>
            ) : (
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
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-full flex items-center mt-2 py-2 text-on-surface-variant/50 hover:text-champagne-gold hover:bg-surface-container-low rounded transition-all duration-200 cursor-pointer ${
              isCollapsed ? "justify-center px-0" : "px-4"
            }`}
          >
            <span className={`material-symbols-outlined text-base select-none transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}>
              left_panel_close
            </span>
            {!isCollapsed && (
              <span className="font-label-caps text-[9px] uppercase tracking-wider ml-3 font-semibold">
                Collapse
              </span>
            )}
          </button>
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
          className={`w-[260px] h-full bg-surface-container-lowest dark:bg-charcoal flex flex-col p-4 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20 flex-shrink-0">
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

          <nav className="flex-1 overflow-y-auto space-y-4 scrollbar-none pr-1 mb-4">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {group.title && (
                  <div className="font-label-caps text-[9px] text-on-surface-variant/40 dark:text-linen-white/30 uppercase tracking-widest px-4 pt-2 pb-1 select-none font-semibold">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => {
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
              </div>
            ))}
          </nav>

          <div className="pt-4 border-t border-outline-variant/20 space-y-2 flex-shrink-0">
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
      <div className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ml-0 ${isCollapsed ? "md:ml-[68px]" : "md:ml-64"}`}>
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