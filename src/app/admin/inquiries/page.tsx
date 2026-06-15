"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: string;
  title: string;
  sku: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  isBusinessUser: boolean;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  inquiryType: string;
  productSkus: string | null;
  createdAt: string;
  updatedAt: string;
  productId: string | null;
  product: Product | null;
  userId: string | null;
  user: User | null;
}

interface Message {
  id: string;
  sender: string;
  message: string;
  createdAt: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending Review", color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  { value: "UNDER_NEGOTIATION", label: "Under Negotiation", color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
  { value: "CLOSED_WON", label: "Closed Won", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { value: "CLOSED_LOST", label: "Closed Lost", color: "text-red-600 bg-red-500/10 border-red-500/20" },
];

interface PreviewProduct {
  id: string;
  title: string;
  sku: string;
  gemType: string;
  carat: number;
  color: string | null;
  clarity: string | null;
  cut: string | null;
  origin: string | null;
  certification: string | null;
  price: string;
  inStock: boolean;
  images: { url: string; isPrimary: boolean }[];
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [groupByUser, setGroupByUser] = useState(false);
  const [expandedCustomerEmail, setExpandedCustomerEmail] = useState<string | null>(null);
  
  // Messaging inside detail drawer
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Product quick preview (supports multiple open cards)
  const [previewProducts, setPreviewProducts] = useState<Record<string, PreviewProduct | null>>({});
  const [loadingPreviews, setLoadingPreviews] = useState<Record<string, boolean>>({});

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = groupByUser ? 100 : 10; // increase limit when grouping to load wider context

  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInspectSku = async (sku: string) => {
    // Toggle off if already showing this SKU
    if (sku in previewProducts) {
      setPreviewProducts((prev) => {
        const next = { ...prev };
        delete next[sku];
        return next;
      });
      setLoadingPreviews((prev) => {
        const next = { ...prev };
        delete next[sku];
        return next;
      });
      return;
    }
    setLoadingPreviews((prev) => ({ ...prev, [sku]: true }));
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(sku)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        setPreviewProducts((prev) => ({
          ...prev,
          [sku]: data.products?.[0] || null,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch product preview", err);
      setPreviewProducts((prev) => ({ ...prev, [sku]: null }));
    } finally {
      setLoadingPreviews((prev) => ({ ...prev, [sku]: false }));
    }
  };

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

  const loadMessages = async (inquiryId: string) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Error loading chat messages", err);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [page, selectedStatus, groupByUser]);

  useEffect(() => {
    if (selectedInquiry) {
      loadMessages(selectedInquiry.id);
    } else {
      setMessages([]);
    }
    // Reset product previews when switching inquiries
    setPreviewProducts({});
    setLoadingPreviews({});
  }, [selectedInquiry]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedInquiry) return;
    setIsSendingMessage(true);

    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "ADMIN",
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      } else {
        console.error("Failed sending message");
      }
    } catch (err) {
      console.error("Failed sending reply", err);
    } finally {
      setIsSendingMessage(false);
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

  // Grouping logic for "Group by User" toggle
  const groupedCustomers = React.useMemo(() => {
    const groups: { [email: string]: { name: string; email: string; isBusiness: boolean; phone: string | null; inquiries: Inquiry[] } } = {};
    inquiries.forEach((inq) => {
      const email = inq.email.toLowerCase();
      if (!groups[email]) {
        groups[email] = {
          name: inq.name,
          email: inq.email,
          isBusiness: inq.user?.isBusinessUser || false,
          phone: inq.phone,
          inquiries: [],
        };
      }
      groups[email].inquiries.push(inq);
    });
    return Object.values(groups);
  }, [inquiries]);

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setGroupByUser(!groupByUser);
              setExpandedCustomerEmail(null);
            }}
            className={`px-4 py-2.5 font-label-caps text-[9px] uppercase tracking-wider font-bold transition-all border cursor-pointer ${
              groupByUser
                ? "bg-emerald-deep text-linen-white border-champagne-gold/35 shadow"
                : "border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {groupByUser ? "Ungroup Inquiries" : "Group by Customer"}
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

      {/* Group by Customer view */}
      {groupByUser ? (
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
              Loading grouped client profiles...
            </div>
          ) : groupedCustomers.length > 0 ? (
            groupedCustomers.map((cust) => {
              const isExpanded = expandedCustomerEmail === cust.email;
              return (
                <div
                  key={cust.email}
                  className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm transition-all"
                >
                  {/* Customer row summary */}
                  <div
                    onClick={() => setExpandedCustomerEmail(isExpanded ? null : cust.email)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-headline-sm text-base text-emerald-deep font-semibold">
                          {cust.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[8px] font-label-caps uppercase tracking-wider font-semibold ${
                          cust.isBusiness
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                            : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant"
                        }`}>
                          {cust.isBusiness ? "B2B Client" : "Retail User"}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-on-surface-variant/75 mt-1">{cust.email}</p>
                      {cust.phone && <p className="text-[10px] text-on-surface-variant/60 mt-0.5">☎ {cust.phone}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-wider font-bold block">
                          {cust.inquiries.length} {cust.inquiries.length === 1 ? "Inquiry" : "Inquiries"}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/65">Click to expand user dossier</span>
                      </div>
                      <span className={`material-symbols-outlined text-champagne-gold transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}>
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Expanded list of nested inquiries */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant/15 bg-surface-container-low/10 p-5 space-y-4">
                      <h4 className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">
                        User Inquiry History Log
                      </h4>
                      <div className="divide-y divide-outline-variant/10 border border-outline-variant/20 bg-white shadow-inner">
                        {cust.inquiries.map((inq) => {
                          const badge = statusOptions.find((o) => o.value === inq.status);
                          return (
                            <div
                              key={inq.id}
                              className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-low/20 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-label-caps text-[9px] uppercase tracking-wider font-semibold text-champagne-gold">
                                    {inq.inquiryType}
                                  </span>
                                  {inq.product ? (
                                    <span className="text-xs text-emerald-deep font-semibold">
                                      Asset: {inq.product.title} (SKU: {inq.product.sku})
                                    </span>
                                  ) : inq.productSkus ? (
                                    <span className="text-xs text-emerald-deep font-semibold">
                                      Tray SKUs: {inq.productSkus}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-on-surface-variant italic">
                                      General Consultation
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-on-surface-variant line-clamp-2 italic pr-4">
                                  "{inq.message}"
                                </p>
                                <p className="text-[10px] text-on-surface-variant/50 font-mono">
                                  Received: {new Date(inq.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 flex-shrink-0">
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

                                <div className="flex gap-1.5">
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
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 border border-dashed border-outline-variant/30 bg-surface-container-lowest">
              <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
                group
              </span>
              <p className="text-on-surface-variant text-sm">No user profiles with active inquiries found.</p>
            </div>
          )}
        </div>
      ) : (
        /* Standard chronological view */
        isLoading ? (
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
                        ) : inq.productSkus ? (
                          <div>
                            <span className="block text-emerald-deep font-semibold">Multi-Product Inquiry</span>
                            <span className="text-[9px] font-mono text-on-surface-variant uppercase">
                              SKUs: {inq.productSkus}
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
        )
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

              {/* Asset of Interest section with SKU list parser */}
              <div className="border-t border-outline-variant/10 pt-4">
                {selectedInquiry.inquiryType === "MULTI_PRODUCT" && selectedInquiry.productSkus ? (
                  <div className="space-y-2">
                    <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-1 font-bold">
                      Combined Portfolio Assets (Multiple SKUs)
                    </span>
                    <div className="p-3 bg-surface-container-low/20 border border-outline-variant/15 space-y-2">
                      {selectedInquiry.productSkus.split(",").map((s) => s.trim()).map((sku) => {
                        const prod = previewProducts[sku];
                        const isLoading = loadingPreviews[sku];
                        const isOpen = sku in previewProducts;
                        return (
                        <div key={sku}>
                          <div className="flex justify-between items-center py-1 border-b border-outline-variant/10 last:border-b-0">
                            <span className="font-mono text-xs text-emerald-deep font-semibold">SKU: {sku}</span>
                            <button
                              onClick={() => handleInspectSku(sku)}
                              className={`px-3 py-1 border font-label-caps text-[8px] uppercase tracking-wider cursor-pointer transition-colors font-semibold ${
                                isOpen
                                  ? "border-emerald-deep bg-emerald-deep text-linen-white"
                                  : "border-champagne-gold text-emerald-deep hover:bg-champagne-gold/15"
                              }`}
                            >
                              {isLoading ? "Loading..." : isOpen ? "Close" : "Inspect"}
                            </button>
                          </div>
                          {/* Inline product card for this SKU */}
                          {isOpen && (
                            <div className="mt-2 mb-1">
                              {isLoading ? (
                                <div className="p-4 text-center text-on-surface-variant/55 text-[10px] font-label-caps uppercase tracking-widest border border-outline-variant/10 bg-white">
                                  Fetching product data...
                                </div>
                              ) : prod ? (
                                <div className="border border-outline-variant/20 bg-white shadow-md p-4 flex gap-4">
                                  {prod.images?.length > 0 ? (
                                    <img
                                      src={prod.images.find((i: { isPrimary: boolean }) => i.isPrimary)?.url || prod.images[0].url}
                                      alt={prod.title}
                                      className="w-20 h-20 object-cover border border-outline-variant/15 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-20 h-20 bg-surface-container-low border border-outline-variant/15 flex items-center justify-center flex-shrink-0">
                                      <span className="material-symbols-outlined text-on-surface-variant/30 text-2xl select-none">diamond</span>
                                    </div>
                                  )}
                                  <div className="flex-grow space-y-1.5">
                                    <p className="font-semibold text-emerald-deep text-sm">{prod.title}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-on-surface-variant">
                                      <span><b>Type:</b> {prod.gemType}</span>
                                      <span><b>Carat:</b> {prod.carat}ct</span>
                                      {prod.color && <span><b>Color:</b> {prod.color}</span>}
                                      {prod.clarity && <span><b>Clarity:</b> {prod.clarity}</span>}
                                      {prod.cut && <span><b>Cut:</b> {prod.cut}</span>}
                                      {prod.origin && <span><b>Origin:</b> {prod.origin}</span>}
                                      {prod.certification && <span><b>Cert:</b> {prod.certification}</span>}
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                      <span className="font-semibold text-champagne-gold text-sm">${Number(prod.price).toLocaleString()}</span>
                                      <span className={`text-[8px] font-label-caps uppercase tracking-wider px-2 py-0.5 border ${
                                        prod.inStock
                                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                          : "bg-red-500/10 border-red-500/20 text-red-600"
                                      }`}>
                                        {prod.inStock ? "In Stock" : "Sold"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 text-center text-on-surface-variant/55 text-[10px] border border-outline-variant/10 bg-white italic">
                                  No product found for SKU &quot;{sku}&quot;
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold">
                      Asset of Interest
                    </span>
                    {selectedInquiry.product ? (() => {
                      const pSku = selectedInquiry.product!.sku;
                      const prod = previewProducts[pSku];
                      const isLoading = loadingPreviews[pSku];
                      const isOpen = pSku in previewProducts;
                      return (
                      <div>
                        <div className="p-3 bg-surface-container-low/20 border border-outline-variant/15 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-emerald-deep">{selectedInquiry.product!.title}</p>
                            <p className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5 uppercase">
                              SKU: {pSku}
                            </p>
                          </div>
                          <button
                            onClick={() => handleInspectSku(pSku)}
                            className={`px-3 py-1.5 border font-label-caps text-[8px] uppercase tracking-wider cursor-pointer transition-colors font-semibold ${
                              isOpen
                                ? "border-emerald-deep bg-emerald-deep text-linen-white"
                                : "border-champagne-gold text-emerald-deep hover:bg-champagne-gold/15"
                            }`}
                          >
                            {isLoading ? "Loading..." : isOpen ? "Close" : "Inspect stone"}
                          </button>
                        </div>
                        {/* Inline product card for single product */}
                        {isOpen && (
                          <div className="mt-2">
                            {isLoading ? (
                              <div className="p-4 text-center text-on-surface-variant/55 text-[10px] font-label-caps uppercase tracking-widest border border-outline-variant/10 bg-white">
                                Fetching product data...
                              </div>
                            ) : prod ? (
                              <div className="border border-outline-variant/20 bg-white shadow-md p-4 flex gap-4">
                                {prod.images?.length > 0 ? (
                                  <img
                                    src={prod.images.find((i: { isPrimary: boolean }) => i.isPrimary)?.url || prod.images[0].url}
                                    alt={prod.title}
                                    className="w-24 h-24 object-cover border border-outline-variant/15 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-24 h-24 bg-surface-container-low border border-outline-variant/15 flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl select-none">diamond</span>
                                  </div>
                                )}
                                <div className="flex-grow space-y-1.5">
                                  <p className="font-semibold text-emerald-deep text-sm">{prod.title}</p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-on-surface-variant">
                                    <span><b>Type:</b> {prod.gemType}</span>
                                    <span><b>Carat:</b> {prod.carat}ct</span>
                                    {prod.color && <span><b>Color:</b> {prod.color}</span>}
                                    {prod.clarity && <span><b>Clarity:</b> {prod.clarity}</span>}
                                    {prod.cut && <span><b>Cut:</b> {prod.cut}</span>}
                                    {prod.origin && <span><b>Origin:</b> {prod.origin}</span>}
                                    {prod.certification && <span><b>Cert:</b> {prod.certification}</span>}
                                  </div>
                                  <div className="flex items-center gap-3 pt-1">
                                    <span className="font-semibold text-champagne-gold text-sm">${Number(prod.price).toLocaleString()}</span>
                                    <span className={`text-[8px] font-label-caps uppercase tracking-wider px-2 py-0.5 border ${
                                      prod.inStock
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                        : "bg-red-500/10 border-red-500/20 text-red-600"
                                    }`}>
                                      {prod.inStock ? "In Stock" : "Sold"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 text-center text-on-surface-variant/55 text-[10px] border border-outline-variant/10 bg-white italic">
                                No product found for this SKU
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      );
                    })() : (
                      <p className="text-on-surface-variant/75 italic">General Concierge Consult (No specific gemstone linked)</p>
                    )}
                  </>
                )}
              </div>

              {/* Chat Thread reply panel */}
              <div className="border-t border-outline-variant/10 pt-4 flex flex-col h-[280px] overflow-hidden">
                <span className="font-label-caps text-[8px] text-on-surface-variant/65 uppercase tracking-wider block mb-2 font-bold flex-shrink-0">
                  Concierge Live Messaging Channel
                </span>
                
                {/* Scrollable messages log */}
                <div className="flex-grow overflow-y-auto bg-surface-container-low/40 border border-outline-variant/10 p-3.5 space-y-3 scrollbar-none flex flex-col">
                  {messages.length > 0 ? (
                    messages.map((msg) => {
                      const isAdmin = msg.sender === "ADMIN";
                      return (
                        <div
                          key={msg.id}
                          className={`max-w-[85%] rounded p-2.5 text-xs leading-relaxed ${
                            isAdmin
                              ? "bg-emerald-deep text-linen-white self-end"
                              : "bg-white text-on-surface border border-outline-variant/20 self-start"
                          }`}
                        >
                          <p className="font-semibold text-[8px] uppercase tracking-wide opacity-80 mb-0.5">
                            {isAdmin ? "You (Concierge)" : selectedInquiry.name}
                          </p>
                          <p className="font-normal">{msg.message}</p>
                          <p className="text-[7px] text-right opacity-60 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-center p-4">
                      <p className="text-[10px] text-on-surface-variant/65 italic">No message logs recorded.</p>
                    </div>
                  )}
                </div>

                {/* Text input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-2 flex-shrink-0">
                  <input
                    type="text"
                    required
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a concierge response..."
                    disabled={isSendingMessage}
                    className="flex-grow bg-white border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !newMessage.trim()}
                    className="px-4 py-2 bg-emerald-deep hover:bg-emerald-deep/95 text-linen-white font-label-caps text-[9px] uppercase tracking-wider border border-champagne-gold/25 cursor-pointer disabled:opacity-40 transition-colors"
                  >
                    Send
                  </button>
                </form>
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