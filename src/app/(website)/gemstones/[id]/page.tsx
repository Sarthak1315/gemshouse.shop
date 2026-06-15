import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/website/navbar/Navbar";
import GemstoneDetailPanel from "@/components/website/product/GemstoneDetailPanel";
import ProductReviews from "@/components/website/product/ProductReviews";
import ProductFAQ from "@/components/website/product/ProductFAQ";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Footer from "@/components/website/footer/Footer";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

// Pre-render static pages for all gemstone routes at build time
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { id: true },
  });
  return products.map((product) => ({
    id: product.id,
  }));
}

// Generate dynamic browser tab titles and metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const stone = await prisma.product.findUnique({
    where: { id },
  });

  if (!stone) {
    return {
      title: "Gemstone Not Found | Gemshouse",
    };
  }

  return {
    title: `${stone.carat} Carat ${stone.title} | Gemshouse Sourcing`,
    description: `Inspect this rare, certified ${stone.carat} ct ${stone.cut || ""} ${stone.title}. Sourced from ${stone.origin || ""}, graded as ${stone.clarity || ""} by ${stone.certification || ""}. View grading certificate and request pricing quote.`,
  };
}

export default async function GemstoneDetailsPage({ params }: Props) {
  const { id } = await params;
  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: {
          isPrimary: "desc"
        }
      }
    }
  });

  if (!dbProduct) {
    notFound();
  }

  const primaryImage = dbProduct.images.find((img) => img.isPrimary) || dbProduct.images[0];
  const stone = {
    id: dbProduct.id,
    title: dbProduct.title,
    category: dbProduct.category.name,
    carat: dbProduct.carat,
    cut: dbProduct.cut || "N/A",
    origin: dbProduct.origin || "Unknown",
    clarity: dbProduct.clarity || "N/A",
    certificate: dbProduct.certification || "N/A",
    imageUrl: primaryImage?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    price: Number(dbProduct.price),
    badge: dbProduct.featured ? "Investment Grade" : (dbProduct.inStock ? "In Stock" : "Reserved"),
    images: dbProduct.images.map((img) => img.url),
    dimensions: "N/A",
    depth: "N/A",
    table: "N/A",
    culet: "None",
    fluorescence: "None",
    extendedDescription: dbProduct.description,
    reportNumber: dbProduct.certNumber || "N/A",
  };

  const dbAlternatives = await prisma.product.findMany({
    where: {
      id: { not: dbProduct.id },
    },
    take: 4,
    include: {
      images: {
        orderBy: {
          isPrimary: "desc"
        }
      }
    }
  });

  const alternatives = dbAlternatives.map((alt) => {
    const primaryImg = alt.images.find((img) => img.isPrimary) || alt.images[0];
    return {
      id: alt.id,
      title: alt.title,
      carat: alt.carat,
      cut: alt.cut || "N/A",
      clarity: alt.clarity || "N/A",
      imageUrl: primaryImg?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      price: Number(alt.price),
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Canvas Area */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto mt-2">
        <ScrollReveal direction="fade" delay={0}>
          <GemstoneDetailPanel gemstone={stone} />
        </ScrollReveal>
      </main>

      {/* Assurance Protocols & Collector Verification Panel */}
      <section className="bg-surface-container-lowest py-20 border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* FAQ (left column) */}
          <div className="lg:col-span-6">
            <ScrollReveal direction="up" delay={0}>
              <ProductFAQ />
            </ScrollReveal>
          </div>
            {/* Reviews (right column) */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="up" delay={150}>
                <ProductReviews category={stone.category} productId={stone.id} />
              </ScrollReveal>
            </div>
        </div>
      </section>

      {/* Related Alternatives horizontal panel */}
      <section className="bg-surface-container-low py-20 border-t border-champagne-gold/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ScrollReveal direction="up" delay={0}>
            <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
              <div>
                <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                  Vault Catalog Selection
                </span>
                <h2 className="font-headline-md text-xl md:text-headline-md text-emerald-deep">
                  Curated Alternatives
                </h2>
              </div>
              
              <a
                className="font-label-caps text-[10px] md:text-xs uppercase text-champagne-gold hover:text-emerald-deep transition-colors flex items-center gap-2 border-b border-transparent hover:border-emerald-deep pb-1 tracking-widest"
                href="/collections"
              >
                View Complete Inventory
                <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
              </a>
            </div>
          </ScrollReveal>

          {/* Grid list of alternative products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alternatives.map((alt, idx) => (
              <ScrollReveal
                key={alt.id}
                direction="up"
                delay={idx * 100}
              >
                <a href={`/gemstones/${alt.id}`} className="group flex flex-col h-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden hover:border-champagne-gold/40 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[4/5] bg-charcoal overflow-hidden relative">
                    <img
                      alt={alt.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                      src={alt.imageUrl}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                    <div>
                      <div className="flex justify-between items-baseline text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                        <span>{alt.carat} ct • {alt.cut.split(" ")[0]}</span>
                        <span className="text-champagne-gold font-semibold">{alt.clarity}</span>
                      </div>
                      <h4 className="font-headline-sm text-sm text-emerald-deep group-hover:text-champagne-gold transition-colors duration-300 leading-tight">
                        {alt.title}
                      </h4>
                    </div>

                    <div className="h-[0.5px] w-full bg-outline-variant/20 my-1"></div>

                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-emerald-deep">${alt.price.toLocaleString()}</span>
                      <span className="font-label-caps text-[9px] uppercase text-champagne-gold tracking-widest group-hover:underline flex items-center gap-0.5">
                        Inquire <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
