"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsPage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.title?.ar?.includes(searchTerm)
  );

  const t = {
    title: language === "ar" ? "جميع المنتجات" : "All Products",
    searchPlaceholder: language === "ar" ? "ابحث عن منتج..." : "Search for a product...",
    filter: language === "ar" ? "تصفية" : "Filter",
  };

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-4xl font-black">{t.title}</h1>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 glass rounded-2xl font-bold border-white/20">
              <FiFilter /> {t.filter}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-[400px] bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-500 font-bold text-xl">
                  {language === "ar" ? "لم يتم العثور على منتجات تطابق بحثك" : "No products found matching your search"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
