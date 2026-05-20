"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiShoppingCart, FiHeart, FiUser, 
  FiMenu, FiX, FiMoon, FiSun, FiGlobe, FiLogOut, FiShoppingBag, FiGrid 
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
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const langDropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
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
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { name: { ar: "الأقسام", en: "Categories" }, href: "/categories" },
    { name: { ar: "المنتجات", en: "Products" }, href: "/products" },
    { name: { ar: "العروض", en: "Offers" }, href: "/offers" },
    { name: { ar: "شركاؤنا", en: "Partners" }, href: "/partners" },
    { name: { ar: "تتبع الطلب", en: "Track Order" }, href: "/track" },
    { name: { ar: "تواصل معنا", en: "Contact Us" }, href: "/contact" },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-700",
          isScrolled 
            ? "h-16 md:h-20 bg-white/90 dark:bg-black/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-b border-gray-200/50 dark:border-white/5" 
            : "h-20 md:h-28 bg-transparent"
        )}
      >
        {/* Subtle top gradient for readability when transparent */}
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent h-40 -z-10 pointer-events-none" />
        )}

        <div className="container mx-auto h-full px-4 md:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-4 md:gap-6 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/25 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img 
                src="/Logo-removebg-preview.png" 
                alt="Logo" 
                className={cn(
                  "object-contain relative transition-all duration-700 group-hover:scale-110 group-hover:rotate-12",
                  isScrolled ? "w-12 h-12 md:w-16 md:h-16" : "w-16 h-16 md:w-28 md:h-28"
                )}
              />
            </div>
            <div className={cn("flex flex-col transition-all duration-700", isScrolled ? "scale-90 origin-left" : "scale-100")}>
              <span className={cn(
                "text-xl md:text-4xl font-black tracking-tighter italic uppercase transition-all duration-500",
                !isScrolled ? "text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]" : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              )}>
                {language === "ar" ? "الشتاء والصيف" : "SHETA - SAIF"}
              </span>
              <span className={cn(
                "text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] hidden sm:block transition-all duration-500 mt-1",
                !isScrolled ? "text-white/80 drop-shadow-md" : "text-gray-500 dark:text-gray-400"
              )}>
                {language === "ar" ? "للأجهزة الكهربية المنزلية" : "Premium Home Appliances"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs md:text-sm font-black uppercase tracking-widest transition-all hover:text-primary relative group/link py-2 italic",
                  pathname === link.href 
                    ? "text-primary" 
                    : (!isScrolled ? "text-white drop-shadow-md" : "text-gray-800 dark:text-gray-200")
                )}
              >
                {language === "ar" ? link.name.ar : link.name.en}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform duration-500 origin-right scale-x-0 group-hover/link:scale-x-100",
                  pathname === link.href && "scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            <div className="hidden md:flex items-center gap-3">
              {[
                { icon: <FiSearch />, onClick: () => setIsSearchOpen(true), title: "Search" },
                { icon: <FiHeart />, href: "/wishlist", badge: wishlistCount },
                { icon: theme === "light" ? <FiMoon /> : <FiSun />, onClick: toggleTheme },
              ].map((action, i) => (
                action.href ? (
                  <Link 
                    key={i} href={action.href} 
                    className={cn(
                      "p-3 rounded-2xl transition-all relative hover:scale-110",
                      !isScrolled ? "text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                    )}
                  >
                    <span className="text-xl">{action.icon}</span>
                    {action.badge > 0 && (
                      <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg">
                        {action.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button 
                    key={i} onClick={action.onClick}
                    className={cn(
                      "p-3 rounded-2xl transition-all hover:scale-110",
                      !isScrolled ? "text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                    )}
                  >
                    <span className="text-xl">{action.icon}</span>
                  </button>
                )
              ))}

              <div className="relative" ref={langDropdownRef}>
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)} 
                  className={cn(
                    "px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-tighter hover:scale-105",
                    !isScrolled ? "text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  <img src={language === "ar" ? "https://flagcdn.com/w20/eg.png" : "https://flagcdn.com/w20/gb.png"} className="w-4 h-4 rounded-full object-cover" alt="flag" />
                  <span>{language === "ar" ? "العربية" : "English"}</span>
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-2"
                    >
                      <button 
                        onClick={() => { setLanguage("ar"); setIsLangDropdownOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                          language === "ar" ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <img src="https://flagcdn.com/w20/eg.png" className="w-5 h-5 rounded-full object-cover" alt="AR" />
                        العربية
                      </button>
                      <button 
                        onClick={() => { setLanguage("en"); setIsLangDropdownOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm mt-1",
                          language === "en" ? "bg-primary/10 text-primary" : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <img src="https://flagcdn.com/w20/gb.png" className="w-5 h-5 rounded-full object-cover" alt="EN" />
                        English
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Cart Always Visible */}
            <Link 
              href="/cart" 
              className={cn(
                "p-3 md:p-4 rounded-2xl transition-all relative hover:scale-110 group/cart shadow-xl",
                !isScrolled ? "bg-primary text-white" : "bg-primary text-white"
              )}
            >
              <FiShoppingCart className="text-xl md:text-2xl group-hover:rotate-12 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary text-xs flex items-center justify-center rounded-full font-black shadow-2xl border-2 border-primary">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              {status === "authenticated" ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 bg-gradient-to-tr from-primary to-secondary rounded-2xl border-2 border-white/20 shadow-2xl hover:scale-110 transition-all"
                >
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-white font-black text-lg">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className={cn(
                    "p-3 md:p-4 rounded-2xl transition-all hover:scale-110",
                    !isScrolled ? "text-white bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  )}
                >
                  <FiUser className="text-xl md:text-2xl" />
                </Link>
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="absolute right-0 mt-5 w-64 bg-white dark:bg-[#0A0A0A] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden z-[110]"
                  >
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-white/5 dark:to-transparent border-b border-gray-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 italic">Identity Verified</p>
                      <p className="font-black text-lg truncate uppercase italic tracking-tight">{session?.user?.name}</p>
                    </div>
                    <div className="p-3">
                      {[
                        { icon: <FiGrid />, label: language === "ar" ? "لوحة التحكم" : "Admin Panel", href: "/admin", adminOnly: true },
                        { icon: <FiUser />, label: language === "ar" ? "الملف الشخصي" : "Profile Settings", href: "/profile" },
                        { icon: <FiShoppingBag />, label: language === "ar" ? "طلباتي" : "Order History", href: "/profile?tab=orders" },
                      ].map((item, i) => (
                        (!item.adminOnly || (session?.user as any)?.role === "admin" || (session?.user as any)?.role === "superadmin") && (
                          <Link 
                            key={i} href={item.href} 
                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all text-xs font-black uppercase tracking-widest group"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.label}
                          </Link>
                        )
                      ))}
                      <button 
                        onClick={() => signOut()} 
                        className="flex items-center gap-4 w-full px-5 py-3.5 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all text-xs font-black uppercase tracking-widest mt-2"
                      >
                        <FiLogOut className="text-xl" />
                        {language === "ar" ? "تسجيل خروج" : "Terminate Session"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className={cn(
                "lg:hidden p-3 rounded-2xl transition-all relative z-[120]",
                !isScrolled ? "text-white bg-white/10 backdrop-blur-md border border-white/10" : "text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/5"
              )}
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
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setLanguage("ar")} className={cn("flex items-center gap-3 p-4 rounded-2xl transition-all", language === "ar" ? "bg-primary/10 text-primary font-black" : "bg-gray-50 dark:bg-white/5 font-bold")}>
                      <img src="https://flagcdn.com/w20/eg.png" className="w-6 h-6 rounded-full object-cover" alt="AR" />
                      العربية
                    </button>
                    <button onClick={() => setLanguage("en")} className={cn("flex items-center gap-3 p-4 rounded-2xl transition-all", language === "en" ? "bg-primary/10 text-primary font-black" : "bg-gray-50 dark:bg-white/5 font-bold")}>
                      <img src="https://flagcdn.com/w20/gb.png" className="w-6 h-6 rounded-full object-cover" alt="EN" />
                      English
                    </button>
                  </div>
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
