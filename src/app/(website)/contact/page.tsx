import React from "react";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us | Gemshouse Natural Gemstones",
  description: "Connect with our team to arrange private viewings, custom gemstone sourcing, or certificate verification.",
};

export default async function ContactPage() {
  const settingsRecords = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          "CONTACT_PHONE",
          "SURAT_PHONE",
          "GENEVA_PHONE",
          "CONTACT_EMAIL",
          "WHATSAPP_NUMBER",
          "INSTAGRAM_URL",
          "FACEBOOK_URL",
          "LINKEDIN_URL"
        ]
      }
    }
  });

  const settingsMap = settingsRecords.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const defaultSettings = {
    phone: "+44 (0) 20 7946 0192",
    suratPhone: "+91 261 555 0192",
    genevaPhone: "+41 22 345 6789",
    email: "info@gemshouse.shop",
    whatsapp: "912615550192",
    instagram: "https://www.instagram.com/gemshouse",
    facebook: "https://www.facebook.com/gemshouse",
    linkedin: "https://www.linkedin.com/company/gemshouse",
  };

  const initialSettings = {
    phone: settingsMap["CONTACT_PHONE"] || defaultSettings.phone,
    suratPhone: settingsMap["SURAT_PHONE"] || defaultSettings.suratPhone,
    genevaPhone: settingsMap["GENEVA_PHONE"] || defaultSettings.genevaPhone,
    email: settingsMap["CONTACT_EMAIL"] || defaultSettings.email,
    whatsapp: settingsMap["WHATSAPP_NUMBER"] || defaultSettings.whatsapp,
    instagram: settingsMap["INSTAGRAM_URL"] || defaultSettings.instagram,
    facebook: settingsMap["FACEBOOK_URL"] || defaultSettings.facebook,
    linkedin: settingsMap["LINKEDIN_URL"] || defaultSettings.linkedin,
  };

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Gemshouse Natural Gemstones",
    "description": "Connect with our team to arrange private viewings, custom gemstone sourcing, or certificate verification.",
    "url": "https://gemshouse.shop/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Gemshouse",
      "url": "https://gemshouse.shop",
      "logo": "https://gemshouse.shop/images/logo.png",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": initialSettings.phone,
          "contactType": "London Office & Private Sourcing",
          "email": initialSettings.email
        },
        {
          "@type": "ContactPoint",
          "telephone": initialSettings.suratPhone,
          "contactType": "Surat Atelier & Cutting Center",
          "email": initialSettings.email
        },
        {
          "@type": "ContactPoint",
          "telephone": initialSettings.genevaPhone,
          "contactType": "Geneva Office & Logistics",
          "email": initialSettings.email
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <ContactPageClient initialSettings={initialSettings} />
    </>
  );
}