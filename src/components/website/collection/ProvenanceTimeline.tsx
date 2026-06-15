"use client";

import React, { useState } from "react";

interface Step {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  details: string;
  badge: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: "explore",
    title: "1. Ethical Sourcing",
    subtitle: "Direct mining partnerships with transparency.",
    details: "Every gemstone begins its journey in certified small-scale artisanal mines. We maintain strict direct contracts with co-operatives in Sri Lanka, Colombia, and Myanmar. Every rough crystal is logged with precise coordinate origins, ensuring no conflict sourcing and full ecological restoration at the mine sites.",
    badge: "Origin Traced",
  },
  {
    id: 2,
    icon: "diamond",
    title: "2. Master Lapidary",
    subtitle: "Precision faceting to unlock internal fire.",
    details: "Rough stones are sent to our master lapidaries in Antwerp and Colombo. Utilizing both ancient hand-sawing wisdom and modern structural analysis, our artisans orient the crystal to optimize natural light refraction, yielding maximum color depth and premium 'Pigeon Blood' or 'Cornflower Blue' luminescence.",
    badge: "Artisan Finished",
  },
  {
    id: 3,
    icon: "verified",
    title: "3. Independent Certification",
    subtitle: "Rigorous laboratory validation of quality.",
    details: "Prior to entering our catalog, each gemstone is sent to top-tier laboratories (SSEF, GUBELIN, GRS, or GIA). They verify the natural status, color designation, and grade the presence of any thermal treatments. A physical, blockchain-linked grading certificate is generated for every stone.",
    badge: "100% Certified",
  },
];

export default function ProvenanceTimeline() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-stretch">
      {/* Steps List Selector */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-6 border text-left transition-all duration-500 cursor-pointer flex gap-4 items-start relative ${
                isActive
                  ? "bg-surface-container-lowest border-champagne-gold/60 shadow-lg"
                  : "bg-surface-container-low border-outline-variant/30 hover:border-champagne-gold/30 hover:bg-surface-container-lowest/50"
              }`}
            >
              {/* Active Golden Bar indicator */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] bg-champagne-gold transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              ></div>

              <span
                className={`material-symbols-outlined text-2xl transition-transform duration-500 ${
                  isActive ? "text-champagne-gold scale-110 rotate-3" : "text-on-surface-variant/50"
                }`}
              >
                {step.icon}
              </span>
              <div>
                <h4
                  className={`font-label-caps text-xs md:text-sm uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? "text-emerald-deep font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-xs text-on-surface-variant/70 mt-1">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Detail Card */}
      <div className="flex-1 p-8 bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between relative min-h-[300px]">
        {/* Diamond cut gold corner accents */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-champagne-gold/30"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-champagne-gold/30"></div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="bg-emerald-deep text-champagne-gold font-label-caps text-[9px] tracking-widest px-2.5 py-1 uppercase select-none">
              {steps[activeStep - 1].badge}
            </span>
            <span className="font-headline-md text-3xl text-champagne-gold/20 font-bold select-none">
              0{activeStep}
            </span>
          </div>
          
          <h3 className="font-headline-sm text-lg md:text-xl text-emerald-deep mb-4 tracking-wide">
            {steps[activeStep - 1].title.substring(3)} {/* Remove number prefix */}
          </h3>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            {steps[activeStep - 1].details}
          </p>
        </div>

        <div className="mt-8 flex gap-3 items-center text-xs font-label-caps text-emerald-deep font-bold tracking-widest cursor-pointer group">
          <span>Read Sourcing Standards</span>
          <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
            arrow_right_alt
          </span>
        </div>
      </div>
    </div>
  );
}
