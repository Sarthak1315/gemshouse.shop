"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/website/navbar/Navbar";
import Footer from "@/components/website/footer/Footer";

function RegisterContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data?.user) {
          router.push("/profile");
        }
      } catch (err) {
        console.error("Session check failed", err);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, isBusinessUser }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Successful registration & login auto-sign-in
      router.push("/profile");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-charcoal bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,81,50,0.12),rgba(255,255,255,0))]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-32 md:pt-40 pb-20 px-margin-mobile">
        <div className="w-full max-w-md z-10">
          <div className="text-center mb-8">
            <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-2">
              Collector Workspace
            </span>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-emerald-deep tracking-wider font-light uppercase">
              Register Account
            </h1>
            <div className="w-12 h-[0.5px] bg-champagne-gold/50 mx-auto mt-4"></div>
          </div>

          <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 p-8 md:p-10 shadow-2xl relative">
            <h2 className="font-headline-sm text-sm text-on-surface-variant mb-6 text-center font-normal tracking-wide">
              Create a portal account to track inquiries
            </h2>

            {error && (
              <div className="bg-red-950/20 border border-red-800/40 text-red-400 font-body-sm text-xs p-3.5 mb-6 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-sm select-none mt-0.5">warning</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={isLoading}
                  className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="font-label-caps text-[10px] text-on-surface-variant/80 tracking-widest uppercase block mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full bg-charcoal/20 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2 px-1 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
                />
              </div>

              {/* B2B User Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="isBusinessUser"
                  type="checkbox"
                  checked={isBusinessUser}
                  onChange={(e) => setIsBusinessUser(e.target.checked)}
                  disabled={isLoading}
                  className="w-4.5 h-4.5 accent-emerald-deep border-outline-variant focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="isBusinessUser"
                  className="font-body-md text-xs text-on-surface-variant/90 cursor-pointer select-none"
                >
                  I am a Business / B2B wholesale client
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-deep hover:bg-emerald-deep/90 text-linen-white py-3.5 font-label-caps text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 rounded-none border border-champagne-gold/30 disabled:bg-emerald-deep/55 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-linen-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined text-xs transition-transform duration-300 group-hover:translate-x-1 select-none">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
              <span className="font-body-sm text-xs text-on-surface-variant/60 block mb-2">
                Already have an account?
              </span>
              <a
                href="/login"
                className="font-label-caps text-xs text-champagne-gold hover:text-emerald-deep tracking-wider uppercase transition-colors"
              >
                Sign In Instead
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-charcoal">
          <div className="text-champagne-gold font-label-caps text-xs tracking-widest uppercase">
            Loading registration portal...
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
