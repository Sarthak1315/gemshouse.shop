"use client";

import React, { useState, useEffect } from "react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function TermsOfServicePage() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setContent(data.LEGAL_TERMS_OF_SERVICE || "Terms of Service content coming soon.");
        }
      } catch (err) {
        console.error("Failed to load Terms of Service", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto mt-2">
      <ScrollReveal direction="fade" delay={0}>
        <div className="text-center mb-12">
          <span className="font-label-caps text-[10px] md:text-xs tracking-widest text-champagne-gold uppercase block mb-1">
            Legal Document
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md lg:text-display-lg text-emerald-deep font-serif leading-tight tracking-wide">
            Terms of Service
          </h1>
          <div className="w-16 h-0.5 bg-champagne-gold mx-auto mt-4"></div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={150}>
        <div className="bg-surface-container-lowest border border-outline-variant/20 p-8 md:p-12 sharp-clip-path shadow-lg">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-1/3 bg-on-surface-variant/10 rounded-sm" />
              <div className="h-3.5 w-full bg-on-surface-variant/10 rounded-sm" />
              <div className="h-3.5 w-5/6 bg-on-surface-variant/10 rounded-sm" />
              <div className="h-3.5 w-2/3 bg-on-surface-variant/10 rounded-sm" />
              <div className="h-4 w-1/4 bg-on-surface-variant/10 rounded-sm mt-8" />
              <div className="h-3.5 w-full bg-on-surface-variant/10 rounded-sm" />
              <div className="h-3.5 w-4/5 bg-on-surface-variant/10 rounded-sm" />
            </div>
          ) : (
            <div className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed whitespace-pre-wrap space-y-4">
              {content}
            </div>
          )}
        </div>
      </ScrollReveal>
    </main>
  );
}
