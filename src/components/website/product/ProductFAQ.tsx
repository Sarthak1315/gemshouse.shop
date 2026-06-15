"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I inspect the gemstone in person prior to final acquisition?",
    answer: "Yes. Private client viewings can be scheduled at any of our secure vaults in Mayfair (London), Fifth Avenue (New York), or the Geneva Free-port depository. Please contact our concierge team at least 48 hours in advance to arrange a viewing.",
  },
  {
    question: "What secure logistics are used for shipping high-value items?",
    answer: "All acquisitions are shipped via fully-insured, armored courier services (Malca-Amit or Brinks). Shipments are dispatched in tamper-evident sealed packaging, tracked via GPS, and require secure signature verification upon hand-delivery.",
  },
  {
    question: "How do I independently verify the grading certificate?",
    answer: "Every stone is accompanied by a physical grading report from GIA, SSEF, GRS, or Gübelin. You can enter the unique report number printed on the certificate directly into the laboratory's official online database to verify all specs.",
  },
  {
    question: "What is your returns policy for investment-grade gemstones?",
    answer: "Due to the unique, high-value asset class of these natural stones, all sales are final once transit has cleared. To ensure absolute satisfaction, we support secure escrow inspect-on-delivery options prior to releasing funds.",
  },
];

export default function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
          Assurance &amp; Protocols
        </span>
        <h3 className="font-headline-md text-xl md:text-headline-md text-emerald-deep">
          Acquisition FAQ
        </h3>
        <div className="w-12 h-0.5 bg-champagne-gold mt-4 hidden md:block"></div>
      </div>

      <div className="flex flex-col border-t border-outline-variant/30">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="border-b border-outline-variant/30">
              <button
                onClick={() => toggleFAQ(idx)}
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
    </div>
  );
}
