import React from "react";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Force dynamic rendering so stats are always fresh

export default async function AdminDashboard() {
  // 1. Fetch live metrics from Supabase database
  const totalProducts = await prisma.product.count();
  
  const inventorySum = await prisma.product.aggregate({
    _sum: {
      price: true,
    },
  });
  const totalValue = inventorySum._sum.price ? Number(inventorySum._sum.price) : 0;

  const pendingInquiries = await prisma.inquiry.count({
    where: { status: "PENDING" },
  });

  const activeDealers = await prisma.dealer.count({
    where: { status: "APPROVED" },
  });
  
  const totalDealers = await prisma.dealer.count();

  const pendingReviews = await prisma.review.count({
    where: { approved: false },
  });

  const publishedBlogs = await prisma.blog.count({
    where: { published: true },
  });

  // 2. Fetch list data
  const latestInquiries = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });

  const latestProducts = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      category: true,
    },
  });

  return (
    <div className="w-full">
      {/* Welcome & Overview Header */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-1">
            Realtime Analytics
          </span>
          <h1 className="font-headline-md text-2xl md:text-3xl text-emerald-deep font-semibold">
            Executive Overview
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-outline-variant/30 text-on-surface hover:border-champagne-gold/60 font-label-caps text-[10px] uppercase tracking-widest bg-surface-container-lowest transition-colors flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-sm select-none">calendar_today</span>
            This Quarter
          </button>
        </div>
      </div>

      {/* High-Level Metrics (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Metric 1: Inventory Value */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-emerald-deep select-none">
              account_balance
            </span>
          </div>
          <p className="font-label-caps text-[10px] tracking-wider text-on-surface-variant/75 uppercase mb-2">
            Total Inventory Value
          </p>
          <h3 className="font-headline-md text-xl md:text-2xl text-emerald-deep mb-3 font-semibold">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-emerald-deep text-sm select-none">trending_up</span>
            <span className="text-emerald-deep font-semibold">+4.2%</span>
            <span className="text-on-surface-variant/60">vs last month</span>
          </div>
        </div>

        {/* Metric 2: Total Gemstones */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-emerald-deep select-none">
              diamond
            </span>
          </div>
          <p className="font-label-caps text-[10px] tracking-wider text-on-surface-variant/75 uppercase mb-2">
            Total Stone Inventory
          </p>
          <h3 className="font-headline-md text-xl md:text-2xl text-emerald-deep mb-3 font-semibold">
            {totalProducts} Stones
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-emerald-deep text-sm select-none">add</span>
            <span className="text-emerald-deep font-semibold">Active Vaults</span>
            <span className="text-on-surface-variant/60">Surat, Geneva</span>
          </div>
        </div>

        {/* Metric 3: Active Dealers */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-emerald-deep select-none">
              handshake
            </span>
          </div>
          <p className="font-label-caps text-[10px] tracking-wider text-on-surface-variant/75 uppercase mb-2">
            Active B2B Partners
          </p>
          <h3 className="font-headline-md text-xl md:text-2xl text-emerald-deep mb-3 font-semibold">
            {activeDealers} Dealers
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-on-surface font-semibold">{totalDealers} Applications</span>
            <span className="text-on-surface-variant/60">total registered</span>
          </div>
        </div>

        {/* Metric 4: Small stats bento rows */}
        <div className="grid grid-rows-3 gap-3">
          <div className="bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 rounded-none flex justify-between items-center border-l-2 border-l-champagne-gold shadow-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
              Pending Inquiries
            </span>
            <span className="font-body-md text-sm text-emerald-deep font-bold">{pendingInquiries}</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 rounded-none flex justify-between items-center border-l-2 border-l-champagne-gold shadow-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
              Moderations Pending
            </span>
            <span className="font-body-md text-sm text-emerald-deep font-bold">{pendingReviews}</span>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/15 px-4 py-2.5 rounded-none flex justify-between items-center border-l-2 border-l-champagne-gold shadow-sm">
            <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider">
              Published Blogs
            </span>
            <span className="font-body-md text-sm text-emerald-deep font-bold">{publishedBlogs}</span>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Revenue Performance Trend
            </h3>
            <span className="text-[9px] font-label-caps text-on-surface-variant/60 uppercase">
              Last 6 Months
            </span>
          </div>
          {/* Simulated Bar Chart */}
          <div className="h-60 w-full border-b border-l border-outline-variant/30 relative flex items-end px-2 pb-2 gap-4">
            {/* Chart Bars */}
            <div className="flex-1 bg-gradient-to-t from-champagne-gold/15 to-transparent h-[40%] border-t border-champagne-gold relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $1.2M
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-t from-champagne-gold/15 to-transparent h-[55%] border-t border-champagne-gold relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $1.8M
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-t from-champagne-gold/15 to-transparent h-[45%] border-t border-champagne-gold relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $1.5M
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-t from-emerald-deep/20 to-transparent h-[70%] border-t border-emerald-deep relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $2.4M
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-t from-emerald-deep/20 to-transparent h-[65%] border-t border-emerald-deep relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $2.1M
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-t from-emerald-deep/25 to-transparent h-[85%] border-t border-emerald-deep relative group">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-linen-white text-[9px] font-label-caps px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                $3.2M
              </div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-on-surface-variant/75 font-label-caps mt-3 px-2 uppercase tracking-wide">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Inquiry Sources Donut Chart */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none shadow-sm flex flex-col">
          <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide mb-6">
            Inquiry Channel Distribution
          </h3>
          <div className="flex-grow flex flex-col items-center justify-center">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#eae7e7"
                  strokeWidth="3.2"
                />
                {/* Segment 1: Direct Dealer (65%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#0F5132"
                  strokeWidth="3.2"
                  strokeDasharray="65 35"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Digital Concierge (25%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#D4AF37"
                  strokeWidth="3.2"
                  strokeDasharray="25 75"
                  strokeDashoffset="-65"
                />
                {/* Segment 3: Referrals (10%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke="#707971"
                  strokeWidth="3.2"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                />
              </svg>
              {/* Donut Center */}
              <div className="absolute text-center bg-surface-container-lowest w-24 h-24 rounded-full flex flex-col items-center justify-center">
                <span className="block font-headline-sm text-lg text-emerald-deep font-bold">100%</span>
                <span className="block text-[8px] font-label-caps text-on-surface-variant/50 uppercase tracking-widest mt-0.5">
                  Channels
                </span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-none bg-emerald-deep"></div>
                  <span className="text-on-surface-variant">Direct Dealer Inquiry</span>
                </div>
                <span className="font-semibold text-emerald-deep">65%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-none bg-champagne-gold"></div>
                  <span className="text-on-surface-variant">Digital Concierge</span>
                </div>
                <span className="font-semibold text-champagne-gold">25%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-none bg-outline"></div>
                  <span className="text-on-surface-variant">Other referrals</span>
                </div>
                <span className="font-semibold text-on-surface-variant">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Inquiries List */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Recent Client Inquiries
            </h3>
            <a
              href="/admin/inquiries"
              className="font-label-caps text-[9px] uppercase tracking-widest text-emerald-deep hover:text-champagne-gold transition-colors flex items-center gap-1 font-bold"
            >
              Manage Inquiries
              <span className="material-symbols-outlined text-xs select-none">arrow_forward</span>
            </a>
          </div>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-3 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Client
                  </th>
                  <th className="pb-3 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Interest
                  </th>
                  <th className="pb-3 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold">
                    Received
                  </th>
                  <th className="pb-3 font-label-caps text-[9px] text-on-surface-variant uppercase tracking-widest font-semibold text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs font-body-md">
                {latestInquiries.length > 0 ? (
                  latestInquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container-low/35 transition-colors"
                    >
                      <td className="py-4 font-semibold text-emerald-deep">
                        {inquiry.name}
                        <span className="block text-[10px] text-on-surface-variant/65 font-normal">
                          {inquiry.email}
                        </span>
                      </td>
                      <td className="py-4 text-on-surface font-medium">
                        {inquiry.product ? inquiry.product.title : "General Consultation"}
                        {inquiry.phone && (
                          <span className="block text-[10px] text-on-surface-variant/65 font-normal">
                            {inquiry.phone}
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-on-surface-variant/80 text-[11px]">
                        {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-label-caps uppercase tracking-wider ${
                            inquiry.status === "PENDING"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                              : inquiry.status === "CLOSED_WON"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                              : "bg-surface-variant border-outline-variant text-on-surface-variant"
                          }`}
                        >
                          {inquiry.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant/60">
                      No client inquiries recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Inventory Additions */}
        <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-none shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-base text-emerald-deep font-semibold tracking-wide">
              Recently Added Gems
            </h3>
            <a
              href="/admin/inventory"
              className="font-label-caps text-[9px] uppercase tracking-widest text-emerald-deep hover:text-champagne-gold transition-colors flex items-center gap-1 font-bold"
            >
              Inventory Management
              <span className="material-symbols-outlined text-xs select-none">arrow_forward</span>
            </a>
          </div>
          <div className="space-y-4">
            {latestProducts.length > 0 ? (
              latestProducts.map((stone) => {
                const primaryImage = stone.images.find((img) => img.isPrimary) || stone.images[0];
                return (
                  <div
                    key={stone.id}
                    className="flex items-center gap-4 p-3.5 hover:bg-surface-container-low/30 border border-outline-variant/10 hover:border-champagne-gold/30 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-charcoal/10 overflow-hidden flex-shrink-0 border border-outline-variant/15">
                      {primaryImage ? (
                        <img
                          alt={stone.title}
                          className="w-full h-full object-cover"
                          src={primaryImage.url}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-on-surface-variant/50 uppercase font-semibold">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm text-on-surface truncate">
                          {stone.title}
                        </h4>
                        <span className="font-headline-sm text-xs font-semibold text-emerald-deep">
                          ${Number(stone.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant/85 mt-1 font-medium">
                        {stone.carat} ct • {stone.cut || "N/A"} • {stone.origin || "Unknown Origin"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[8px] font-label-caps px-1.5 py-0.5 bg-surface-container-low text-on-surface-variant uppercase tracking-wider border border-outline-variant/15">
                          {stone.category.name}
                        </span>
                        {stone.certification && (
                          <span className="text-[8px] font-label-caps px-1.5 py-0.5 bg-champagne-gold/10 text-emerald-deep border border-champagne-gold/25 uppercase tracking-wider">
                            {stone.certification}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-on-surface-variant/60">
                No items recorded in inventory yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}