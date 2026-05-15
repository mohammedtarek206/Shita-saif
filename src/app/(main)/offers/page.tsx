"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { FiPercent, FiGift, FiClock, FiStar, FiChevronRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function OffersPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.filter(p => p.discount > 0));
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const t = {
    title: language === "ar" ? "عروض حصرية" : "Exclusive Offers",
    subtitle: language === "ar" ? "وفّر أكثر مع أفضل الخصومات لهذا الأسبوع" : "Save more with this week's top discounts",
    endsIn: language === "ar" ? "ينتهي في:" : "Ends in:",
    timer: language === "ar" ? "24 ساعة : 15 دقيقة" : "24h : 15m",
    noOffers: language === "ar" ? "لا توجد عروض حالياً" : "No offers available",
    browseAll: language === "ar" ? "تصفح كل المنتجات" : "Browse All Products",
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      
      {/* Dynamic Offers Hero */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent -z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 bg-primary/10 text-primary rounded-full font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-3"
            >
              <FiPercent /> {language === "ar" ? "خصومات تصل إلى 50%" : "UP TO 50% OFF"}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-tight"
            >
              {t.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-gray-500 dark:text-gray-400 text-lg md:text-2xl font-bold mb-12"
            >
              {t.subtitle}
            </motion.p>
            
            {/* Countdown Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-8 px-10 py-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 text-primary">
                <FiClock className="text-2xl animate-pulse" />
                <span className="font-black uppercase tracking-widest text-sm">{t.endsIn}</span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-white/10" />
              <div className="font-black text-2xl italic tabular-nums tracking-tighter text-primary">
                {t.timer}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20">
        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: <FiGift />, t: language === "ar" ? "هدايا مجانية" : "Free Gifts", d: language === "ar" ? "على منتجات مختارة" : "On selected items" },
            { icon: <FiStar />, t: language === "ar" ? "الأكثر مبيعاً" : "Best Sellers", d: language === "ar" ? "تقييمات ممتازة" : "Top rated offers" },
            { icon: <FiPercent />, t: language === "ar" ? "خصم إضافي" : "Extra Discount", d: language === "ar" ? "لمشتريات الموبايل" : "For mobile app users" },
          ].map((feat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}
              key={i} className="p-8 bg-gray-50 dark:bg-white/2 rounded-[2.5rem] flex items-center gap-6 group hover:bg-primary transition-all cursor-pointer"
            >
              <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-3xl text-primary group-hover:bg-white group-hover:scale-110 transition-all shadow-xl">
                {feat.icon}
              </div>
              <div>
                <h3 className="font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">{feat.t}</h3>
                <p className="text-sm text-gray-500 font-bold group-hover:text-white/80 transition-colors">{feat.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {products.length > 0 ? (
                products.map((product, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    key={product._id}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-40">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl text-gray-300">
                    <FiPercent />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{t.noOffers}</h2>
                  <Link href="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                    {t.browseAll} <FiChevronRight />
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
