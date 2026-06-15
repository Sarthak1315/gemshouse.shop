"use client";

import React, { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  parentMenuId: string | null;
  submenus?: MenuItem[];
}

export default function MenusPage() {
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [flatMenus, setFlatMenus] = useState<MenuItem[]>([]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Form Fields
  const [formLabel, setFormLabel] = useState("");
  const [formHref, setFormHref] = useState("");
  const [formOrder, setFormOrder] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formParentMenuId, setFormParentMenuId] = useState<string>("");

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMenus = async () => {
    setIsLoading(true);
    try {
      // Fetch Tree
      const resTree = await fetch("/api/menus");
      if (resTree.ok) {
        const data = await resTree.json();
        setMenuTree(data);
      }

      // Fetch Flat list for dropdown
      const resFlat = await fetch("/api/menus?all=true");
      if (resFlat.ok) {
        const data = await resFlat.json();
        setFlatMenus(data);
      }
    } catch (err) {
      console.error("Failed loading menus", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const openCreateModal = (parentId: string | null = null) => {
    setFormMode("create");
    setActiveId(null);
    setErrorMsg(null);

    setFormLabel("");
    setFormHref("");
    setFormOrder("0");
    setFormIsActive(true);
    setFormParentMenuId(parentId || "");

    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setFormMode("edit");
    setActiveId(item.id);
    setErrorMsg(null);

    setFormLabel(item.label);
    setFormHref(item.href);
    setFormOrder(String(item.order));
    setFormIsActive(item.isActive);
    setFormParentMenuId(item.parentMenuId || "");

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      label: formLabel,
      href: formHref,
      order: parseInt(formOrder || "0", 10),
      isActive: formIsActive,
      parentMenuId: formParentMenuId || null,
    };

    try {
      const url = formMode === "create" ? "/api/menus" : `/api/menus/${activeId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save menu item");
        return;
      }

      setSuccessMsg("Menu saved successfully!");
      setIsModalOpen(false);
      loadMenus();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error saving menu item");
    }
  };

  const handleDelete = async (item: MenuItem) => {
    const confirmMsg = item.submenus && item.submenus.length > 0
      ? `Are you certain you want to delete menu '${item.label}'? Doing so will permanently delete all its submenus.`
      : `Are you certain you want to delete menu '${item.label}'?`;
      
    if (!confirm(confirmMsg)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/menus/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete");
        return;
      }

      setSuccessMsg("Menu item deleted successfully!");
      loadMenus();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete menu item");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Navigation controls
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Main Menu Links
          </h1>
        </div>
        <div>
          <button
            onClick={() => openCreateModal(null)}
            className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow"
          >
            <span className="material-symbols-outlined text-base select-none">add</span>
            Add Parent Link
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 font-body-sm text-xs p-4 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-sm select-none">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Menus Visual Tree */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading menu structures...
        </div>
      ) : menuTree.length > 0 ? (
        <div className="space-y-4 max-w-4xl">
          {menuTree.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm"
            >
              {/* Parent Row */}
              <div className="flex justify-between items-center p-4 border-b border-outline-variant/10 bg-surface-container-low/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-champagne-gold select-none">link</span>
                  <span className="font-headline-sm text-sm text-emerald-deep font-bold">
                    {item.label}
                  </span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60 bg-surface-container-low px-2 py-0.5 border border-outline-variant/20">
                    {item.href}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[8px] font-label-caps uppercase tracking-wider ${
                      item.isActive
                        ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/10"
                        : "bg-surface-variant text-on-surface-variant/60 border border-outline-variant/10"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-caps">
                    Order: {item.order}
                  </span>
                </div>
                <div className="space-x-1.5 flex items-center">
                  <button
                    onClick={() => openCreateModal(item.id)}
                    className="text-emerald-deep hover:bg-emerald-deep/10 border border-emerald-deep/20 px-2 py-1 font-label-caps text-[8px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs select-none">add</span>
                    Submenu
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-base select-none">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-base select-none">delete</span>
                  </button>
                </div>
              </div>

              {/* Submenus rows */}
              <div className="divide-y divide-outline-variant/10 bg-surface-container-lowest pl-10 pr-4">
                {item.submenus && item.submenus.length > 0 ? (
                  item.submenus.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center py-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-outline-variant select-none text-base">
                          subdirectory_arrow_right
                        </span>
                        <span className="font-semibold text-xs text-on-surface">{sub.label}</span>
                        <span className="font-mono text-[9px] text-on-surface-variant/60">{sub.href}</span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 text-[8px] font-label-caps uppercase tracking-wider ${
                            sub.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-charcoal/10 text-outline"
                          }`}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/50 font-label-caps">
                          Order: {sub.order}
                        </span>
                      </div>
                      <div className="space-x-1.5">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-base select-none">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          className="text-on-surface-variant hover:text-red-600 p-1 cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base select-none">delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3.5 text-left text-on-surface-variant/40 text-[11px] italic pl-6">
                    No submenus defined for this item.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            schema
          </span>
          <p className="text-on-surface-variant text-sm">No navigation links created yet.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {formMode === "create" ? "Create Navigation Link" : "Edit Link Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Link Label Text *
                </label>
                <input
                  type="text"
                  required
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="e.g. Fine Jewelry"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Destination URL/Href *
                </label>
                <input
                  type="text"
                  required
                  value={formHref}
                  onChange={(e) => setFormHref(e.target.value)}
                  placeholder="e.g. /collections/fine-jewelry or http://..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                    Sort Index Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
                <div className="flex items-end pb-3 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="appearance-none w-4 h-4 border border-outline-variant rounded-none checked:bg-emerald-deep checked:border-emerald-deep focus:ring-emerald-deep cursor-pointer"
                    />
                    <span className="font-label-caps text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                      Link Active
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5">
                  Nesting Parent Menu
                </label>
                <select
                  value={formParentMenuId}
                  onChange={(e) => setFormParentMenuId(e.target.value)}
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer font-body-md"
                >
                  <option value="">No Parent (Root Item)</option>
                  {flatMenus
                    .filter((m) => m.id !== activeId && m.parentMenuId === null) // Filter self and submenus to avoid cycle
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.href})
                      </option>
                    ))}
                </select>
              </div>

              <div className="border-t border-outline-variant/15 pt-5 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer"
                >
                  Save Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
