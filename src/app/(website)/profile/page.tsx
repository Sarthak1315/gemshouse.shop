"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/website/navbar/Navbar";
import Footer from "@/components/website/footer/Footer";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  isBusinessUser: boolean;
  role: { name: string };
}

interface Message {
  id: string;
  inquiryId: string;
  sender: "CLIENT" | "ADMIN";
  senderId?: string | null;
  message: string;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
  inquiryType: "DIRECT" | "SINGLE_PRODUCT" | "MULTI_PRODUCT";
  productSkus?: string | null;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    sku: string;
  } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"account" | "inquiries">("inquiries");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Account Settings Form State
  const [profileName, setProfileName] = useState("");
  const [profileBusiness, setProfileBusiness] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Check login
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push("/login?from=/profile");
          return;
        }
        const data = await res.json();
        setUser(data);
        setProfileName(data.name || "");
        setProfileBusiness(data.isBusinessUser || false);
      } catch (err) {
        console.error("Failed to load user profile", err);
        router.push("/login?from=/profile");
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadProfile();
  }, [router]);

  // Load Inquiries
  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    async function fetchInquiries() {
      setIsLoadingInquiries(true);
      try {
        const res = await fetch(`/api/inquiries?userId=${userId}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          setInquiries(data.inquiries || []);
        }
      } catch (err) {
        console.error("Failed to fetch inquiries", err);
      } finally {
        setIsLoadingInquiries(false);
      }
    }
    fetchInquiries();
  }, [user]);

  // Load Messages for selected inquiry
  useEffect(() => {
    if (!selectedInquiry) return;
    const inquiryId = selectedInquiry.id;
    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const res = await fetch(`/api/inquiries/${inquiryId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          // Scroll to bottom
          setTimeout(() => {
            chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
    fetchMessages();
  }, [selectedInquiry]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setAccountError("Passwords do not match.");
      return;
    }

    setIsUpdatingAccount(true);

    try {
      const payload: any = {
        name: profileName,
        isBusinessUser: profileBusiness,
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAccountError(data.error || "Failed to update profile settings.");
        setIsUpdatingAccount(false);
        return;
      }

      setUser(data);
      setNewPassword("");
      setConfirmPassword("");
      setAccountSuccess("Account profile updated successfully.");
    } catch (err) {
      setAccountError("An unexpected error occurred.");
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !chatMessage.trim() || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "CLIENT",
          message: chatMessage,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
        setChatMessage("");
        // Scroll to bottom
        setTimeout(() => {
          chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-950/20 border-amber-800/40 text-amber-400";
      case "UNDER_NEGOTIATION":
        return "bg-blue-950/20 border-blue-800/40 text-blue-400";
      case "CLOSED_WON":
        return "bg-emerald-950/20 border-emerald-800/40 text-emerald-400";
      case "CLOSED_LOST":
        return "bg-red-950/20 border-red-800/40 text-red-400";
      default:
        return "bg-neutral-900 border-neutral-700 text-neutral-400";
    }
  };

  const getInquiryTypeName = (type: string) => {
    switch (type) {
      case "DIRECT":
        return "General Inquiry";
      case "SINGLE_PRODUCT":
        return "Sourcing Quote";
      case "MULTI_PRODUCT":
        return "Multi-Product Tray";
      default:
        return "Inquiry";
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-champagne-gold/20 animate-ping"></div>
          <div className="absolute w-8 h-8 rounded-full border-2 border-t-emerald-deep border-r-emerald-deep border-b-champagne-gold border-l-champagne-gold animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-charcoal bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,81,50,0.12),rgba(255,255,255,0))]">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-outline-variant/20 pb-8">
          <div>
            <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
              Storefront Account Dashboard
            </span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-emerald-deep font-light">
              Welcome, {user?.name || "Collector"}
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant/75 mt-1">
              Registered email: {user?.email} {user?.isBusinessUser && <span className="text-champagne-gold">• Business Partner</span>}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant hover:text-emerald-deep hover:border-emerald-deep/65 font-label-caps text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Navigation Sidebar (3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <button
              onClick={() => {
                setActiveTab("inquiries");
                setSelectedInquiry(null);
              }}
              className={`w-full py-4 px-6 text-left font-label-caps text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                activeTab === "inquiries"
                  ? "bg-emerald-deep border-champagne-gold/40 text-linen-white"
                  : "bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              My Inquiries ({inquiries.length})
              <span className="material-symbols-outlined text-sm">mail</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("account");
                setSelectedInquiry(null);
              }}
              className={`w-full py-4 px-6 text-left font-label-caps text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between cursor-pointer border ${
                activeTab === "account"
                  ? "bg-emerald-deep border-champagne-gold/40 text-linen-white"
                  : "bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              Account Details
              <span className="material-symbols-outlined text-sm">settings</span>
            </button>
          </div>

          {/* Main workspace area (9 columns) */}
          <div className="lg:col-span-9">
            
            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <div className="h-full flex flex-col gap-6">
                {!selectedInquiry ? (
                  /* Inquiry List View */
                  <div className="bg-surface-container-lowest/80 border border-outline-variant/20 p-6 md:p-8 shadow-xl">
                    <h2 className="font-headline-sm text-lg text-emerald-deep mb-6 font-medium tracking-wide">
                      Your Inquiry Pipeline
                    </h2>

                    {isLoadingInquiries ? (
                      <div className="py-12 text-center text-on-surface-variant/55 text-xs font-label-caps tracking-widest uppercase">
                        Fetching vault transactions...
                      </div>
                    ) : inquiries.length === 0 ? (
                      <div className="py-12 text-center text-on-surface-variant/45 text-xs">
                        No inquiries submitted yet. Sourcing requests will appear here.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.map((inq) => (
                          <div
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className="p-5 border border-outline-variant/20 bg-charcoal/10 hover:border-champagne-gold/40 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-headline-sm text-sm text-emerald-deep font-semibold">
                                  {getInquiryTypeName(inq.inquiryType)}
                                </span>
                                <span className={`text-[9px] font-label-caps uppercase border px-2 py-0.5 tracking-wider rounded-none ${getStatusColor(inq.status)}`}>
                                  {inq.status.replace("_", " ")}
                                </span>
                              </div>
                              
                              <p className="font-body-md text-xs text-on-surface-variant/75 line-clamp-1">
                                {inq.product ? `Gemstone: ${inq.product.title} (SKU: ${inq.product.sku})` : (inq.productSkus ? `SKUs: ${inq.productSkus}` : inq.message)}
                              </p>
                              
                              <span className="font-label-caps text-[9px] text-on-surface-variant/40 block pt-1">
                                Registered: {new Date(inq.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                            </div>

                            <span className="font-label-caps text-[10px] text-champagne-gold uppercase tracking-widest flex items-center gap-1 self-end md:self-auto hover:text-emerald-deep transition-colors">
                              Open Thread
                              <span className="material-symbols-outlined text-xs select-none">arrow_forward</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Inquiry Detail & Chat View */
                  <div className="bg-surface-container-lowest/80 border border-outline-variant/20 shadow-xl flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/40">
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="font-label-caps text-xs text-champagne-gold hover:text-emerald-deep transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
                        Back to Pipeline
                      </button>

                      <div className="text-right">
                        <span className={`text-[9px] font-label-caps uppercase border px-2 py-0.5 tracking-wider rounded-none ${getStatusColor(selectedInquiry.status)}`}>
                          {selectedInquiry.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Meta info info card */}
                    <div className="p-6 border-b border-outline-variant/20 bg-charcoal/10 space-y-2">
                      <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold">
                        {getInquiryTypeName(selectedInquiry.inquiryType)}
                      </h3>
                      {selectedInquiry.product && (
                        <p className="font-body-md text-xs text-on-surface-variant">
                          Linked Stone: <a href={`/gemstones/${selectedInquiry.product.sku}`} className="text-champagne-gold underline font-semibold">{selectedInquiry.product.title}</a> (SKU: {selectedInquiry.product.sku})
                        </p>
                      )}
                      {selectedInquiry.productSkus && (
                        <p className="font-body-md text-xs text-on-surface-variant">
                          Inquired SKUs: <span className="font-semibold text-champagne-gold">{selectedInquiry.productSkus}</span>
                        </p>
                      )}
                      <p className="font-body-md text-[11px] text-on-surface-variant/60 leading-relaxed italic">
                        Original Sourcing Query: "{selectedInquiry.message}"
                      </p>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-grow p-6 overflow-y-auto space-y-4">
                      {isLoadingMessages ? (
                        <div className="py-12 text-center text-on-surface-variant/55 text-xs font-label-caps tracking-widest uppercase">
                          Decrypting discussion logs...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="py-12 text-center text-on-surface-variant/40 text-xs">
                          No messages in this thread yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => {
                            const isAdmin = msg.sender === "ADMIN";
                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
                              >
                                <div
                                  className={`max-w-[80%] p-4 border text-sm relative ${
                                    isAdmin
                                      ? "bg-surface-container-high border-outline-variant/40 text-emerald-deep"
                                      : "bg-emerald-deep/15 border-champagne-gold/30 text-emerald-deep"
                                  }`}
                                >
                                  {/* Author Name */}
                                  <span className="font-label-caps text-[9px] text-champagne-gold uppercase tracking-wider block mb-1">
                                    {isAdmin ? "Vault Specialist (Admin)" : "Client (You)"}
                                  </span>
                                  <p className="font-body-md leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                  <span className="font-label-caps text-[8px] text-on-surface-variant/40 block text-right mt-1.5">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={chatBottomRef} />
                        </div>
                      )}
                    </div>

                    {/* Chat Footer Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant/20 flex gap-3 bg-surface-container-low/40">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type response to Vault Specialist..."
                        disabled={isSendingMessage}
                        className="flex-grow bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2.5 px-3 transition-all duration-300 rounded-none placeholder-on-surface-variant/40"
                      />
                      <button
                        type="submit"
                        disabled={!chatMessage.trim() || isSendingMessage}
                        className="px-6 bg-emerald-deep hover:bg-emerald-deep/90 text-linen-white py-2.5 font-label-caps text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 border border-champagne-gold/30 disabled:bg-emerald-deep/40 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        Reply
                        <span className="material-symbols-outlined text-xs select-none">send</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* ACCOUNT DETAILS TAB */}
            {activeTab === "account" && (
              <div className="bg-surface-container-lowest/80 border border-outline-variant/20 p-6 md:p-8 shadow-xl">
                <h2 className="font-headline-sm text-lg text-emerald-deep mb-6 font-medium tracking-wide">
                  Account Settings
                </h2>

                {accountError && (
                  <div className="bg-red-950/20 border border-red-800/40 text-red-400 font-body-sm text-xs p-3.5 mb-6 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sm select-none mt-0.5">warning</span>
                    <span>{accountError}</span>
                  </div>
                )}

                {accountSuccess && (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 font-body-sm text-xs p-3.5 mb-6 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-sm select-none mt-0.5">check_circle</span>
                    <span>{accountSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label
                      htmlFor="profileName"
                      className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                    >
                      Collector Name
                    </label>
                    <input
                      id="profileName"
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      disabled={isUpdatingAccount}
                      className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none"
                    />
                  </div>

                  <div>
                    <label
                      className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                    >
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full bg-charcoal/5 border-b border-outline-variant/10 text-on-surface-variant/40 font-body-md text-sm py-2 px-1 rounded-none cursor-not-allowed"
                    />
                  </div>

                  {/* B2B User checkbox */}
                  <div className="flex items-center gap-3 py-2">
                    <input
                      id="profileBusiness"
                      type="checkbox"
                      checked={profileBusiness}
                      onChange={(e) => setProfileBusiness(e.target.checked)}
                      disabled={isUpdatingAccount}
                      className="w-4.5 h-4.5 accent-emerald-deep border-outline-variant focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor="profileBusiness"
                      className="font-body-md text-xs text-on-surface-variant/90 cursor-pointer select-none"
                    >
                      Verify as a Business / B2B wholesale client
                    </label>
                  </div>

                  <div className="pt-4 border-t border-outline-variant/20">
                    <h3 className="font-headline-sm text-sm text-emerald-deep mb-4 font-medium tracking-wide">
                      Update Security Password
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                        >
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Leave empty to keep current password"
                          disabled={isUpdatingAccount}
                          className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                        >
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new security password"
                          disabled={isUpdatingAccount}
                          className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingAccount}
                      className="px-8 bg-emerald-deep hover:bg-emerald-deep/90 text-linen-white py-3.5 font-label-caps text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 border border-champagne-gold/30 disabled:bg-emerald-deep/55 disabled:cursor-not-allowed"
                    >
                      {isUpdatingAccount ? "Saving Changes..." : "Save Settings"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
