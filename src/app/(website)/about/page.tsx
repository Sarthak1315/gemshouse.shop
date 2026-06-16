"use client";

import React, { useState, useEffect } from "react";
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
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch("/api/faqs?category=Heritage");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFaqs(
              data.map((item: any) => ({
                question: item.question,
                answer: item.answer,
              }))
            );
            setIsLoading(false);
            return;
          }
        }
        // Fallback
        setFaqs(aboutFaqs);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load FAQs, using fallback", err);
        setFaqs(aboutFaqs);
        setIsLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      {/* Custom Keyframe and Utility Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes customSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-custom-spin {
          animation: customSpin 60s linear infinite;
        }
        .animate-custom-spin-reverse {
          animation: customSpinReverse 60s linear infinite;
        }
        .glass-panel {
          background: rgba(252, 249, 248, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid rgba(212, 175, 55, 0.3);
        }
      `}} />

      {/* Main Content */}
      <main className="flex-grow pt-20">
        
        {/* Hero Section */}
        <section className="relative min-h-[600px] md:min-h-[716px] flex items-center justify-center overflow-hidden bg-charcoal">
          <div className="absolute inset-0 w-full h-full">
            <img
              alt="Craftsmanship Hero Background"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc-v8kJcgj_bNQSJVVXpa95NWc38eD0roBY1b2Di8J6iskMv8YS1vNUkkH8FGGHSiqn80C9veiTwZrt-fN-3g8alhk91y16ov2d9TATJeaPLP-DomTQXg3wz8AHfVqh31O9zH0loUJudwmhQtlFd6y-K6N5V9b5E6kXxHXmUh9fkQ9CTceQhjPiICNzHqVVYajhYCYky_rxa_1bKH4BTwrSmyHsRLTXfoHNeW7KAWxvVYogeQpVqgLoew2rehC5-yPsPwrMGPS-wWI"
            />
          </div>
          <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col items-center gap-8">
            <ScrollReveal direction="fade" delay={0}>
              <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block">
                Our Heritage
              </span>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <h1 className="font-headline-md text-3xl md:text-5xl lg:text-display-lg text-linen-white leading-tight font-serif tracking-wide">
                A Legacy of Luminous Perfection
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="font-body-lg text-sm md:text-lg text-surface-variant/80 max-w-2xl leading-relaxed">
                For over a century, Gemshouse has operated at the intersection of nature's rarest miracles and human artistry. We don't just source stones; we curate history.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="fade" delay={300}>
              <div className="w-12 h-[1px] bg-champagne-gold mt-4"></div>
            </ScrollReveal>
          </div>
        </section>

        {/* Company History - Asymmetric Layout */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 md:col-start-2 flex flex-col gap-8 order-2 md:order-1">
              <ScrollReveal direction="up" delay={0}>
                <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block">
                  1924 — Present
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h2 className="font-headline-md text-2xl md:text-3xl lg:text-headline-md text-emerald-deep leading-tight font-serif tracking-wide">
                  From the Deep Earth to the High Vaults
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200} className="flex flex-col gap-4">
                <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Our journey began in a small atelier in Antwerp, driven by a singular obsession with cut and clarity. Over decades, this obsession evolved into a global network of trusted provenance, ensuring every diamond and gemstone in our collection passes through hands dedicated to the highest echelons of grading.
                </p>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Today, Gemshouse is synonymous with investment-grade rarity. Our proprietary sourcing methodology bypasses traditional markets, granting our collectors access to stones previously reserved for royal houses and museums.
                </p>
              </ScrollReveal>
            </div>
            <div className="md:col-span-5 md:col-start-8 relative order-1 md:order-2">
              <ScrollReveal direction="fade" delay={150}>
                <div className="aspect-[4/5] w-full overflow-hidden border-[0.5px] border-champagne-gold/30 shadow-2xl p-2 bg-surface">
                  <img
                    alt="Historical Archival Photo"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrH_O-KsNMb5mrboPuLEDProb5A_Me_qjBFSWNTR8LIsuJvg5qnPkNXEu6BwJghohN95X3V10Afhj5SrYPbgz0TMO9AttlP82LqoNqyW2p_kDv0kAxVZd5uVvQd_eeCi7foRpQwAVSagMMvm1zpVFfPvqaFrtiTcrABxIv03sHtQlZ3_BjOg4aUXUeJMSU3E2Bd4YBbzC7KswkJH_VRMHxxQ1gEPW_4hIFx_oCi_JweRISUOL1N-NKQLk6gp4O-Y8vWAKDTTbgUePf"
                  />
                </div>
              </ScrollReveal>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-surface-container-low border border-outline-variant/30 hidden md:flex flex-col items-center justify-center p-6 gap-2 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-champagne-gold">history_edu</span>
                <span className="font-label-caps text-xs text-emerald-deep text-center font-semibold uppercase tracking-wider">
                  A Century of Trust
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Process - Bento Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col gap-16">
            <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto">
              <ScrollReveal direction="fade" delay={0}>
                <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block">
                  The Atelier
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={100}>
                <h2 className="font-headline-md text-2xl md:text-3xl lg:text-headline-md text-emerald-deep font-serif tracking-wide">
                  Precision Engineering meets Artistic Soul
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={200}>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Our manufacturing process is a delicate ballet of cutting-edge technology and ancient techniques. Every setting is meticulously crafted to amplify, never overshadow, the central stone.
                </p>
              </ScrollReveal>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Bento Item 1 */}
              <div className="md:col-span-2 relative overflow-hidden group border border-outline-variant/20 shadow-xl">
                <img
                  alt="Laser Cutting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuZiLL5rkXwvQpOj4j9o2IQloqZaH5kodV3wZlZN4_SCkdsna_a1QDA-FcAuT5aJHVlzI-GGUZBs7M0PiVDtcQx-YJ3OmSMGL5kQ94CEtN4UfeIkUpLIHxKqWYQqSu5b9WF2cjzJZDsN6pJA7b3jfTFGpqBBi0jGcmN95ZytKdbY2rj5eLqehZVQFDq5dR0fL8GAhtYTAcMkiILanuOe3pN5rfzvpitWcbL_9FcZb2E7VF30lq8voql62HjQ_qP1F8KHEMxToZcMPJ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-2">
                  <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-widest">Phase 01</span>
                  <h3 className="font-headline-sm text-lg md:text-xl lg:text-headline-sm text-linen-white font-semibold">Laser Precision Cleaving</h3>
                </div>
              </div>

              {/* Bento Item 2 */}
              <div className="bg-[#fcf9f8] border border-outline-variant/30 p-8 flex flex-col justify-between shadow-md group hover:border-champagne-gold/50 transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-emerald-deep font-light">architecture</span>
                <div>
                  <span className="font-label-caps text-xs text-champagne-gold block mb-2 uppercase tracking-widest">Phase 02</span>
                  <h3 className="font-headline-sm text-lg md:text-xl lg:text-emerald-deep mb-4 font-semibold">Architectural Design</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">CAD modeling maps the light return of each facet before physical cutting begins.</p>
                </div>
              </div>

              {/* Bento Item 3 */}
              <div className="bg-[#fcf9f8] border border-outline-variant/30 p-8 flex flex-col justify-between shadow-md group hover:border-champagne-gold/50 transition-colors duration-300">
                <span className="material-symbols-outlined text-4xl text-emerald-deep font-light">diamond</span>
                <div>
                  <span className="font-label-caps text-xs text-champagne-gold block mb-2 uppercase tracking-widest">Phase 03</span>
                  <h3 className="font-headline-sm text-lg md:text-xl lg:text-emerald-deep mb-4 font-semibold">Master Polishing</h3>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">Hand-finished on diamond-dusted wheels to achieve the ultimate 'Hearts and Arrows' symmetry.</p>
                </div>
              </div>

              {/* Bento Item 4 */}
              <div className="md:col-span-2 relative overflow-hidden group border border-outline-variant/20 shadow-xl">
                <img
                  alt="Hand Setting"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbMTyRIH1m3guk9IInSk8PVk1ICUKJtqV3JP6GqZG5aRpBz7aFb-litPhPHCfp234qEfieekOS6i2-6axasEL7YqQF8t1Rn_HfPXqYwKqA_1GfG-9iKxlyQnsSwlS8L2Iqg5qlITDfr-Ue7j4gHcBHIUcYrTrbqOnnYRYs5lJpQ49i7mjl23DWMzsVwyiZLsS9rQmMeT7aMseBbobeFmST65H4ju7gQqpIlY0OyMUQPSYbPRxc29XJ0MeUn2YZxB6aZMGXdVqbq7XN"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-2">
                  <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-widest">Phase 04</span>
                  <h3 className="font-headline-sm text-lg md:text-xl lg:text-linen-white font-semibold">Artisanal Setting</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certification & Quality - Glassmorphism */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-glimmer rounded-full blur-[120px] opacity-50 -z-10" />
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="glass-panel p-8 md:p-20 rounded-xl relative overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div className="flex flex-col gap-8">
                  <ScrollReveal direction="fade" delay={0}>
                    <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block">
                      Quality Standards
                    </span>
                  </ScrollReveal>
                  <ScrollReveal direction="up" delay={100}>
                    <h2 className="font-headline-md text-2xl md:text-3xl lg:text-headline-md text-emerald-deep font-serif tracking-wide leading-tight">
                      Beyond the Four Cs
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal direction="up" delay={200}>
                    <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
                      While industry standards rely on Color, Clarity, Cut, and Carat, the Gemshouse protocol demands an evaluation of 'Character'. We assess crystallization, fluorescence, and internal strain—factors that dictate a stone's true life and fire.
                    </p>
                  </ScrollReveal>
                  <ScrollReveal direction="up" delay={300} className="flex flex-col gap-6 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-deep text-champagne-gold font-label-caps text-[10px] tracking-widest px-3 py-1 rounded-sm uppercase border border-champagne-gold/30">
                        Certified
                      </div>
                      <span className="font-body-md text-xs md:text-sm text-on-surface-variant/80 font-medium">GIA &amp; AGS Dual Verification</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-deep text-champagne-gold font-label-caps text-[10px] tracking-widest px-3 py-1 rounded-sm uppercase border border-champagne-gold/30">
                        Rare
                      </div>
                      <span className="font-body-md text-xs md:text-sm text-on-surface-variant/80 font-medium">Top 0.01% of Global Yield</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-deep text-champagne-gold font-label-caps text-[10px] tracking-widest px-3 py-1 rounded-sm uppercase border border-champagne-gold/30">
                        Ethical
                      </div>
                      <span className="font-body-md text-xs md:text-sm text-on-surface-variant/80 font-medium">Kimberley Process Compliant + Provenance Tracked</span>
                    </div>
                  </ScrollReveal>
                </div>
                
                <div className="flex items-center justify-center relative">
                  {/* Circular Visual Guide */}
                  <div className="w-64 h-64 rounded-full border-[0.5px] border-champagne-gold/50 flex items-center justify-center relative animate-custom-spin">
                    <div className="absolute inset-2 border-[0.5px] border-dashed border-emerald-deep/30 rounded-full"></div>
                    <span className="material-symbols-outlined text-6xl text-emerald-deep animate-custom-spin-reverse select-none">verified</span>
                    {/* Orbiting Nodes */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fcf9f8] border border-champagne-gold rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-emerald-deep rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fcf9f8] border border-champagne-gold rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-emerald-deep rounded-full"></div>
                    </div>
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#fcf9f8] border border-champagne-gold rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-emerald-deep rounded-full"></div>
                    </div>
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#fcf9f8] border border-champagne-gold rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-emerald-deep rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Ateliers Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col gap-12">
          <ScrollReveal direction="up" delay={0}>
            <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
              <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block">
                World Office Depository
              </span>
              <h2 className="font-headline-md text-2xl md:text-3xl text-emerald-deep font-serif tracking-wide">
                Secure Global Facilities
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant/70 leading-relaxed">
                Our secure viewings are hosted across primary global trading and lapidary networks.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="fade" delay={100}>
            <AteliersNetwork />
          </ScrollReveal>
        </section>

        {/* Heritage FAQ Accordion */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="bg-surface-container-low p-8 md:p-12 border border-outline-variant/30 sharp-clip-path flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 text-left">
              <span className="font-label-caps text-xs text-champagne-gold uppercase tracking-[0.2em] block mb-2">
                Collector Assurance
              </span>
              <h3 className="font-headline-md text-2xl md:text-3xl text-emerald-deep leading-tight font-serif tracking-wide">
                Heritage FAQ
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/70 mt-3 leading-relaxed">
                Explore answers regarding gemstone provenance, independent verification certificates, and private viewing room security.
              </p>
            </div>

            <div className="lg:w-2/3 flex flex-col border-t border-outline-variant/30">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={`shimmer-faq-${idx}`}
                    className="border-b border-outline-variant/30 py-6 flex justify-between items-center"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="h-4.5 w-3/4 bg-emerald-deep/10 rounded-sm animate-pulse" />
                      <div className="h-3.5 w-1/2 bg-[#c4a482]/10 rounded-sm animate-pulse" />
                    </div>
                    <div className="h-4 w-4 bg-[#c4a482]/20 rounded-sm animate-pulse ml-4 flex-none" />
                  </div>
                ))
              ) : (
                faqs.map((faq, idx) => {
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
                })
              )}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}