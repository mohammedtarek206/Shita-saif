"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiShoppingCart, FiHeart, FiUser, 
  FiMenu, FiX, FiMoon, FiSun, FiGlobe, FiLogOut, FiShoppingBag 
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSession, signOut } from "next-auth/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { name: { ar: "المنتجات", en: "Products" }, href: "/products" },
    { name: { ar: "العروض", en: "Offers" }, href: "/offers" },
    { name: { ar: "شركاؤنا", en: "Partners" }, href: "/partners" },
    { name: { ar: "من نحن", en: "About" }, href: "/about" },
    { name: { ar: "اتصل بنا", en: "Contact" }, href: "/contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-500",
          isScrolled 
            ? "h-16 md:h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-white/5" 
            : "h-20 md:h-24 bg-transparent"
        )}
      >
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 md:gap-4 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="/Logo-removebg-preview.png" 
                alt="Logo" 
                className={cn(
                  "object-contain relative transition-all duration-500 group-hover:scale-110",
                  isScrolled ? "w-10 h-10 md:w-14 md:h-14" : "w-14 h-14 md:w-20 md:h-20"
                )}
              />
            </div>
            <div className={cn("flex flex-col transition-all duration-500", isScrolled ? "scale-90 origin-left" : "scale-100")}>
              <span className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {language === "ar" ? "الشتاء والصيف" : "SHETA - SAIF"}
              </span>
              <span className="text-[8px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:block">
                {language === "ar" ? "للأجهزة المنزلية الفاخرة" : "Premium Home Appliances"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-bold transition-all hover:text-primary relative group/link py-2",
                  pathname === link.href 
                    ? "text-primary" 
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {language === "ar" ? link.name.ar : link.name.en}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-300 origin-right scale-x-0 group-hover/link:scale-x-100",
                  pathname === link.href && "scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                title="Search"
              >
                <FiSearch className="text-xl" />
              </button>
              
              <Link href="/wishlist" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative">
                <FiHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                {theme === "light" ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
              </button>

              <button onClick={toggleLanguage} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                <FiGlobe className="text-xl" />
                <span className="text-[10px] font-black">{language === "ar" ? "EN" : "AR"}</span>
              </button>
            </div>

            {/* Cart Always Visible */}
            <Link href="/cart" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative">
              <FiShoppingCart className="text-xl md:text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-primary text-white text-[10px] md:text-xs flex items-center justify-center rounded-full shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown / Login */}
            <div className="relative" ref={dropdownRef}>
              {status === "authenticated" ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-full border border-transparent hover:border-primary/30 transition-all"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {session.user?.name?.charAt(0)}
                  </div>
                </button>
              ) : (
                <Link href="/login" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                  <FiUser className="text-xl md:text-2xl" />
                </Link>
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-[110]"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <p className="text-xs text-gray-500">{language === "ar" ? "مرحباً بك" : "Welcome back"}</p>
                      <p className="font-black text-sm truncate">{session?.user?.name}</p>
                    </div>
                    <div className="p-2">
                      {((session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin") && (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-sm font-bold">
                          <FiGrid className="text-lg" />
                          {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
                        </Link>
                      )}
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all text-sm font-bold">
                        <FiUser className="text-lg" />
                        {language === "ar" ? "الملف الشخصي" : "Profile"}
                      </Link>
                      <Link href="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all text-sm font-bold">
                        <FiShoppingBag className="text-lg" />
                        {language === "ar" ? "طلباتي" : "My Orders"}
                      </Link>
                      <button onClick={() => signOut()} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-sm font-bold mt-1">
                        <FiLogOut className="text-lg" />
                        {language === "ar" ? "خروج" : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors relative z-[120]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-black z-[120] lg:hidden flex flex-col p-6 shadow-2xl",
                language === "ar" ? "right-0" : "left-0"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src="/Logo-removebg-preview.png" alt="Logo" className="w-12 h-12" />
                  <span className="font-black text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SHETA-SAIF</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-6 py-4 rounded-2xl transition-all",
                        pathname === link.href 
                          ? "bg-primary/10 text-primary font-black" 
                          : "text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-white/5"
                      )}
                    >
                      <span>{language === "ar" ? link.name.ar : link.name.en}</span>
                      <div className={cn("w-1.5 h-1.5 rounded-full bg-primary", pathname === link.href ? "opacity-100" : "opacity-0")} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={toggleTheme} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    {theme === "light" ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
                    <span className="text-[10px] font-black uppercase">{theme === "light" ? "Dark" : "Light"}</span>
                  </button>
                  <button onClick={toggleLanguage} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <FiGlobe className="text-xl" />
                    <span className="text-[10px] font-black uppercase">{language === "ar" ? "English" : "العربية"}</span>
                  </button>
                </div>
                
                {status === "unauthenticated" && (
                  <Link 
                    href="/login"
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-center shadow-lg shadow-primary/20"
                  >
                    {language === "ar" ? "دخول / تسجيل" : "Login / Register"}
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FiX className="text-2xl" />
            </button>
            <div className="w-full max-w-2xl flex flex-col gap-8">
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                {language === "ar" ? "عن ماذا تبحث؟" : "What are you looking for?"}
              </h2>
              <div className="relative group">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 text-2xl group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder={language === "ar" ? "ابحث عن الثلاجات، الغسالات، أو الماركات..." : "Search for fridges, washers, or brands..."}
                  className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-16 py-6 text-xl md:text-2xl text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

export default Navbar;
