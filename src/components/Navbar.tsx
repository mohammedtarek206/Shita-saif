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
    window.addEventListener("scroll", handleScroll);
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

  const navLinks = [
    { name: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { name: { ar: "المنتجات", en: "Products" }, href: "/products" },
    { name: { ar: "العروض", en: "Offers" }, href: "/offers" },
    { name: { ar: "شركاؤنا", en: "Partners" }, href: "/partners" },
    { name: { ar: "من نحن", en: "About Us" }, href: "/about" },
    { name: { ar: "تواصل معنا", en: "Contact" }, href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 h-24",
        isScrolled 
          ? "bg-white/95 dark:bg-black/90 backdrop-blur-xl shadow-2xl border-b border-gray-200 dark:border-white/5" 
          : "bg-white/80 dark:bg-black/50 backdrop-blur-md border-b border-black/5 dark:border-white/5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-primary rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <img 
              src="/Logo-removebg-preview.png" 
              alt="Logo" 
              className="w-20 h-20 object-contain relative transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {language === "ar" ? (
            <div className="flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none bg-gradient-to-r from-[#E91E63] to-[#1E4FA3] bg-clip-text text-transparent py-1">
                الشتاء والصيف
              </span>
              <span className="text-[10px] font-bold tracking-[0.1em] text-gray-800 dark:text-gray-400 mt-1">
                للأجهزة المنزلية الفاخرة
              </span>
            </div>
          ) : (
            <div dir="ltr" className="flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-black tracking-tighter leading-none bg-gradient-to-r from-[#E91E63] to-[#1E4FA3] bg-clip-text text-transparent uppercase py-1 select-none">
                SHETA <span className="text-gray-400 dark:text-gray-500 font-light mx-1">- & -</span> SAIF
              </span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-gray-800 dark:text-gray-400 uppercase mt-1">
                Premium Appliances
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-all hover:text-primary relative group/link",
                pathname === link.href 
                  ? "text-primary" 
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {language === "ar" ? link.name.ar : link.name.en}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-700 dark:text-gray-200"
          >
            <FiSearch className="text-xl" />
          </button>
          
          <Link href="/wishlist" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block text-gray-700 dark:text-gray-200 relative">
            <FiHeart className="text-xl" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full animate-bounce-subtle">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative text-gray-700 dark:text-gray-200">
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full animate-bounce-subtle">
                {totalItems}
              </span>
            )}
          </Link>


          <div className="h-6 w-[1px] bg-foreground/20 mx-2 hidden md:block" />

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block text-gray-700 dark:text-gray-200"
          >
            {theme === "light" ? <FiMoon className="text-xl" /> : <FiSun className="text-xl" />}
          </button>

          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex items-center gap-1 text-gray-700 dark:text-gray-200"
          >
            <FiGlobe className="text-xl" />
            <span className="text-xs font-bold uppercase">{language === "ar" ? "EN" : "AR"}</span>
          </button>

          <div className="h-6 w-[1px] bg-foreground/20 mx-2 hidden md:block" />

          {status === "authenticated" ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-foreground/5 hover:bg-foreground/10 rounded-full transition-all border border-foreground/10"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                  {session.user?.name?.charAt(0)}
                </div>
                <span className="text-sm font-bold hidden md:block max-w-[100px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </button>
              
              {/* Dropdown - click-based, stays open */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <p className="text-xs text-gray-500 mb-1">{language === "ar" ? "مرحباً بك" : "Welcome back"}</p>
                    <p className="font-black truncate text-sm">{session.user?.name}</p>
                    <p className="text-xs text-primary font-bold capitalize">{(session.user as any).role}</p>
                  </div>
                  
                  <div className="p-2">
                    {((session.user as any).role === "admin" || (session.user as any).role === "superadmin") && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 hover:text-primary rounded-xl transition-all text-sm font-bold"
                      >
                        <FiUser className="text-lg" />
                        {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
                      </Link>
                    )}
                    <Link 
                      href="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all text-sm font-bold"
                    >
                      <FiUser className="text-lg" />
                      {language === "ar" ? "الملف الشخصي" : "Profile"}
                    </Link>
                    <Link 
                      href="/profile?tab=orders" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all text-sm font-bold"
                    >
                      <FiShoppingBag className="text-lg" />
                      {language === "ar" ? "طلباتي" : "My Orders"}
                    </Link>
                    <button 
                      onClick={() => { signOut(); setIsDropdownOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 rounded-xl transition-all text-sm font-bold mt-1"
                    >
                      <FiLogOut className="text-lg" />
                      {language === "ar" ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <FiUser className="text-xl" />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass p-4 border-t border-white/10"
          >
            <div className="container mx-auto flex items-center gap-2">
              <input 
                type="text" 
                placeholder={language === "ar" ? "ابحث عن منتجات..." : "Search products..."}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium">
                {language === "ar" ? "بحث" : "Search"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-0 z-40 bg-background lg:hidden pt-24 px-6"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold hover:text-primary transition-colors"
                >
                  {language === "ar" ? link.name.ar : link.name.en}
                </Link>
              ))}
              <div className="h-[1px] bg-foreground/10 my-4" />
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleTheme}
                  className="p-3 bg-foreground/5 rounded-xl flex-1 flex items-center justify-center gap-2"
                >
                  {theme === "light" ? <FiMoon /> : <FiSun />}
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
