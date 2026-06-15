"use client";

import React, { useState } from "react";
import Navbar from "@/components/website/navbar/Navbar";
import AteliersNetwork from "@/components/website/collection/AteliersNetwork";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const aboutFaqs: FAQItem[] = [
  {
    question: "Where does Gemshouse source its natural gemstones?",
    answer: "We source our gemstones directly from ethical, independent mine partners in historically significant origins—including Ceylon (Sri Lanka) for royal blue sapphires, Muzo (Colombia) for vibrant emeralds, and Mogok (Burma) for rare pigeon-blood rubies. Every stone is traced from extraction to faceting.",
  },
  {
    question: "Are your diamonds fully certified and conflict-free?",
    answer: "Yes. All diamonds sold by Gemshouse are 100% conflict-free, complying strictly with the Kimberley Process certification scheme. Every investment-grade diamond is graded and certified by the Gemological Institute of America (GIA).",
  },
  {
    question: "How do I request a private vault viewing?",
    answer: "Private viewings can be arranged through our contact page or by contacting your dedicated client concierge. Viewings are hosted at our high-security depositories in London (Mayfair), New York (Midtown), Geneva (Free-port), or Surat (Diamond Bourse).",
  },
  {
    question: "What independent gemological laboratories do you trust?",
    answer: "We verify our stones exclusively with the world's most rigorous gemological authorities, including GIA (Gemological Institute of America), SSEF (Swiss Gemmological Institute), GRS (Gemresearch Swisslab), and Gübelin Gem Lab.",
  },
];

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Canvas */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto mt-2 flex flex-col gap-20">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-6">
          <ScrollReveal direction="fade" delay={0}>
            <span className="font-label-caps text-[10px] md:text-xs tracking-widest text-champagne-gold uppercase block">
              ESTABLISHED 1994
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md lg:text-display-lg text-emerald-deep leading-tight font-serif tracking-wide">
              Curation, Sourcing &amp; Lapidary Heritage
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="font-body-md text-sm md:text-base text-on-surface-variant/80 leading-relaxed">
              For over three decades, Gemshouse has served as a trusted private counselor to collectors, investors, and premier ateliers. We specialize in acquiring unheated, natural gemstones of exceptional saturation, cut, and investment-grade pedigree.
            </p>
          </ScrollReveal>
        </section>

        {/* Curation Philosophy Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-outline-variant/30 py-16">
          <ScrollReveal direction="up" delay={0} className="flex flex-col gap-4 text-center md:text-left">
            <span className="material-symbols-outlined text-champagne-gold text-4xl select-none">
              diamond
            </span>
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Ethical Sourcing
            </h3>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant/70 leading-relaxed">
              We deal exclusively with ethical mine owners, verifying conflict-free origins under international environmental and labor protections.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150} className="flex flex-col gap-4 text-center md:text-left">
            <span className="material-symbols-outlined text-champagne-gold text-4xl select-none">
              architecture
            </span>
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Precision Lapidary
            </h3>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant/70 leading-relaxed">
              From our cutting center in Surat to master lapidaries globally, we maximize optical brilliance without altering natural crystallization.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} className="flex flex-col gap-4 text-center md:text-left">
            <span className="material-symbols-outlined text-champagne-gold text-4xl select-none">
              verified
            </span>
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Certified Escrow
            </h3>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant/70 leading-relaxed">
              All acquisitions undergo double-blind independent testing at GIA, SSEF, or GRS prior to vault storage or dispatch.
            </p>
          </ScrollReveal>
        </section>

        {/* Global Ateliers Section */}
        <section className="flex flex-col gap-8">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center max-w-xl mx-auto">
              <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                World Office Depository
              </span>
              <h2 className="font-headline-md text-xl md:text-headline-sm text-emerald-deep">
                Secure Global Facilities
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant/60 mt-2">
                Our secure viewings are hosted across primary global trading and lapidary networks.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="fade" delay={100}>
            <AteliersNetwork />
          </ScrollReveal>
        </section>

        {/* Heritage FAQ Accordion */}
        <section className="bg-surface-container-low p-8 md:p-12 border border-outline-variant/30 sharp-clip-path flex flex-col lg:flex-row gap-12 mt-4">
          <div className="lg:w-1/3 text-left">
            <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
              Collector Assurance
            </span>
            <h3 className="font-headline-md text-xl md:text-headline-sm text-emerald-deep leading-tight">
              Heritage FAQ
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant/60 mt-3 leading-relaxed">
              Explore answers regarding gemstone provenance, independent verification certificates, and private viewing room security.
            </p>
          </div>

          <div className="lg:w-2/3 flex flex-col border-t border-outline-variant/30">
            {aboutFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border-b border-outline-variant/30">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 flex justify-between items-center text-left group cursor-pointer"
                  >
                    <span className="font-body-lg text-sm md:text-base text-emerald-deep font-semibold tracking-wide">
                      {faq.question}
                    </span>
                    <span
                      className={`material-symbols-outlined text-champagne-gold select-none text-base transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-out overflow-hidden font-body-md text-xs md:text-sm text-on-surface-variant ${
                      isOpen ? "max-h-[150px] pb-5 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="leading-relaxed text-on-surface-variant/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Editorial Footer */}
      <footer className="bg-charcoal pt-20 pb-10 border-t border-outline/10 text-surface-variant mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16">
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="font-headline-md text-2xl md:text-headline-sm text-linen-white tracking-widest uppercase">
              Gemshouse
            </div>
            <p className="font-body-md text-body-md text-surface-variant/60 max-w-xs leading-relaxed">
              Purveyors of fine natural gemstones and investment-grade diamonds.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Locations
              </h4>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">London Office</a>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">New York Atelier</a>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">Geneva Vault</a>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">Surat Bourse</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Client Services
              </h4>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="/contact">Contact Concierge</a>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">Certification FAQ</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-label-caps text-champagne-gold uppercase tracking-wider">
                Legal
              </h4>
              <a className="font-body-md text-body-md text-surface-variant/60 hover:text-linen-white transition-colors duration-300" href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-8 border-t border-surface-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-caps text-label-caps text-surface-variant/40">
            © 2024 Gemshouse Editorial. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}