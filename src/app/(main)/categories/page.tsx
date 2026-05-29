"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CategoriesPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const t = {
    title: language === "ar" ? "تسوق بالأقسام" : "Shop by Category",
    subtitle: language === "ar" ? "اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة" : "Discover our wide range of premium products",
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-white/[0.02] dark:to-[#0A0A0A] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-gray-900 dark:text-white">
              {t.title}
            </h1>
            <p className="text-gray-500 font-bold text-base md:text-lg">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-white dark:bg-white/5 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={(category as any)?._id || (category as any)?.id || (category as any)?.slug || (category as any)?.name || (category as any)?.title?.en || (category as any)?.title?.ar || JSON.stringify(category).substring(0, 20)}
              >
                <Link href={`/products?category=${category._id}`} className="group block h-full">
                  <div className="bg-white dark:bg-white/[0.02] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-2xl hover:border-primary/50 transition-all duration-500 h-full flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    <div className="relative h-48 bg-gray-50 dark:bg-white/[0.02] overflow-hidden z-10 p-6 flex items-center justify-center">
                      <img 
                        src={category.image || "/placeholder.png"} 
                        alt={category.name?.en} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col z-10 relative bg-white dark:bg-[#0A0A0A]">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary absolute -top-6 right-6 shadow-xl border border-white dark:border-[#0A0A0A]">
                        {category.icon ? (
                          <img src={category.icon} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="w-4 h-4 bg-primary rounded-full" />
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {language === "ar" ? category.name?.ar : category.name?.en}
                      </h3>
                      <p className="text-gray-500 text-sm font-bold line-clamp-2 mb-6">
                        {language === "ar" ? category.description?.ar : category.description?.en}
                      </p>
                      
                      {category.subCategories && category.subCategories.length > 0 && (
                        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                          <div className="flex flex-wrap gap-2">
                            {category.subCategories.slice(0, 4).map((sub: any, idx: number) => (
                              <span key={`item-${idx}`} className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                                {language === "ar" ? sub.name?.ar : sub.name?.en}
                              </span>
                            ))}
                            {category.subCategories.length > 4 && (
                              <span className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-black text-primary">
                                +{category.subCategories.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
