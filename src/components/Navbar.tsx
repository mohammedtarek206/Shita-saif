"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
  FiShoppingBag,
  FiGrid,
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

const navLinks = [
  { name: { ar: "الرئيسية", en: "Home" }, href: "/" },
  { name: { ar: "الأقسام", en: "Categories" }, href: "/categories" },
  { name: { ar: "المنتجات", en: "Products" }, href: "/products" },
  { name: { ar: "العروض", en: "Offers" }, href: "/offers" },
  { name: { ar: "شركاؤنا", en: "Partners" }, href: "/partners" },
  { name: { ar: "تتبع الطلب", en: "Track Order" }, href: "/track" },
  { name: { ar: "تواصل معنا", en: "Contact Us" }, href: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const langRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const isAr = language === "ar";

  const isHomeHero = pathname === "/" && !isScrolled;
  const textOnDark = isHomeHero;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const iconBtnClass = cn(
    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
    textOnDark
      ? "text-white/90 hover:bg-white/15"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
          isScrolled || !textOnDark
            ? "h-16 border-b border-gray-200/60 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#0A0A0A]/95"
            : "h-16 bg-transparent"
        )}
      >
        {!isScrolled && pathname === "/" && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent"
            aria-hidden
          />
        )}

        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-3 sm:px-6 lg:gap-6 lg:px-10">
          {/* ——— Left: Brand ——— */}
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <img
              src="/Logo-removebg-preview.png"
              alt={isAr ? "الشتاء والصيف" : "Sheta Saif"}
              className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 object-contain"
            />
            <div className="hidden min-w-0 flex-col sm:flex">
              <span
                className={cn(
                  "truncate text-sm font-bold uppercase tracking-tight sm:text-base",
                  textOnDark ? "text-white" : "text-gray-900 dark:text-white"
                )}
              >
                {isAr ? "الشتاء والصيف" : "SHETA - SAIF"}
              </span>
              <span
                className={cn(
                  "truncate text-[10px] font-medium uppercase tracking-wider",
                  textOnDark ? "text-white/70" : "text-gray-500"
                )}
              >
                {isAr ? "للأجهزة الكهربائية المنزلية" : "Premium Home Appliances"}
              </span>
            </div>
          </Link>

          {/* ——— Center: Navigation (desktop) ——— */}
          <nav
            className="hidden flex-1 items-center justify-center xl:flex"
            aria-label={isAr ? "القائمة الرئيسية" : "Main navigation"}
          >
            <ul className="flex flex-wrap items-center justify-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors lg:px-3 lg:text-[13px]",
                        active
                          ? "bg-primary/15 text-primary"
                          : textOnDark
                            ? "text-white/90 hover:bg-white/10 hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                      )}
                    >
                      {isAr ? link.name.ar : link.name.en}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ——— Right: Actions ——— */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Desktop actions */}
            <div className="hidden items-center gap-1 md:flex md:gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={iconBtnClass}
                aria-label={isAr ? "بحث" : "Search"}
              >
                <FiSearch className="h-[18px] w-[18px]" />
              </button>

              <Link href="/wishlist" className={iconBtnClass} aria-label={isAr ? "المفضلة" : "Wishlist"}>
                <FiHeart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className={iconBtnClass} aria-label={isAr ? "السلة" : "Cart"}>
                <FiShoppingCart className="h-[18px] w-[18px]" />
                {totalItems > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className={cn(iconBtnClass, "hidden lg:flex")}
                aria-label={isAr ? "الوضع الليلي" : "Toggle theme"}
              >
                {theme === "light" ? <FiMoon className="h-[18px] w-[18px]" /> : <FiSun className="h-[18px] w-[18px]" />}
              </button>

              {/* Language pill */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors sm:px-3.5",
                    textOnDark
                      ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                      : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  )}
                >
                  <img
                    src={isAr ? "https://flagcdn.com/w20/eg.png" : "https://flagcdn.com/w20/gb.png"}
                    alt=""
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline">{isAr ? "العربية" : "English"}</span>
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute end-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-[#111]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage("ar");
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                          isAr ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-white/5"
                        )}
                      >
                        <img src="https://flagcdn.com/w20/eg.png" alt="" className="h-4 w-4 rounded-full" />
                        العربية
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage("en");
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                          !isAr ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-white/5"
                        )}
                      >
                        <img src="https://flagcdn.com/w20/gb.png" alt="" className="h-4 w-4 rounded-full" />
                        English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User */}
              <div className="relative" ref={dropdownRef}>
                {status === "authenticated" ? (
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-sm font-bold text-white"
                  >
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </button>
                ) : (
                  <Link href="/login" className={iconBtnClass} aria-label={isAr ? "تسجيل الدخول" : "Login"}>
                    <FiUser className="h-[18px] w-[18px]" />
                  </Link>
                )}
                <AnimatePresence>
                  {isDropdownOpen && status === "authenticated" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-[#111]"
                    >
                      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/10">
                        <p className="truncate text-sm font-bold">{session?.user?.name}</p>
                      </div>
                      <div className="p-2">
                        {[
                          {
                            icon: <FiGrid />,
                            label: isAr ? "لوحة التحكم" : "Admin",
                            href: "/admin",
                            adminOnly: true,
                          },
                          { icon: <FiUser />, label: isAr ? "الملف الشخصي" : "Profile", href: "/profile" },
                          {
                            icon: <FiShoppingBag />,
                            label: isAr ? "طلباتي" : "Orders",
                            href: "/profile?tab=orders",
                          },
                        ].map((item, i) => {
                          const role = (session?.user as { role?: string })?.role;
                          if (item.adminOnly && role !== "admin" && role !== "superadmin") return null;
                          return (
                            <Link
                              key={i}
                              href={item.href}
                              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10"
                        >
                          <FiLogOut />
                          {isAr ? "تسجيل خروج" : "Sign out"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: cart + menu */}
            <Link href="/cart" className={cn(iconBtnClass, "md:hidden")} aria-label="Cart">
              <FiShoppingCart className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              className={cn(iconBtnClass, "xl:hidden")}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={isAr ? "القائمة" : "Menu"}
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: isAr ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={cn(
                "fixed top-0 bottom-0 z-[120] flex w-[min(100%,320px)] flex-col bg-white shadow-2xl dark:bg-[#0A0A0A] xl:hidden",
                isAr ? "end-0" : "start-0"
              )}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <img src="/Logo-removebg-preview.png" alt="" className="h-9 w-9" />
                  <span className="text-sm font-bold">SHETA-SAIF</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="space-y-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-sm font-semibold",
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                        )}
                      >
                        {isAr ? link.name.ar : link.name.en}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(true)}
                    className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 text-xs font-semibold dark:bg-white/5"
                  >
                    <FiSearch />
                    {isAr ? "بحث" : "Search"}
                  </button>
                  <Link
                    href="/wishlist"
                    className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 text-xs font-semibold dark:bg-white/5"
                  >
                    <FiHeart />
                    {isAr ? "المفضلة" : "Wishlist"}
                  </Link>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex flex-col items-center gap-1 rounded-xl bg-gray-50 py-3 text-xs font-semibold dark:bg-white/5"
                  >
                    {theme === "light" ? <FiMoon /> : <FiSun />}
                    {isAr ? "المظهر" : "Theme"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 p-4 dark:border-white/10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage("ar")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold",
                      isAr ? "bg-primary text-white" : "bg-gray-50 dark:bg-white/5"
                    )}
                  >
                    <img src="https://flagcdn.com/w20/eg.png" alt="" className="h-4 w-4 rounded-full" />
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold",
                      !isAr ? "bg-primary text-white" : "bg-gray-50 dark:bg-white/5"
                    )}
                  >
                    <img src="https://flagcdn.com/w20/gb.png" alt="" className="h-4 w-4 rounded-full" />
                    English
                  </button>
                </div>
                {status !== "authenticated" && (
                  <Link
                    href="/login"
                    className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-bold text-white"
                  >
                    {isAr ? "دخول / تسجيل" : "Login / Register"}
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center bg-black/80 p-6 pt-28 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute end-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
            <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
              <label className="mb-3 block text-center text-lg font-bold text-white">
                {isAr ? "ابحث عن منتج..." : "Search products..."}
              </label>
              <div className="relative">
                <FiSearch className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? "ثلاجة، غسالة، تكييف..." : "Fridge, washer, AC..."}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-4 ps-12 pe-4 text-white outline-none focus:border-primary"
                  autoFocus
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
