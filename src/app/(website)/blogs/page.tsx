import React from "react";
import prisma from "@/lib/prisma";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: "Heritage & Craftsmanship Blog | Gemshouse Sourcing",
  description: "Read our curated journals on mineral exploration, lapidary history, and market investment trends of fine gemstones.",
};

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    include: {
      category: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>

      {/* Main Canvas */}
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max w-full mx-auto mt-2">
        {/* Header Section */}
        <header className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <ScrollReveal direction="fade" delay={0}>
            <span className="font-label-caps text-[10px] md:text-xs tracking-widest text-champagne-gold uppercase block">
              Editorial Journal
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={100}>
            <h1 className="font-display-lg text-display-lg-mobile md:text-headline-md lg:text-display-lg text-emerald-deep font-serif leading-tight tracking-wide">
              Heritage &amp; Craftsmanship
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <p className="font-body-md text-sm text-on-surface-variant/80 mt-2 leading-relaxed">
              Insights from our gemologists, lapidary masters, and vault curators on the geology, history, and investment pedigree of fine natural gemstones.
            </p>
          </ScrollReveal>
        </header>

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-outline-variant/20 bg-surface-container-low sharp-clip-path max-w-xl mx-auto">
            <span className="material-symbols-outlined text-4xl text-champagne-gold/60 select-none mb-3">
              article
            </span>
            <h3 className="font-headline-sm text-sm text-emerald-deep font-semibold">
              No Journals Published Yet
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant/65 mt-1">
              Please check back soon for our first editorial release.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {blogs.map((blog, idx) => (
              <ScrollReveal
                key={blog.id}
                direction="up"
                delay={idx * 100}
                className="h-full"
              >
                <Link href={`/blog/${blog.slug}`} className="h-full block">
                  <article className="group flex flex-col h-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden hover:border-champagne-gold/40 hover:shadow-lg transition-all duration-300 sharp-clip-path">
                    {/* Blog Image */}
                    <div className="aspect-[16/10] bg-charcoal overflow-hidden relative">
                      <img
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        src={blog.featuredImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-charcoal/80 backdrop-blur-md text-linen-white font-label-caps text-[9px] tracking-wider px-2.5 py-1 border border-outline-variant/20 uppercase select-none">
                          {blog.category.name}
                        </span>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-label-caps text-on-surface-variant/50 uppercase tracking-wider mb-2">
                          <span>By {blog.author.name || "Gemshouse Curator"}</span>
                          <span>•</span>
                          <span>
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : new Date(blog.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-base text-emerald-deep group-hover:text-champagne-gold transition-colors duration-300 leading-snug tracking-wide">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="font-body-md text-xs md:text-sm text-on-surface-variant/70 mt-2 line-clamp-3 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="h-[0.5px] w-full bg-outline-variant/20 my-1"></div>

                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="font-label-caps text-[9px] uppercase text-champagne-gold tracking-widest group-hover:underline flex items-center gap-0.5">
                          Read Journal <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
    </>
  );
}