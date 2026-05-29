"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { FiSearch, FiFilter, FiTrendingUp, FiGrid, FiList } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import { PRICE_FILTER_MIN, PRICE_FILTER_MAX } from "@/constants/pricing";

function ProductsContent() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || "";
  const initialCategory = searchParams.get('category') || "all";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory !== "all" ? initialCategory : null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: PRICE_FILTER_MIN, max: PRICE_FILTER_MAX });
  const handlePriceChange = useCallback((range: { min: number; max: number }) => {
    setPriceRange(range);
  }, []);
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/categories")
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        if (Array.isArray(prodData)) setProducts(prodData);
        if (Array.isArray(catData)) setCategories(catData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        p.title?.en?.toLowerCase().includes(term) ||
        p.title?.ar?.includes(searchTerm) ||
        (typeof p.category === "string" && p.category.toLowerCase().includes(term));

      // Category matching
      const matchesCategory = !selectedCategory || p.category === selectedCategory || p.category?._id === selectedCategory;
      
      // SubCategory matching
      const matchesSub = !selectedSubCategory || p.subCategory === selectedSubCategory || p.subCategory?._id === selectedSubCategory;
      
      // Price matching
      const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;

      return matchesSearch && matchesCategory && matchesSub && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, selectedSubCategory, priceRange]);

  const t = {
    title: language === "ar" ? "كتالوج المنتجات" : "Product Catalog",
    subtitle: language === "ar" ? "اكتشف أفضل الأجهزة الكهربائية المنزلية" : "Discover the finest home appliances",
    searchPlaceholder: language === "ar" ? "ابحث عن التميز..." : "Search for excellence...",
    filter: language === "ar" ? "تصفية" : "Filter",
    results: language === "ar" ? "نتيجة" : "Results",
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      
      {/* Premium Header */}
      <div className="pt-32 pb-12 bg-white dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2 block italic">Winter & Summer Collection</span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-2">{t.title}</h1>
              <p className="text-gray-500 font-bold text-xs sm:text-sm md:text-base">{t.subtitle}</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5"
            >
              <button className="p-3 bg-white dark:bg-white/10 rounded-xl shadow-lg text-primary"><FiGrid /></button>
              <button className="p-3 text-gray-400 hover:text-primary transition-colors"><FiList /></button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-8 py-8 md:py-12">
        {/* Search and Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 mb-8 md:mb-16"
        >
          <div className="relative flex-1 w-full group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-6 py-4 sm:pl-16 sm:pr-8 sm:py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-primary rounded-2xl sm:rounded-[2rem] outline-none font-bold shadow-xl transition-all text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
              <FiFilter /> {t.filter}
            </button>
            <div className="hidden lg:flex items-center gap-2 px-6 py-5 bg-primary/10 text-primary rounded-[2rem] font-black text-xs uppercase tracking-widest">
              <FiTrendingUp /> {filteredProducts.length} {t.results}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0 space-y-8">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5">
              <h3 className="font-black text-lg mb-4 uppercase tracking-widest">{language === "ar" ? "الأقسام" : "Categories"}</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }}
                  className={`w-full text-start px-4 py-3 rounded-xl font-bold text-sm transition-all ${!selectedCategory ? "bg-primary text-white shadow-md" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                >
                  {language === "ar" ? "كل المنتجات" : "All Products"}
                </button>
                {categories.map(cat => {
                  const catId = cat?._id || cat?.id;
                  if (!catId) return null;
                  
                  return (
                    <div key={catId} className="space-y-1">
                      <button 
                        onClick={() => { setSelectedCategory(catId); setSelectedSubCategory(null); }}
                        className={`w-full text-start px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${selectedCategory === catId ? "bg-primary text-white shadow-md scale-[1.02]" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:translate-x-1 rtl:hover:-translate-x-1"}`}
                      >
                        {cat.icon && <img src={cat.icon} className={`w-5 h-5 transition-all ${selectedCategory === catId ? "brightness-0 invert" : "opacity-70"}`} alt="" />}
                        {language === "ar" ? cat.name?.ar : cat.name?.en}
                      </button>
                      
                      {/* SubCategories */}
                      <AnimatePresence>
                        {selectedCategory === catId && cat.subCategories?.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pl-4 pr-2 space-y-1 overflow-hidden mt-1">
                            {cat.subCategories.map((sub: any) => {
                              const subId = sub?._id || sub?.id;
                              if (!subId) return null;
                              
                              return (
                                <button 
                                  key={subId}
                                  onClick={() => setSelectedSubCategory(subId)}
                                  className={`w-full text-start px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 ${selectedSubCategory === subId ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent"}`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${selectedSubCategory === subId ? "bg-primary" : "bg-gray-300 dark:bg-white/20"}`} />
                                  {language === "ar" ? sub.name?.ar : sub.name?.en}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5">
              <h3 className="font-black text-lg mb-2 uppercase tracking-widest">{language === "ar" ? "نطاق السعر" : "Price Range"}</h3>
              <p className="text-xs text-gray-500 font-bold mb-5">
                {language === "ar" ? "من 0 إلى 1,000,000 ج.م" : "From 0 to 1,000,000 EGP"}
              </p>
              <PriceRangeSlider
                min={priceRange.min}
                max={priceRange.max}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] bg-white dark:bg-white/5 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    key={product?._id || product?.id || product?.slug || product?.name || product?.title?.en || product?.title?.ar || JSON.stringify(product).substring(0, 20)}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="col-span-full text-center py-32 bg-white dark:bg-white/2 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5"
                >
                  <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-gray-300">
                    <FiSearch />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">
                    {language === "ar" ? "لا توجد نتائج" : "No results found"}
                  </h3>
                  <p className="text-gray-500 font-bold">
                    {language === "ar" ? "جرب البحث بكلمات أخرى أو تصفح الأقسام" : "Try different keywords or browse categories"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
