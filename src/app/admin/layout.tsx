"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiGrid, FiBox, FiShoppingCart, FiUsers, 
  FiStar, FiLayers, FiSettings, FiLogOut, FiMenu, FiX, FiActivity, FiGlobe
} from "react-icons/fi";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import AdminNotifications from "@/components/AdminNotifications";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarLinks = [
  { name: { ar: "نظرة عامة", en: "Overview" }, icon: <FiGrid />, href: "/admin" },
  { name: { ar: "المنتجات", en: "Products" }, icon: <FiBox />, href: "/admin/products" },
  { name: { ar: "الأقسام", en: "Categories" }, icon: <FiLayers />, href: "/admin/categories" },
  { name: { ar: "الطلبات", en: "Orders" }, icon: <FiShoppingCart />, href: "/admin/orders" },
  { name: { ar: "الكوبونات", en: "Coupons" }, icon: <FiStar />, href: "/admin/coupons" },
  { name: { ar: "المستخدمين", en: "Users" }, icon: <FiUsers />, href: "/admin/users" },
  { name: { ar: "الشركاء", en: "Partners" }, icon: <FiLayers />, href: "/admin/partners" },
  { name: { ar: "التقييمات", en: "Reviews" }, icon: <FiStar />, href: "/admin/reviews" },
  { name: { ar: "سجل العمليات", en: "Audit Logs" }, icon: <FiActivity />, href: "/admin/logs", superAdminOnly: true },
  { name: { ar: "تحسين SEO والمدونة", en: "SEO & Blog Manager" }, icon: <FiGlobe />, href: "/admin/seo" },
  { name: { ar: "الإعدادات", en: "Settings" }, icon: <FiSettings />, href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { language } = useLanguage();
  const router = useRouter();

  const userRole = (session?.user as any)?.role;

  React.useEffect(() => {
    if (status !== "loading" && (!session || (userRole !== "admin" && userRole !== "superadmin"))) {
      router.push("/login");
    }
  }, [status, session, userRole, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-white/50 font-bold tracking-widest text-sm uppercase">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session || (userRole !== "admin" && userRole !== "superadmin")) {
    return null;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <img 
              src="/Logo-removebg-preview.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-tighter leading-none">SHETA-SAIF</span>
            <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">ADMIN</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {sidebarLinks
          .filter(link => !link.superAdminOnly || userRole === "superadmin")
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300",
                pathname === link.href 
                  ? "gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-bold text-sm">{language === "ar" ? link.name.ar : link.name.en}</span>
            </Link>
          ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-6 py-4 text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm"
        >
          <FiLogOut className="text-xl" />
          <span>{language === "ar" ? "خروج" : "Logout"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0A0A0A] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-black border-r border-white/5 flex-col shadow-2xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-y-0 w-72 bg-black z-[110] lg:hidden shadow-2xl",
                language === "ar" ? "right-0" : "left-0"
              )}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <FiMenu className="text-2xl" />
            </button>
            <h2 className="text-lg md:text-2xl font-black tracking-tight truncate max-w-[200px] md:max-w-none">
              {sidebarLinks.find(l => l.href === pathname)?.name[language === 'ar' ? 'ar' : 'en'] || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <AdminNotifications />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-black text-sm">{session?.user?.name || "Admin"}</div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {userRole}
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-lg">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-black flex items-center justify-center font-black text-primary text-sm md:text-base">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
