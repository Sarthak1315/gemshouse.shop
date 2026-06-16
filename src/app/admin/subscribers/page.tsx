"use client";

import React, { useState, useEffect } from "react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to fetch subscribers");
      }
    } catch (err) {
      console.error("Failed loading subscribers", err);
      setErrorMsg("A network error occurred while loading subscribers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (subscriber: Subscriber) => {
    if (!confirm(`Are you sure you want to remove ${subscriber.email} from the mailing list?`)) return;

    setErrorMsg(null);
    try {
      const res = await fetch(`/api/subscribers/${subscriber.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg(`Successfully unsubscribed ${subscriber.email}.`);
        loadSubscribers();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to remove subscriber.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to remove subscriber due to a network error.");
    }
  };

  // Filter subscribers based on search query
  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Communication & Audience
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Newsletter Subscribers
          </h1>
        </div>
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm select-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2.5 pl-9 pr-3 transition-colors rounded-none text-on-surface font-body-md"
            />
          </div>
          <button
            onClick={loadSubscribers}
            className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/35 text-on-surface hover:bg-surface-container-medium font-label-caps text-[10px] uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
            title="Refresh List"
          >
            <span className="material-symbols-outlined text-sm select-none">refresh</span>
            Refresh
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

      {/* Summary Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant/20 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest block mb-1">
              Active Contacts
            </span>
            <span className="text-2xl font-semibold text-emerald-deep">
              {isLoading ? "..." : subscribers.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center text-champagne-gold">
            <span className="material-symbols-outlined text-xl select-none">alternate_email</span>
          </div>
        </div>
      </div>

      {/* Subscribers Table List */}
      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold">
          Loading audience directory...
        </div>
      ) : filteredSubscribers.length > 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                <th className="p-4 font-label-caps text-[10px] uppercase tracking-wider font-bold text-emerald-deep">
                  Email Address
                </th>
                <th className="p-4 font-label-caps text-[10px] uppercase tracking-wider font-bold text-emerald-deep">
                  Subscribed Date & Time
                </th>
                <th className="p-4 font-label-caps text-[10px] uppercase tracking-wider font-bold text-emerald-deep text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gold-glimmer/5 transition-colors">
                  <td className="p-4 text-xs font-mono font-medium text-on-surface">
                    {subscriber.email}
                  </td>
                  <td className="p-4 text-xs text-on-surface-variant">
                    {new Date(subscriber.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(subscriber)}
                      className="text-on-surface-variant hover:text-red-600 p-1.5 cursor-pointer transition-colors"
                      title="Unsubscribe customer"
                    >
                      <span className="material-symbols-outlined text-base select-none">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-outline-variant/30">
          <span className="material-symbols-outlined text-champagne-gold text-4xl mb-3 select-none">
            mail_lock
          </span>
          <p className="text-on-surface-variant text-sm">
            {searchQuery ? "No subscribers match your search term." : "No newsletter subscribers found."}
          </p>
        </div>
      )}
    </div>
  );
}
