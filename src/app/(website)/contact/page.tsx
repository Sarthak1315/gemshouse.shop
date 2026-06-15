"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/website/navbar/Navbar";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Footer from "@/components/website/footer/Footer";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "viewing",
    message: "",
  });

  const [settings, setSettings] = useState({
    phone: "+44 (0) 20 7946 0192",
    suratPhone: "+91 261 555 0192",
    genevaPhone: "+41 22 345 6789",
    email: "info@gemshouse.shop",
    whatsapp: "912615550192",
    instagram: "https://www.instagram.com/gemshouse",
    facebook: "https://www.facebook.com/gemshouse",
    linkedin: "https://www.linkedin.com/company/gemshouse",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings((prev) => ({
            ...prev,
            phone: data["CONTACT_PHONE"] || prev.phone,
            email: data["CONTACT_EMAIL"] || prev.email,
            whatsapp: data["WHATSAPP_NUMBER"] || prev.whatsapp,
            instagram: data["INSTAGRAM_URL"] || prev.instagram,
            facebook: data["FACEBOOK_URL"] || prev.facebook,
            linkedin: data["LINKEDIN_URL"] || prev.linkedin,
          }));
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          productId: null,
          status: "PENDING",
        }),
      });

      if (res.ok) {
        setFormState("success");
      } else {
        alert("Failed to submit inquiry. Please check your inputs.");
        setFormState("idle");
      }
    } catch (err) {
      console.error("Error submitting inquiry", err);
      alert("An error occurred. Please try again.");
      setFormState("idle");
    }
  };

  const resetForm = () => {
    setFormState("idle");
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "viewing",
      message: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Canvas */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto mt-2 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Contact info & offices list */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          <div>
            <ScrollReveal direction="fade" delay={0}>
              <span className="font-label-caps text-[10px] md:text-xs tracking-widest text-champagne-gold uppercase block mb-1">
                Get in Touch
              </span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md lg:text-display-lg text-emerald-deep font-serif leading-tight tracking-wide">
                Contact Us
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="font-body-md text-sm text-on-surface-variant/80 mt-4 leading-relaxed">
                Connect with our team to arrange viewings, request gemstone sourcing, or verify certificates. We are here to help with all your inquiries.
              </p>
            </ScrollReveal>
          </div>

          {/* Contact channels block */}
          <ScrollReveal direction="up" delay={300} className="p-6 bg-surface-container-low border border-outline-variant/30 sharp-clip-path flex flex-col gap-4">
            <h4 className="font-headline-sm text-sm text-emerald-deep font-semibold tracking-wide uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-champagne-gold text-base select-none">
                call
              </span>
              Our Contact Channels
            </h4>
            <ul className="space-y-3 font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
              <li className="flex justify-between border-b border-outline-variant/15 pb-2">
                <span>London Office</span>
                <span className="font-semibold text-emerald-deep">{settings.phone}</span>
              </li>
              <li className="flex justify-between border-b border-outline-variant/15 pb-2">
                <span>Surat Atelier</span>
                <span className="font-semibold text-emerald-deep">{settings.suratPhone}</span>
              </li>
              <li className="flex justify-between border-b border-outline-variant/15 pb-2">
                <span>Email</span>
                <span className="font-semibold text-emerald-deep">{settings.email}</span>
              </li>
              <li className="flex justify-between">
                <span>Geneva Office</span>
                <span className="font-semibold text-emerald-deep">{settings.genevaPhone}</span>
              </li>
            </ul>
          </ScrollReveal>

          {/* WhatsApp Direct Message CTA */}
          <ScrollReveal direction="up" delay={350} className="w-full">
            <a
              href={`https://wa.me/${settings.whatsapp}?text=Hi%20Gemshouse%2C%20I%27d%20like%20to%20inquire%20about%20your%20gemstones.`}
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-hover flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-label-caps text-xs uppercase tracking-widest hover:bg-[#1ebe57] transition-all duration-400 sharp-clip-path cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Message Us on WhatsApp
            </a>
          </ScrollReveal>

          {/* Social Media Icons */}
          <ScrollReveal direction="up" delay={380} className="flex items-center gap-5">
            <span className="font-label-caps text-[9px] tracking-widest text-on-surface-variant/50 uppercase">
              Follow Us
            </span>
            <div className="h-[0.5px] flex-grow bg-outline-variant/30"></div>
            <div className="flex items-center gap-3">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant/70 hover:border-champagne-gold hover:text-champagne-gold hover:bg-champagne-gold/5 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant/70 hover:border-champagne-gold hover:text-champagne-gold hover:bg-champagne-gold/5 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant/70 hover:border-champagne-gold hover:text-champagne-gold hover:bg-champagne-gold/5 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant/70 hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/5 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </ScrollReveal>

          {/* Stylized Dark Map Container */}
          <ScrollReveal direction="fade" delay={400} className="w-full aspect-[16/10] bg-charcoal border border-outline-variant/30 sharp-clip-path overflow-hidden relative group">
            <iframe
              src="https://maps.google.com/maps?q=Surat%20Diamond%20Bourse,%20Gujarat,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale invert contrast-125 brightness-90 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              allowFullScreen
              loading="lazy"
              title="Surat Diamond Bourse Location Map"
            ></iframe>
            {/* Absolute coordinates badge */}
            <div className="absolute bottom-4 left-4 bg-charcoal/95 border border-champagne-gold/30 px-3 py-1.5 sharp-clip-path pointer-events-none select-none">
              <span className="font-body-md text-[9px] text-champagne-gold font-mono uppercase tracking-widest">
                Surat: 21.1702° N, 72.8311° E
              </span>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" delay={250} className="w-full bg-surface-container-lowest border border-outline-variant/20 p-8 md:p-12 sharp-clip-path relative min-h-[550px] flex flex-col justify-center shadow-lg">
            
            {formState === "idle" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                    Send an Inquiry
                  </span>
                  <h3 className="font-headline-md text-xl text-emerald-deep font-semibold">
                    How Can We Help?
                  </h3>
                  <p className="font-body-md text-xs text-on-surface-variant/60 mt-1">
                    Fill in the details below and our team will get back to you shortly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold transition-all duration-300 rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold transition-all duration-300 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold transition-all duration-300 rounded-none placeholder:text-on-surface-variant/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold cursor-pointer rounded-none"
                    >
                      <option value="viewing">Gemstone Viewing Appointment</option>
                      <option value="sourcing">Custom Gemstone Sourcing</option>
                      <option value="dealer">Wholesale / B2B Partnership</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-caps text-[9px] uppercase tracking-wider text-outline font-semibold">
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe what you're looking for — gemstone type, carat weight, budget range, or any other details..."
                    className="w-full bg-surface-container-low border border-outline-variant/40 p-3 font-body-md text-xs text-emerald-deep focus:outline-none focus:border-champagne-gold transition-all duration-300 resize-none placeholder:text-on-surface-variant/40 rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  className="shimmer-hover w-full py-4 bg-emerald-deep text-linen-white font-label-caps text-xs uppercase tracking-widest hover:opacity-95 transition-all duration-500 sharp-clip-path cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}

            {formState === "submitting" && (
              <div className="flex flex-col items-center justify-center text-center gap-6 animate-fade-in-up">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-champagne-gold/20 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-t-emerald-deep border-r-emerald-deep rounded-full animate-spin"></div>
                  <span className="material-symbols-outlined text-champagne-gold text-2xl select-none animate-pulse">
                    mail
                  </span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
                    Sending Your Inquiry
                  </h4>
                  <p className="font-body-md text-xs text-on-surface-variant/60 mt-1 max-w-xs mx-auto leading-relaxed">
                    Please wait while we process your message...
                  </p>
                </div>
              </div>
            )}

            {formState === "success" && (
              <div className="flex flex-col items-center justify-center text-center gap-6 animate-fade-in-up">
                <div className="w-16 h-16 bg-emerald-deep/15 text-emerald-deep rounded-full flex items-center justify-center border border-emerald-deep/30">
                  <span className="material-symbols-outlined text-4xl select-none animate-bounce">
                    check_circle
                  </span>
                </div>
                <div className="max-w-md mx-auto">
                  <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                    Message Sent
                  </span>
                  <h4 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
                    Thank You for Reaching Out!
                  </h4>
                  <p className="font-body-md text-xs md:text-sm text-on-surface-variant/80 mt-3 leading-relaxed">
                    Hi <strong className="text-emerald-deep font-semibold">{formData.name}</strong>, your inquiry has been received. Our team will reach out to you at <strong className="text-emerald-deep font-semibold">{formData.email}</strong>{formData.phone && <> or <strong className="text-emerald-deep font-semibold">{formData.phone}</strong></>} shortly.
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="font-label-caps text-[10px] uppercase text-champagne-gold hover:text-emerald-deep transition-all duration-300 border-b border-champagne-gold hover:border-emerald-deep pb-0.5 tracking-wider mt-4 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            )}

          </ScrollReveal>
        </div>

      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}