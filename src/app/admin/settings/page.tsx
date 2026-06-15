"use client";

import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  // Settings States
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [address, setAddress] = useState("");

  // Alerts & Load states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setPhone(data.CONTACT_PHONE || "");
        setEmail(data.CONTACT_EMAIL || "");
        setWhatsapp(data.WHATSAPP_NUMBER || "");
        setInstagram(data.INSTAGRAM_URL || "");
        setFacebook(data.FACEBOOK_URL || "");
        setLinkedin(data.LINKEDIN_URL || "");
        setAddress(data.COMPANY_ADDRESS || "");
      } else {
        setErrorMsg("Failed to load settings from DB");
      }
    } catch (err) {
      console.error("Error loading settings", err);
      setErrorMsg("Failed to connect to Settings API");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    const payload = {
      CONTACT_PHONE: phone,
      CONTACT_EMAIL: email,
      WHATSAPP_NUMBER: whatsapp,
      INSTAGRAM_URL: instagram,
      FACEBOOK_URL: facebook,
      LINKEDIN_URL: linkedin,
      COMPANY_ADDRESS: address,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to update platform settings");
        return;
      }

      setSuccessMsg("Platform settings saved and synchronized successfully!");
      loadSettings(); // Reload
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to connect and save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            System configuration
          </span>
          <h1 className="font-headline-sm text-2xl text-emerald-deep font-semibold tracking-wide">
            Platform Settings
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

      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold bg-surface-container-lowest border border-outline-variant/15">
          Loading platform configuration variables...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 space-y-6 shadow-sm">
          {/* Contact Details */}
          <div>
            <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
              Primary Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  Corporate Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 261 400 9000"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                />
              </div>
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  Concierge Support Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="concierge@gemshouse.shop"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  WhatsApp Direct Message Mobile (with country code)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
                <span className="text-[10px] text-on-surface-variant/60 block mt-1">
                  Provide the numeric number used to spawn WhatsApp direct links on the contact card.
                </span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-4">
            <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
              Social Portals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  Facebook Link
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>
              <div>
                <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                  LinkedIn Page Link
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                />
              </div>
            </div>
          </div>

          {/* Corporate Showroom Address */}
          <div className="pt-4">
            <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
              Physical Ateliers & Depositories
            </h3>
            <div>
              <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                Showroom / Main Office Address
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Surat Diamond Bourse, Surat, Gujarat, India"
                className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
              ></textarea>
            </div>
          </div>

          {/* Form Save Button */}
          <div className="border-t border-outline-variant/15 pt-5 flex justify-end bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6 md:-mx-8 md:-mb-8">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 disabled:bg-emerald-deep/55 disabled:cursor-not-allowed font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer flex items-center gap-2 shadow transition-colors"
            >
              <span className="material-symbols-outlined text-sm select-none">save</span>
              {isSaving ? "Synchronizing..." : "Save Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}