import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ScrollReveal from "@/components/shared/ScrollReveal";

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-render static pages for all published blog routes at build time
export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// Generate dynamic browser tab titles and metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!blog) {
    return {
      title: "Journal Post Not Found | Gemshouse",
    };
  }

  return {
    title: `${blog.title} | Gemshouse Journal`,
    description: blog.excerpt || `Read our curated journal on ${blog.category.name}: ${blog.title}.`,
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;

  // Fetch the detailed blog post
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: { name: true }
      }
    }
  });

  if (!blog || !blog.published) {
    notFound();
  }

  // Fetch recent articles for the bottom recommendation section
  const recentBlogs = await prisma.blog.findMany({
    where: {
      published: true,
      id: { not: blog.id }
    },
    take: 3,
    include: {
      category: true,
      author: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate reading time
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Split content by newlines to render as separate paragraphs
  const paragraphs = blog.content.split(/\n+/).filter(p => p.trim().length > 0);

  return (
    <>
      <main className="flex-grow pt-32 md:pt-40 pb-20 px-margin-mobile md:px-margin-desktop max-w-4xl w-full mx-auto mt-2">
        {/* Breadcrumbs */}
        <ScrollReveal direction="fade" delay={0}>
          <nav className="flex items-center gap-2 text-[10px] font-label-caps text-on-surface-variant/50 uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-champagne-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-champagne-gold transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-on-surface-variant/70 truncate max-w-[180px] md:max-w-xs">
              {blog.title}
            </span>
          </nav>
        </ScrollReveal>

        {/* Article Header */}
        <header className="mb-10 flex flex-col gap-4">
          <ScrollReveal direction="up" delay={100}>
            <span className="bg-emerald-deep/10 text-emerald-deep dark:bg-champagne-gold/15 dark:text-champagne-gold font-label-caps text-[10px] tracking-wider px-3 py-1 rounded-none border border-emerald-deep/20 dark:border-champagne-gold/20 uppercase inline-block w-fit select-none">
              {blog.category.name}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h1 className="font-display-lg text-3xl md:text-5xl text-emerald-deep font-serif leading-tight tracking-wide mt-2">
              {blog.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-on-surface-variant/60 font-body-md border-y border-outline-variant/10 py-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm select-none text-champagne-gold">edit</span>
                By {blog.author.name || "Gemshouse Curator"}
              </span>
              <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm select-none text-champagne-gold">calendar_today</span>
                {blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
              </span>
              <span className="text-on-surface-variant/30 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm select-none text-champagne-gold">schedule</span>
                {readingTime} min read
              </span>
            </div>
          </ScrollReveal>
        </header>

        {/* Featured Image */}
        <ScrollReveal direction="fade" delay={400}>
          <div className="aspect-[21/9] bg-charcoal overflow-hidden relative mb-12 border border-outline-variant/20 sharp-clip-path shadow-xl">
            <img
              alt={blog.title}
              className="w-full h-full object-cover"
              src={blog.featuredImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200"}
            />
          </div>
        </ScrollReveal>

        {/* Article Body Content */}
        <article className="prose max-w-none mb-16">
          <ScrollReveal direction="up" delay={100}>
            <div className="font-body-md text-on-surface-variant/90 text-base leading-relaxed md:text-lg space-y-6">
              {paragraphs.map((para, index) => (
                <p key={index} className="indent-0">
                  {para}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </article>

        {/* Back Button */}
        <ScrollReveal direction="up" delay={200} className="border-t border-outline-variant/20 pt-8 flex justify-between items-center">
          <Link
            href="/blogs"
            className="font-label-caps text-xs uppercase text-champagne-gold hover:text-emerald-deep transition-colors flex items-center gap-2 border border-champagne-gold/30 hover:border-emerald-deep px-5 py-3 tracking-widest bg-surface-container-lowest"
          >
            <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
            Back to Journal
          </Link>
        </ScrollReveal>
      </main>

      {/* Recommended Recent Articles Panel */}
      {recentBlogs.length > 0 && (
        <section className="bg-surface-container-low py-20 border-t border-champagne-gold/20">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <ScrollReveal direction="up" delay={0}>
              <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
                <div>
                  <span className="font-label-caps text-[9px] tracking-widest text-champagne-gold uppercase block mb-1">
                    Editorial Journal Selection
                  </span>
                  <h2 className="font-headline-md text-xl md:text-headline-md text-emerald-deep">
                    Recent Editorial Releases
                  </h2>
                </div>
                
                <Link
                  className="font-label-caps text-[10px] md:text-xs uppercase text-champagne-gold hover:text-emerald-deep transition-colors flex items-center gap-2 border-b border-transparent hover:border-emerald-deep pb-1 tracking-widest"
                  href="/blogs"
                >
                  View All Articles
                  <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Grid list of alternative blog posts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentBlogs.map((altBlog, idx) => (
                <ScrollReveal
                  key={altBlog.id}
                  direction="up"
                  delay={idx * 100}
                >
                  <Link href={`/blog/${altBlog.slug}`} className="group flex flex-col h-full bg-surface-container-lowest border border-outline-variant/20 overflow-hidden hover:border-champagne-gold/40 hover:shadow-lg transition-all duration-300 sharp-clip-path">
                    <div className="aspect-[16/10] bg-charcoal overflow-hidden relative">
                      <img
                        alt={altBlog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                        src={altBlog.featuredImage || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"}
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-charcoal/80 backdrop-blur-md text-linen-white font-label-caps text-[9px] tracking-wider px-2 py-0.5 border border-outline-variant/20 uppercase select-none">
                          {altBlog.category.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col justify-between flex-grow gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-label-caps text-on-surface-variant/50 uppercase tracking-wider mb-2">
                          <span>By {altBlog.author.name || "Gemshouse Curator"}</span>
                        </div>
                        <h4 className="font-headline-sm text-sm text-emerald-deep group-hover:text-champagne-gold transition-colors duration-300 leading-tight">
                          {altBlog.title}
                        </h4>
                      </div>

                      <div className="h-[0.5px] w-full bg-outline-variant/20 my-1"></div>

                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="font-label-caps text-[9px] uppercase text-champagne-gold tracking-widest group-hover:underline flex items-center gap-0.5">
                          Read Journal <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
