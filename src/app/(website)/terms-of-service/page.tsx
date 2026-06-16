import React from "react";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import ScrollReveal from "@/components/shared/ScrollReveal";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Terms of Service | Gemshouse Sourcing",
  description: "Review our Terms of Service governing gemological certifications, secure viewing suite operations, and acquisition protocols.",
};

export default async function TermsOfServicePage() {
  const setting = await prisma.setting.findUnique({
    where: { key: "LEGAL_TERMS_OF_SERVICE" },
  });
  const content = setting?.value || "Terms of Service content coming soon.";

  // Schema for Terms of Service
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Gemshouse Sourcing",
    "description": "Review our terms governing certifications, acquisitions, and vault viewings.",
    "publisher": {
      "@type": "Organization",
      "name": "Gemshouse",
      "logo": {
        "@type": "ImageObject",
        "url": "https://gemshouse.shop/images/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
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
            <div className="font-body-md text-sm text-on-surface-variant/80 leading-relaxed whitespace-pre-wrap space-y-4">
              {content}
            </div>
          </div>
        </ScrollReveal>
      </main>
    </>
  );
}
