"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CustomerLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data?.user) {
          if (data.user.role === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            let redirectTo = searchParams.get("from") || "/profile";
            if (redirectTo.includes("/login")) {
              redirectTo = "/profile";
            }
            router.push(redirectTo);
          }
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
        setError(data.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Successful login
      if (data?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        let redirectTo = searchParams.get("from") || "/profile";
        if (redirectTo.includes("/login")) {
          redirectTo = "/profile";
        }
        router.push(redirectTo);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-32 md:pt-40 pb-20 px-margin-mobile">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <span className="font-label-caps text-[10px] tracking-widest text-champagne-gold uppercase block mb-2">
            Collector Workspace
          </span>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-emerald-deep tracking-wider font-light uppercase">
            Client Login
          </h1>
          <div className="w-12 h-[0.5px] bg-champagne-gold/50 mx-auto mt-4"></div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 p-8 md:p-10 shadow-2xl relative">
          <h2 className="font-headline-sm text-sm text-on-surface-variant mb-6 text-center font-normal tracking-wide">
            Access your inquiries and collection settings
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 font-body-sm text-xs p-3.5 mb-6 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-sm select-none mt-0.5">warning</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-surface-container-low/50 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2.5 px-1.5 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
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
                className="w-full bg-surface-container-low/50 border-b border-outline-variant/40 focus:border-champagne-gold focus:outline-none text-emerald-deep font-body-md text-sm py-2.5 px-1.5 transition-all duration-300 rounded-none placeholder-on-surface-variant/30"
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
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
              New collector?
            </span>
            <Link
              href="/register"
              className="font-label-caps text-xs text-champagne-gold hover:text-emerald-deep tracking-wider uppercase transition-colors"
            >
              Register a Portal Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-champagne-gold font-label-caps text-xs tracking-widest uppercase">
            Loading portal...
          </div>
        </div>
      }
    >
      <CustomerLoginContent />
    </Suspense>
  );
}
