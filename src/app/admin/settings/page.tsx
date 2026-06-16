"use client";

import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"contacts" | "branding" | "legal">("contacts");

  // Tab 1: Contacts & Socials States
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [address, setAddress] = useState("");

  // Tab 2: Branding & Footer States
  const [logoType, setLogoType] = useState("text"); // "text" | "image"
  const [logoText, setLogoText] = useState("GEMSHOUSE");
  const [logoImage, setLogoImage] = useState("");
  const [gst, setGst] = useState("");
  const [footerAboutText, setFooterAboutText] = useState("");

  // Tab 3: Legal Pages Content States (Markdown/Text)
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");

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
        
        // Tab 1 values
        setPhone(data.CONTACT_PHONE || "");
        setEmail(data.CONTACT_EMAIL || "");
        setWhatsapp(data.WHATSAPP_NUMBER || "");
        setInstagram(data.INSTAGRAM_URL || "");
        setFacebook(data.FACEBOOK_URL || "");
        setLinkedin(data.LINKEDIN_URL || "");
        setAddress(data.COMPANY_ADDRESS || "");

        // Tab 2 values
        setLogoType(data.NAV_LOGO_TYPE || "text");
        setLogoText(data.NAV_LOGO_TEXT || "GEMSHOUSE");
        setLogoImage(data.NAV_LOGO_IMAGE || "");
        setGst(data.COMPANY_GST || "");
        setFooterAboutText(data.FOOTER_ABOUT_TEXT || "");

        // Tab 3 values
        setPrivacyPolicy(data.LEGAL_PRIVACY_POLICY || "");
        setTermsOfService(data.LEGAL_TERMS_OF_SERVICE || "");
      } else {
        setErrorMsg("Failed to load settings from database");
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
      // Tab 1
      CONTACT_PHONE: phone,
      CONTACT_EMAIL: email,
      WHATSAPP_NUMBER: whatsapp,
      INSTAGRAM_URL: instagram,
      FACEBOOK_URL: facebook,
      LINKEDIN_URL: linkedin,
      COMPANY_ADDRESS: address,

      // Tab 2
      NAV_LOGO_TYPE: logoType,
      NAV_LOGO_TEXT: logoText,
      NAV_LOGO_IMAGE: logoImage,
      COMPANY_GST: gst,
      FOOTER_ABOUT_TEXT: footerAboutText,

      // Tab 3
      LEGAL_PRIVACY_POLICY: privacyPolicy,
      LEGAL_TERMS_OF_SERVICE: termsOfService,
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
      loadSettings(); // Reload refreshed variables
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to connect and save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
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

      {/* Tabs Menu */}
      <div className="flex border-b border-outline-variant/20 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`pb-4 text-xs font-label-caps uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "contacts"
              ? "border-champagne-gold text-emerald-deep font-bold"
              : "border-transparent text-on-surface-variant/70 hover:text-emerald-deep"
          }`}
        >
          Contact & Socials
        </button>
        <button
          onClick={() => setActiveTab("branding")}
          className={`pb-4 text-xs font-label-caps uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "branding"
              ? "border-champagne-gold text-emerald-deep font-bold"
              : "border-transparent text-on-surface-variant/70 hover:text-emerald-deep"
          }`}
        >
          Branding & Footer
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`pb-4 text-xs font-label-caps uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "legal"
              ? "border-champagne-gold text-emerald-deep font-bold"
              : "border-transparent text-on-surface-variant/70 hover:text-emerald-deep"
          }`}
        >
          Legal Policies
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

      {isLoading ? (
        <div className="py-12 text-center text-on-surface-variant/60 font-semibold bg-surface-container-lowest border border-outline-variant/15">
          Loading platform configuration variables...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/15 p-6 md:p-8 space-y-6 shadow-sm">
          {/* TAB 1: Contacts & Socials */}
          {activeTab === "contacts" && (
            <div className="space-y-6">
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
                      Provide the numeric phone number used to spawn WhatsApp direct links on the contact card.
                    </span>
                  </div>
                </div>
              </div>

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
            </div>
          )}

          {/* TAB 2: Branding & Footer */}
          {activeTab === "branding" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
                  Identity & Logo Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Header Logo Rendering Type
                    </label>
                    <select
                      value={logoType}
                      onChange={(e) => setLogoType(e.target.value)}
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface cursor-pointer font-body-md font-semibold"
                    >
                      <option value="text">Text Character Logo</option>
                      <option value="image">Uploaded PNG/SVG Image Logo</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Brand Text Name
                    </label>
                    <input
                      type="text"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      placeholder="e.g. GEMSHOUSE"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Image Logo Asset URL / Path
                    </label>
                    <input
                      type="text"
                      value={logoImage}
                      onChange={(e) => setLogoImage(e.target.value)}
                      placeholder="e.g. /images/logo.png"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                    />
                    <span className="text-[10px] text-on-surface-variant/60 block mt-1">
                      Provide a relative root path (e.g. `/images/logo.png`) or absolute URL. Used if Image Logo rendering is selected.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
                  Regulatory & Footer Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Corporate GSTIN / Tax Number
                    </label>
                    <input
                      type="text"
                      value={gst}
                      onChange={(e) => setGst(e.target.value)}
                      placeholder="24AAAAG1234A1Z1"
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Footer About Us Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={footerAboutText}
                      onChange={(e) => setFooterAboutText(e.target.value)}
                      placeholder="Brief company description shown in the footer columns..."
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-2 px-3 transition-colors rounded-none text-on-surface font-body-md"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Legal Policies */}
          {activeTab === "legal" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase mb-4 border-b border-outline-variant/15 pb-2">
                  Legal Policy Pages Content
                </h3>
                <span className="text-[10px] text-on-surface-variant/60 block mb-4">
                  Customize the markdown pages rendered for your legal agreements. These will update `/privacy-policy` and `/terms-of-service` instantly.
                </span>
                
                <div className="space-y-5">
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Privacy Policy Page Document (Markdown Supported)
                    </label>
                    <textarea
                      rows={10}
                      value={privacyPolicy}
                      onChange={(e) => setPrivacyPolicy(e.target.value)}
                      placeholder="# Privacy Policy..."
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-3 px-3 transition-colors rounded-none text-on-surface font-mono"
                    ></textarea>
                  </div>
                  <div>
                    <label className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-bold">
                      Terms of Service Page Document (Markdown Supported)
                    </label>
                    <textarea
                      rows={10}
                      value={termsOfService}
                      onChange={(e) => setTermsOfService(e.target.value)}
                      placeholder="# Terms of Service..."
                      className="w-full bg-surface-container-low/40 border border-outline-variant/35 focus:border-emerald-deep focus:outline-none text-xs py-3 px-3 transition-colors rounded-none text-on-surface font-mono"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Save Button */}
          <div className="border-t border-outline-variant/15 pt-5 flex justify-end bg-surface-container-low/10 px-6 py-4 -mx-6 -mb-6 md:-mx-8 md:-mb-8">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-deep text-linen-white hover:bg-emerald-deep/95 disabled:bg-emerald-deep/55 disabled:cursor-not-allowed font-label-caps text-[10px] uppercase tracking-widest border border-champagne-gold/30 cursor-pointer flex items-center gap-2 shadow transition-colors"
            >
              <span className="material-symbols-outlined text-sm select-none">save</span>
              {isSaving ? "Synchronizing Settings..." : "Save Configured variables"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}