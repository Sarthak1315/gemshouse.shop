"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in, redirect to admin
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data?.user?.role === "ADMIN") {
          const redirectTo = searchParams.get("from") || "/admin/dashboard";
          router.push(redirectTo);
        }
      } catch (err) {
        console.error("Session check failed", err);
      }
    }
    checkSession();
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify credentials.");
        setIsLoading(false);
        return;
      }

      // Check if role is ADMIN
      if (data?.user?.role !== "ADMIN") {
        setError("Access restricted to administrators.");
        setIsLoading(false);
        // Clean up session since they logged in but are not admin
        await fetch("/api/auth", { method: "DELETE" });
        return;
      }

      // Success, redirect to the target page or dashboard
      const redirectTo = searchParams.get("from") || "/admin/dashboard";
      router.push(redirectTo);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(15,81,50,0.18),rgba(255,255,255,0))] px-6 py-12 relative overflow-hidden select-none">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-deep/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-champagne-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-2">
            Secure Portal
          </span>
          <h1 className="font-headline-lg text-3xl text-emerald-deep tracking-wider font-light">
            GEMSHOUSE
          </h1>
          <div className="w-12 h-[0.5px] bg-champagne-gold/50 mx-auto mt-4"></div>
        </div>

        {/* Login Form Card */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 p-8 md:p-10 shadow-2xl relative">
          <h2 className="font-headline-sm text-lg text-emerald-deep mb-6 text-center font-medium tracking-wide">
            Console Authentication
          </h2>

          {error && (
            <div className="bg-red-950/20 border border-red-800/40 text-red-400 font-body-sm text-xs p-3.5 mb-6 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sm select-none mt-0.5">warning</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="font-label-caps text-[10px] text-on-surface-variant/85 tracking-widest uppercase block mb-2"
              >
                Administrative Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gemshouse.shop"
                disabled={isLoading}
                className="w-full bg-charcoal/40 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2.5 px-1.5 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-label-caps text-[10px] text-on-surface-variant/85 tracking-widest uppercase block mb-2"
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
                className="w-full bg-charcoal/40 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2.5 px-1.5 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
              />
            </div>

            <div className="pt-2">
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
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Authenticate
                    <span className="material-symbols-outlined text-xs transition-transform duration-300 group-hover:translate-x-1 select-none">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help links */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="font-body-sm text-xs text-on-surface-variant/50 hover:text-champagne-gold transition-colors duration-300"
          >
            ← Return to storefront
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-charcoal">
          <div className="text-champagne-gold font-label-caps text-xs tracking-widest uppercase">
            Loading secure portal...
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}