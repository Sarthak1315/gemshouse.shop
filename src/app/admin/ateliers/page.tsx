"use client";

import React, { useState, useEffect } from "react";

interface Atelier {
  id: string;
  city: string;
  name: string;
  role: string;
  phone: string;
  address: string;
  services: string[];
  description: string;
  mapCoords: string;
  order: number;
}

export default function AteliersAdminPage() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Form Fields
  const [formCity, setFormCity] = useState("");
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formServicesText, setFormServicesText] = useState(""); // newline separated
  const [formDescription, setFormDescription] = useState("");
  const [formMapCoords, setFormMapCoords] = useState("");
  const [formOrder, setFormOrder] = useState("0");

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadAteliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ateliers");
      if (res.ok) {
        const data = await res.json();
        setAteliers(data);
      } else {
        console.error("Failed to load ateliers API status:", res.status);
      }
    } catch (err) {
      console.error("Failed loading ateliers", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAteliers();
  }, []);

  const openCreateModal = () => {
    setFormMode("create");
    setActiveId(null);
    setErrorMsg(null);

    setFormCity("");
    setFormName("");
    setFormRole("");
    setFormPhone("");
    setFormAddress("");
    setFormServicesText("");
    setFormDescription("");
    setFormMapCoords("");
    setFormOrder("0");

    setIsModalOpen(true);
  };

  const openEditModal = (atelier: Atelier) => {
    setFormMode("edit");
    setActiveId(atelier.id);
    setErrorMsg(null);

    setFormCity(atelier.city);
    setFormName(atelier.name);
    setFormRole(atelier.role);
    setFormPhone(atelier.phone);
    setFormAddress(atelier.address);
    setFormServicesText(atelier.services.join("\n"));
    setFormDescription(atelier.description);
    setFormMapCoords(atelier.mapCoords);
    setFormOrder(String(atelier.order));

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const services = formServicesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (services.length === 0) {
      setErrorMsg("Please enter at least one service offered at this atelier");
      return;
    }

    const payload = {
      city: formCity.trim(),
      name: formName.trim(),
      role: formRole.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      services,
      description: formDescription.trim(),
      mapCoords: formMapCoords.trim(),
      order: parseInt(formOrder || "0", 10),
    };

    try {
      const url = formMode === "create" ? "/api/ateliers" : `/api/ateliers/${activeId}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save atelier");
        return;
      }

      setSuccessMsg("Atelier location saved successfully!");
      setIsModalOpen(false);
      loadAteliers();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error saving atelier location");
    }
  };

  const handleDelete = async (atelier: Atelier) => {
    if (!confirm(`Are you certain you want to delete the ${atelier.city} atelier location?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/ateliers/${atelier.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete");
        return;
      }

      setSuccessMsg("Atelier location deleted successfully!");
      loadAteliers();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete atelier location");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Global Presence
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Ateliers Network Directory
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 flex items-center gap-2 cursor-pointer transition-colors shadow shrink-0"
        >
          <span className="material-symbols-outlined text-base select-none">add</span>
          Add Atelier
        </button>
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

      {/* Ateliers List */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading ateliers directory...
        </div>
      ) : ateliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ateliers.map((atelier) => (
            <div
              key={atelier.id}
              className="bg-surface-container-lowest border border-outline-variant/20 p-6 shadow-sm hover:border-champagne-gold/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant/15 font-label-caps text-[8px] uppercase tracking-wider font-bold text-emerald-deep">
                      {atelier.city}
                    </span>
                    <h3 className="font-headline-sm text-base text-emerald-deep font-bold mt-1.5">
                      {atelier.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/60 font-label-caps font-medium">
                    Order Index: {atelier.order}
                  </span>
                </div>

                <div className="space-y-2.5 my-4">
                  <div>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold">Role / Focus</span>
                    <span className="text-xs text-on-surface-variant/90 font-medium">{atelier.role}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold">Address</span>
                    <span className="text-xs text-on-surface-variant/85">{atelier.address}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold">Contact Phone</span>
                    <span className="text-xs text-on-surface-variant/85 font-mono">{atelier.phone}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold">Map Coordinates</span>
                    <span className="text-xs text-champagne-gold font-mono">{atelier.mapCoords}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold mb-1">Services Offered</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atelier.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-surface-container-low border border-outline-variant/10 text-[9px] text-on-surface-variant/80 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-outline-variant/10">
                    <span className="text-[9px] text-on-surface-variant/50 uppercase block font-semibold">Description</span>
                    <p className="text-xs text-on-surface-variant/80 leading-relaxed italic mt-0.5">
                      "{atelier.description}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4 mt-2 flex justify-end gap-2.5">
                <button
                  onClick={() => openEditModal(atelier)}
                  className="flex items-center gap-1 text-[10px] font-label-caps uppercase tracking-wider text-emerald-deep hover:text-emerald-deep/80 p-1.5 cursor-pointer border border-outline-variant/30 px-3 hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-xs select-none">edit</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(atelier)}
                  className="flex items-center gap-1 text-[10px] font-label-caps uppercase tracking-wider text-red-600 hover:text-red-700 p-1.5 cursor-pointer border border-red-200 px-3 hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xs select-none">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            public
          </span>
          <p className="text-on-surface-variant text-sm">No ateliers registered in the network.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center bg-surface-container-low/30 shrink-0">
              <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide uppercase">
                {formMode === "create" ? "Add New Atelier Location" : "Edit Atelier Details"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined select-none">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. London"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    Sort Index / Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    Atelier Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mayfair Concierge"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    Role / Subtitle Focus *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Headquarters & Private Sourcing"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +44 (0) 20 7946 0192"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
                <div>
                  <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                    Map Coordinates *
                  </label>
                  <input
                    type="text"
                    required
                    value={formMapCoords}
                    onChange={(e) => setFormMapCoords(e.target.value)}
                    placeholder="e.g. 51.5074° N, 0.1278° W"
                    className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                  Atelier Address *
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. Bruton Place, Mayfair, London W1J"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                  Services Offered * (One service per line)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formServicesText}
                  onChange={(e) => setFormServicesText(e.target.value)}
                  placeholder="Bespoke Sourcing Consultations&#10;Wholesale Inventory Inspections&#10;HNW Private Sales Suite"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md resize-none"
                ></textarea>
              </div>

              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Located in the heart of Mayfair, our London headquarters..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md resize-none"
                ></textarea>
              </div>

              <div className="border-t border-outline-variant/15 pt-5 flex justify-end gap-3 bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6 shrink-0">
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
                  Save Atelier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
