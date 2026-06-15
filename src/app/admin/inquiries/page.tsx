"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  sku: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  productId: string | null;
  product: Product | null;
}

const statusOptions = [
  { value: "PENDING", label: "Pending Review", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  { value: "UNDER_NEGOTIATION", label: "Under Negotiation", color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  { value: "CLOSED_WON", label: "Closed Won", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { value: "CLOSED_LOST", label: "Closed Lost", color: "text-red-600 bg-red-500/10 border-red-500/20" },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Search & Filters
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

  const loadInquiries = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status: selectedStatus,
      });

      const res = await fetch(`/api/inquiries?${queryParams}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalItems(data.pagination?.total || 0);
      } else {
        setErrorMsg("Failed to load inquiries");
      }
    } catch (err) {
      console.error("Error loading inquiries", err);
      setErrorMsg("Failed to connect to inquiries API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [page, selectedStatus]);

  // Debounced/Triggered search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadInquiries();
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
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
      setInquiries((prev) => prev.map((inq) => (inq.id === inquiryId ? updated : inq)));
      
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry(updated);
      }

      setSuccessMsg("Inquiry status updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Error modifying inquiry status");
    }
  };

  const handleDelete = async (inquiry: Inquiry) => {
    if (!confirm(`Are you certain you want to delete the inquiry from '${inquiry.name}'?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to delete inquiry");
        return;
      }

      setSuccessMsg("Inquiry deleted successfully!");
      setSelectedInquiry(null);
      loadInquiries();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete inquiry");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Client Relations
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Inquiry Pipeline
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
            placeholder="Search by client name, email, query..."
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
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading client pipeline...
        </div>
      ) : inquiries.length > 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/15 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/10">
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Client Details
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Interested Asset
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Message Excerpt
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Received Date
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                  Status Pipeline
                </th>
                <th className="p-4 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-xs font-body-md">
              {inquiries.map((inq) => {
                const badge = statusOptions.find((o) => o.value === inq.status);
                return (
                  <tr
                    key={inq.id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-emerald-deep">{inq.name}</div>
                      <div className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5">{inq.email}</div>
                      {inq.phone && (
                        <div className="text-[10px] text-on-surface-variant/75 mt-0.5">☎ {inq.phone}</div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-on-surface">
                      {inq.product ? (
                        <div>
                          <span className="block text-emerald-deep font-semibold">{inq.product.title}</span>
                          <span className="text-[9px] font-mono text-on-surface-variant uppercase">
                            SKU: {inq.product.sku}
                          </span>
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/65">General Consultation</span>
                      )}
                    </td>
                    <td className="p-4 text-on-surface-variant max-w-[200px] truncate">
                      {inq.message}
                    </td>
                    <td className="p-4 text-on-surface-variant/80 font-mono text-[10px]">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
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
                        onClick={() => setSelectedInquiry(inq)}
                        className="text-on-surface-variant hover:text-emerald-deep p-1.5 cursor-pointer"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-base select-none">visibility</span>
                      </button>
                      <button
                        onClick={() => handleDelete(inq)}
                        className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer"
                        title="Delete Inquiry"
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
                Showing page {page} of {totalPages} ({totalItems} total inquiries)
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
            mail
          </span>
          <p className="text-on-surface-variant text-sm">No client inquiries found matching the criteria.</p>
        </div>
      )}

      {/* Details Side-Drawer / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-surface-container-lowest border-l border-outline-variant/30 w-full max-w-lg h-full flex flex-col justify-between shadow-2xl animate-fade-in-right">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-outline-variant/15 bg-surface-container-low/30">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-label-caps text-[8px] tracking-widest text-champagne-gold uppercase block mb-0.5">
                    Pipeline Dossier
                  </span>
                  <h3 className="font-headline-sm text-base text-emerald-deep font-bold">
                    Inquiry Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-on-surface-variant hover:text-emerald-deep p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">close</span>
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none font-body-md text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Client Name
                  </span>
                  <p className="text-sm font-semibold text-emerald-deep">{selectedInquiry.name}</p>
                </div>
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Received Date
                  </span>
                  <p className="text-on-surface font-mono">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-sm text-on-surface hover:text-champagne-gold transition-colors font-mono underline"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1">
                    Phone Number
                  </span>
                  {selectedInquiry.phone ? (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-on-surface hover:text-champagne-gold transition-colors font-mono underline"
                    >
                      {selectedInquiry.phone}
                    </a>
                  ) : (
                    <span className="text-on-surface-variant/50">Not Provided</span>
                  )}
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                  Asset of Interest
                </span>
                {selectedInquiry.product ? (
                  <div className="p-3 bg-surface-container-low/20 border border-outline-variant/15 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-emerald-deep">{selectedInquiry.product.title}</p>
                      <p className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5 uppercase">
                        SKU: {selectedInquiry.product.sku}
                      </p>
                    </div>
                    <a
                      href={`/admin/inventory?search=${selectedInquiry.product.sku}`}
                      className="px-3 py-1.5 border border-champagne-gold text-emerald-deep hover:bg-champagne-gold/15 font-label-caps text-[8px] uppercase tracking-wider cursor-pointer transition-colors font-semibold"
                    >
                      Inspect stone
                    </a>
                  </div>
                ) : (
                  <p className="text-on-surface-variant/75 italic">General Concierge Consult (No specific gemstone linked)</p>
                )}
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                  Client Message
                </span>
                <div className="p-4 bg-surface-container-low/40 border border-outline-variant/10 text-on-surface leading-relaxed text-xs whitespace-pre-wrap whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="border-t border-outline-variant/10 pt-4">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                  Pipeline Progression Status
                </span>
                <div className="flex gap-2 items-center">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className="flex-grow bg-surface-container-low/50 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/15 bg-surface-container-low/20 flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedInquiry)}
                className="px-4 py-2 bg-red-950/15 text-red-600 hover:bg-red-900/20 hover:text-red-700 font-label-caps text-[9px] uppercase tracking-wider border border-red-500/10 cursor-pointer transition-colors"
              >
                Delete Dossier
              </button>
              <button
                onClick={() => setSelectedInquiry(null)}
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