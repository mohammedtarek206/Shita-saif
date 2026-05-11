"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiGrid, FiBox, FiShoppingCart, FiUsers, 
  FiStar, FiLayers, FiSettings, FiLogOut 
} from "react-icons/fi";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useSession, signOut } from "next-auth/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const sidebarLinks = [
  { name: "Overview", icon: <FiGrid />, href: "/admin" },
  { name: "Products", icon: <FiBox />, href: "/admin/products" },
  { name: "Orders", icon: <FiShoppingCart />, href: "/admin/orders" },
  { name: "Users", icon: <FiUsers />, href: "/admin/users" },
  { name: "Partners", icon: <FiLayers />, href: "/admin/partners" },
  { name: "Reviews", icon: <FiStar />, href: "/admin/reviews" },
  { name: "Settings", icon: <FiSettings />, href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Only show spinner while session is loading
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

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-dark dark:bg-black border-r border-white/5 flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <img 
                src="/Logo-removebg-preview.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain brightness-0 invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-white tracking-tighter leading-none">SHETA - SAIF</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">ADMIN PANEL</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300",
                pathname === link.href 
                  ? "gradient-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-bold">{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 w-full px-6 py-4 text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all font-bold"
          >
            <FiLogOut className="text-xl" />
            <span>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-[#0A0A0A]">
        <header className="h-20 bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-black tracking-tight">
            {sidebarLinks.find(l => l.href === pathname)?.name || "Dashboard Overview"}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-gray-200 dark:border-white/10">
              <div className="text-right">
                <div className="font-black text-sm">{session?.user?.name || "Admin"}</div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                  {(session?.user as any)?.role || "Super Admin"}
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-primary p-[2px] shadow-lg">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-black flex items-center justify-center font-black text-primary">
                  {session?.user?.name?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
