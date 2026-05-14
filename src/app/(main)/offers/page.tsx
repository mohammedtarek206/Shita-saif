"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

export default function OffersPage() {
  const { language } = useLanguage();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter for products with discount > 0
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

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="gradient-primary p-12 rounded-[3rem] text-white text-center mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h1 className="text-5xl font-black mb-4 relative z-10">{language === "ar" ? "عروض حصرية" : "Exclusive Offers"}</h1>
          <p className="text-white/80 text-xl relative z-10">{language === "ar" ? "خصومات تصل إلى 50% لفترة محدودة" : "Discounts up to 50% for a limited time"}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-[400px] bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-500 font-bold text-xl">
                  {language === "ar" ? "لا توجد عروض حصرية حالياً. تابعنا قريباً!" : "No exclusive offers found at the moment. Stay tuned!"}
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
