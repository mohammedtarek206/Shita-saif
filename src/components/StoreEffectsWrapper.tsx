"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiAlertTriangle, FiInstagram, FiPhoneCall, FiSettings } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function StoreEffectsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [config, setConfig] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/login");
  const isAuthorized = (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin";

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConfig();
    // Refresh configuration every 30 seconds for live updates
    const interval = setInterval(fetchConfig, 30000);
    return () => clearInterval(interval);
  }, []);

  // Flash sale countdown timer logic
  useEffect(() => {
    // Console Validation for React Key Warnings
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(" ");
      if (typeof message === "string" && message.includes("Encountered two children with the same key")) {
        console.warn("🚨 [React Key Validator]: Duplicate Key Found!", ...args);
        // Optional: show visual feedback in development
        if (process.env.NODE_ENV === "development") {
            console.trace("Duplicate Key Trace:");
        }
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (!config?.flashSale?.active || !config?.flashSale?.expiresAt) return;

    const timer = setInterval(() => {
      const expiry = new Date(config.flashSale.expiresAt).getTime();
      const now = new Date().getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft("");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h : ${minutes}m : ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  if (!config) return <>{children}</>;

  // 1. Maintenance Screen block
  if (config.maintenanceMode && !isAdminPath && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 relative overflow-hidden font-cairo">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Dynamic circular glowing shapes */}
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse pointer-events-none" />
        <div className="absolute w-96 h-96 bg-secondary/15 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse pointer-events-none" />

        <div className="relative max-w-xl w-full text-center space-y-8 glass p-10 md:p-14 rounded-[3.5rem] border-white/5 shadow-2xl backdrop-blur-2xl">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/20 animate-bounce">
            <FiSettings className="text-4xl text-white animate-spin-slow" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {language === "ar" ? "نجهّز لكم شيئاً مميزاً ✨" : "Crafting Something Special ✨"}
            </h1>
            <p className="text-sm text-gray-400 font-bold leading-relaxed">
              {language === "ar" 
                ? "معرض الشتاء والصيف يخضع حالياً لبعض التحديثات الدورية وتحسين الأسعار لنقدم لكم أفضل تجربة تسوق ممكنة. سنعود إليكم خلال لحظات!" 
                : "Winter & Summer exhibition is undergoing regular maintenance and optimization. We will be back online shortly with updated premium deals!"}
            </p>
          </div>

          {/* Customer support links */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-black text-gray-400">
            <a href="tel:01223366046" className="flex items-center gap-2 hover:text-primary transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
              <FiPhoneCall /> {language === "ar" ? "اتصل بالدعم الفني" : "Call Support"}
            </a>
            <Link href="/login" className="flex items-center gap-2 hover:text-primary transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
              <FiSettings /> {language === "ar" ? "لوحة الإدارة" : "Staff Login"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 2. Global Flash Sale Countdown Header Bar */}
      {config.flashSale?.active && timeLeft && !isAdminPath && (
        <div className="bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white py-3 px-4 text-center font-black text-xs md:text-sm tracking-wide shadow-xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 relative z-[99]">
          <span className="uppercase tracking-widest italic animate-pulse">
            🔥 {language === "ar" ? config.flashSale.titleAr : config.flashSale.titleEn}
          </span>
          <div className="bg-black/20 backdrop-blur-md px-4 py-1 rounded-full font-mono text-xs font-black tracking-widest border border-white/10 shrink-0">
            {timeLeft}
          </div>
          {config.flashSale.discountPercent > 0 && (
            <span className="text-[10px] bg-white text-rose-600 px-2 py-0.5 rounded-lg font-black uppercase">
              -{config.flashSale.discountPercent}% OFF EXTRA
            </span>
          )}
        </div>
      )}

      {/* 3. Global Winter Snowfall overlay */}
      {config.seasonalTheme === "winter" && !isAdminPath && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {Array.from({ length: 45 }).map((_, i) => {
            const size = Math.random() * 5 + 3;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 15 + 10;
            return (
              <div
                key={`item-${i}`}
                className="absolute bg-white rounded-full opacity-60 filter blur-[0.5px]"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `-10px`,
                  animation: `snowfall ${duration}s linear ${delay}s infinite`
                }}
              />
            );
          })}
          <style jsx global>{`
            @keyframes snowfall {
              0% {
                transform: translateY(0) translateX(0);
              }
              50% {
                transform: translateY(50vh) translateX(20px);
              }
              100% {
                transform: translateY(105vh) translateX(-20px);
              }
            }
          `}</style>
        </div>
      )}

      {/* 4. Global Summer Sunset Warm glowing overlay */}
      {config.seasonalTheme === "summer" && !isAdminPath && (
        <div className="fixed inset-0 pointer-events-none z-[9999] border-[12px] md:border-[20px] border-amber-500/5 shadow-[inset_0_0_60px_rgba(245,158,11,0.05)]" />
      )}

      {children}
    </>
  );
}
