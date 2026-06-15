"use client";

import React, { useState, useEffect } from "react";

interface Dealer {
  id: string;
  companyName: string;
  taxId: string | null;
  website: string | null;
  address: string | null;
  businessType: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending Verification", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  { value: "APPROVED", label: "Approved Partner", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { value: "REJECTED", label: "Rejected Application", color: "text-red-600 bg-red-500/10 border-red-500/20" },
];

export default function DealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDealers = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status: selectedStatus,
      });

      const res = await fetch(`/api/dealers?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setDealers(data.dealers || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalItems(data.pagination?.total || 0);
      } else {
        setErrorMsg("Failed to load dealer records");
      }
    } catch (err) {
      console.error("Error loading dealers", err);
      setErrorMsg("Failed to connect to dealers API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDealers();
  }, [page, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadDealers();
  };

  const handleStatusChange = async (dealerId: string, newStatus: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/dealers/${dealerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update status");
        return;
      }

      const updated = await res.json();
      setDealers((prev) => prev.map((dl) => (dl.id === dealerId ? updated : dl)));

      if (selectedDealer && selectedDealer.id === dealerId) {
        setSelectedDealer(updated);
      }

      setSuccessMsg(`Dealer application marked as ${newStatus.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error modifying dealer status");
    }
  };

  const handleDelete = async (dealer: Dealer) => {
    if (!confirm(`Are you certain you want to delete the record for '${dealer.companyName}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/dealers/${dealer.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete record");
        return;
      }

      setSuccessMsg("Dealer record deleted successfully!");
      setSelectedDealer(null);
      loadDealers();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete dealer record");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Partner CMS
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Wholesale B2B Dealers
          </h1>
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

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/15 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-grow max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, tax ID, location..."
            className="flex-grow bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 px-3 transition-colors rounded-none text-on-surface font-body-md"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[9px] uppercase tracking-wider border border-champagne-gold/25 cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md cursor-pointer"
          >
            <option value="">All Applications</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dealers Table */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading dealer accounts...
        </div>
      ) : dealers.length > 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/15 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/10">
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Company / Organization
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Tax registration ID
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Business category
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Corporate URL
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Filed Date
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Status
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-xs font-body-md">
              {dealers.map((dealer) => {
                const badge = statusOptions.find((o) => o.value === dealer.status);
                return (
                  <tr
                    key={dealer.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-emerald-deep">{dealer.companyName}</div>
                      {dealer.address && (
                        <div className="text-[10px] text-on-surface-variant/70 truncate max-w-[200px] mt-0.5">
                          📍 {dealer.address}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-mono font-medium text-on-surface">
                      {dealer.taxId || <span className="text-on-surface-variant/40 italic">Not Provided</span>}
                    </td>
                    <td className="p-4 text-on-surface-variant">
                      {dealer.businessType || <span className="text-on-surface-variant/40 italic">N/A</span>}
                    </td>
                    <td className="p-4">
                      {dealer.website ? (
                        <a
                          href={dealer.website.startsWith("http") ? dealer.website : `https://${dealer.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-deep hover:text-champagne-gold transition-colors font-mono underline"
                        >
                          {dealer.website}
                        </a>
                      ) : (
                        <span className="text-on-surface-variant/40 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-on-surface-variant/80 font-mono text-[10px]">
                      {new Date(dealer.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <select
                        value={dealer.status}
                        onChange={(e) => handleStatusChange(dealer.id, e.target.value)}
                        className={`text-[9px] font-label-caps uppercase tracking-wider py-1 px-2.5 border rounded-none cursor-pointer focus:outline-none ${
                          badge?.color || "border-outline text-on-surface-variant bg-surface"
                        }`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-surface-container-lowest text-on-surface text-xs">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDealer(dealer)}
                        className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                        title="Review Application"
                      >
                        <span className="material-symbols-outlined text-base select-none">visibility</span>
                      </button>
                      <button
                        onClick={() => handleDelete(dealer)}
                        className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer"
                        title="Delete Record"
                      >
                        <span className="material-symbols-outlined text-base select-none">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-outline-variant/10 flex justify-between items-center bg-surface-container-low/10">
              <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                Showing page {page} of {totalPages} ({totalItems} total records)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-outline-variant/35 disabled:opacity-40 disabled:cursor-not-allowed text-on-surface hover:bg-surface-container-low font-label-caps text-[9px] uppercase tracking-widest cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-outline-variant/35 disabled:opacity-40 disabled:cursor-not-allowed text-on-surface hover:bg-surface-container-low font-label-caps text-[9px] uppercase tracking-widest cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            handshake
          </span>
          <p className="text-on-surface-variant text-sm">No wholesale dealer applications found.</p>
        </div>
      )}

      {/* Details Side-Drawer / Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-surface-container-lowest border-l border-outline-variant/30 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl animate-fade-in-right">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-outline-variant/15 bg-surface-container-low/30">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-caps text-[8px] tracking-widest text-champagne-gold uppercase block mb-0.5">
                    B2B Verification
                  </span>
                  <h3 className="font-headline-sm text-base text-emerald-deep font-bold">
                    Partner Application
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDealer(null)}
                  className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">close</span>
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none font-body-md text-xs">
              <div>
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                  Registered Corporate Name
                </span>
                <p className="text-sm font-semibold text-emerald-deep">{selectedDealer.companyName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Tax Registration Number (VAT/EIN)
                  </span>
                  <p className="text-on-surface font-mono font-semibold">
                    {selectedDealer.taxId || "Not Provided"}
                  </p>
                </div>
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Business Sector Category
                  </span>
                  <p className="text-on-surface font-semibold">
                    {selectedDealer.businessType || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Online Website
                  </span>
                  {selectedDealer.website ? (
                    <a
                      href={selectedDealer.website.startsWith("http") ? selectedDealer.website : `https://${selectedDealer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-on-surface hover:text-champagne-gold transition-colors font-mono underline"
                    >
                      {selectedDealer.website}
                    </a>
                  ) : (
                    <span className="text-on-surface-variant/50">None</span>
                  )}
                </div>
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Application Filing Date
                  </span>
                  <p className="text-on-surface font-mono">
                    {new Date(selectedDealer.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                  Corporate Location Address
                </span>
                <div className="p-3 bg-surface-container-low/40 border border-outline-variant/10 text-on-surface leading-relaxed text-xs">
                  {selectedDealer.address || "No address submitted."}
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                  Wholesale Partner Verification Decision
                </span>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusChange(selectedDealer.id, "APPROVED")}
                    className="flex-1 px-4 py-2.5 bg-emerald-deep text-linen-white hover:bg-emerald-deep/90 font-label-caps text-[9px] uppercase tracking-wider border border-champagne-gold/25 cursor-pointer font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs select-none">verified_user</span>
                    Approve Partner
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedDealer.id, "REJECTED")}
                    className="flex-1 px-4 py-2.5 border border-red-500/20 text-red-600 hover:bg-red-500/5 font-label-caps text-[9px] uppercase tracking-wider cursor-pointer font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs select-none">cancel</span>
                    Reject Application
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low/20 flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedDealer)}
                className="px-4 py-2 bg-red-950/15 text-red-600 hover:bg-red-900/20 hover:text-red-700 font-label-caps text-[9px] uppercase tracking-wider border border-red-500/10 cursor-pointer transition-colors"
              >
                Delete Record
              </button>
              <button
                onClick={() => setSelectedDealer(null)}
                className="px-4 py-2 border border-outline-variant/35 text-on-surface hover:bg-surface-container-low font-label-caps text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}