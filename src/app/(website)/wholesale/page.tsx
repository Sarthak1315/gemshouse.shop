import React from "react";
import type { Metadata } from "next";
import WholesalePageClient from "./WholesalePageClient";

export const metadata: Metadata = {
  title: "Wholesale & B2B Gemstone Program | Gemshouse Sourcing",
  description: "Apply for our B2B trade program to access wholesale pricing, insured door-to-door escrow shipping, and priority vault catalogs.",
};

export default function WholesalePage() {
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Wholesale Gemstone Sourcing Program - Gemshouse",
    "description": "B2B portal for verified gemstone dealers, jewelers, and ateliers to access trade pricing and escrow shipments.",
    "url": "https://gemshouse.shop/wholesale",
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
      <WholesalePageClient />
    </>
  );
}