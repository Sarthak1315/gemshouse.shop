import React from "react";
import Navbar from "@/components/website/navbar/Navbar";
import Footer from "@/components/website/footer/Footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
