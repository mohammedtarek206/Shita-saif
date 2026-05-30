"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiShoppingCart, FiTrash2, FiRepeat } from "react-icons/fi";
import Link from "next/link";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { language } = useLanguage();
  const { addToCart } = useCart();

  const t = {
    title: language === "ar" ? "مقارنة المنتجات" : "Product Comparison",
    subtitle: language === "ar" ? "قارن بين المنتجات لاختيار الأنسب لك" : "Compare products side by side to find the best fit",
    empty: language === "ar" ? "لا توجد منتجات للمقارنة" : "No products to compare",
    addProducts: language === "ar" ? "أضف منتجات من الكتالوج" : "Add products from the catalog",
    browse: language === "ar" ? "تصفح المنتجات" : "Browse Products",
    clearAll: language === "ar" ? "مسح الكل" : "Clear All",
    price: language === "ar" ? "السعر" : "Price",
    category: language === "ar" ? "القسم" : "Category",
    warranty: language === "ar" ? "الضمان" : "Warranty",
    specs: language === "ar" ? "المواصفات" : "Specifications",
    addToCart: language === "ar" ? "أضف للسلة" : "Add to Cart",
    remove: language === "ar" ? "إزالة" : "Remove",
    currency: language === "ar" ? "ج.م" : "EGP",
    available: language === "ar" ? "متوفر" : "Available",
    notAvailable: language === "ar" ? "غير متوفر" : "N/A",
  };

  // Collect all unique spec keys across all products
  const allSpecKeys: string[] = [];
  compareList.forEach(p => {
    const specs = language === "ar" ? p.specifications?.ar : p.specifications?.en;
    if (Array.isArray(specs)) {
      specs.forEach((s: any) => {
        if (s.key && !allSpecKeys.includes(s.key)) allSpecKeys.push(s.key);
      });
    }
  });

  const getSpec = (product: any, key: string) => {
    const specs = language === "ar" ? product.specifications?.ar : product.specifications?.en;
    if (!Array.isArray(specs)) return null;
    return specs.find((s: any) => s.key === key)?.value || null;
  };

  if (compareList.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
        <Navbar />
        <div className="container mx-auto px-4 pt-40 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl text-gray-300 dark:text-gray-700">
              <FiRepeat />
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">{t.empty}</h1>
            <p className="text-gray-500 font-bold mb-10">{t.addProducts}</p>
            <Link href="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest">
              {t.browse}
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      <Navbar />

      <div className="pt-32 pb-8 bg-white dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2">{t.title}</h1>
              <p className="text-gray-500 font-bold">{t.subtitle}</p>
            </div>
            <button
              onClick={clearCompare}
              className="flex items-center gap-2 px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              <FiTrash2 /> {t.clearAll}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-x-4">
          <thead>
            <tr>
              {/* Label column */}
              <th className="w-40 text-start pb-4" />
              {/* Product columns */}
              {compareList.map((product, i) => {
                const discounted = product.discount
                  ? product.price - (product.price * product.discount / 100)
                  : product.price;
                return (
                  <th key={(product as any)?._id || (product as any)?.id || (product as any)?.slug || (product as any)?.name || (product as any)?.title?.en || (product as any)?.title?.ar || JSON.stringify(product).substring(0, 20)} className="pb-4 align-top">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white dark:bg-white/[0.03] rounded-[2rem] p-6 border border-gray-100 dark:border-white/10 shadow-xl text-center relative group"
                    >
                      <button
                        onClick={() => removeFromCompare(product._id)}
                        className="absolute top-3 right-3 w-7 h-7 bg-rose-50 dark:bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                      >
                        <FiX size={12} />
                      </button>
                      <div className="w-28 h-28 mx-auto bg-gray-50 dark:bg-white/5 rounded-2xl p-3 mb-4">
                        <img src={product.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="font-black text-sm mb-3 line-clamp-2">
                        {language === "ar" ? product.title?.ar : product.title?.en}
                      </h3>
                      <div className="text-2xl font-black text-primary mb-1">
                        {discounted.toLocaleString()} <span className="text-xs">{t.currency}</span>
                      </div>
                      {product.discount! > 0 && (
                        <div className="text-xs text-gray-400 line-through mb-3">{product.price.toLocaleString()}</div>
                      )}
                      <button
                        onClick={() => addToCart({ ...product, discount: product.discount })}
                        className="w-full py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                      >
                        <FiShoppingCart size={14} /> {t.addToCart}
                      </button>
                    </motion.div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Category row */}
            <CompareRow label={t.category}>
              {compareList.map(p => (
                <td key={(p as any)?._id || (p as any)?.id || (p as any)?.slug || (p as any)?.name || (p as any)?.title?.en || (p as any)?.title?.ar || JSON.stringify(p).substring(0, 20)} className="py-4 px-6 text-center">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-black">
                    {typeof p.category === "object" && (p.category as any)?.name
                      ? (language === "ar" ? (p.category as any).name.ar : (p.category as any).name.en)
                      : p.category}
                  </span>
                </td>
              ))}
            </CompareRow>

            {/* Warranty row */}
            <CompareRow label={t.warranty}>
              {compareList.map(p => (
                <td key={(p as any)?._id || (p as any)?.id || (p as any)?.slug || (p as any)?.name || (p as any)?.title?.en || (p as any)?.title?.ar || JSON.stringify(p).substring(0, 20)} className="py-4 px-6 text-center font-bold text-sm">
                  {p.warranty || <span className="text-gray-300 dark:text-gray-700">—</span>}
                </td>
              ))}
            </CompareRow>

            {/* Spec rows */}
            {allSpecKeys.map((key, ki) => (
              <CompareRow key={ki} label={key}>
                {compareList.map(p => {
                  const val = getSpec(p, key);
                  return (
                    <td key={(p as any)?._id || (p as any)?.id || (p as any)?.slug || (p as any)?.name || (p as any)?.title?.en || (p as any)?.title?.ar || JSON.stringify(p).substring(0, 20)} className="py-4 px-6 text-center font-bold text-sm">
                      {val !== null ? (
                        <span>{val}</span>
                      ) : (
                        <FiX className="mx-auto text-gray-300 dark:text-gray-700" />
                      )}
                    </td>
                  );
                })}
              </CompareRow>
            ))}

            {allSpecKeys.length === 0 && (
              <CompareRow label={t.specs}>
                {compareList.map(p => (
                  <td key={(p as any)?._id || (p as any)?.id || (p as any)?.slug || (p as any)?.name || (p as any)?.title?.en || (p as any)?.title?.ar || JSON.stringify(p).substring(0, 20)} className="py-4 px-6 text-center text-gray-400 text-xs font-bold">{t.notAvailable}</td>
                ))}
              </CompareRow>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </main>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="group">
      <td className="py-4 pr-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">
          {label}
        </span>
      </td>
      {children}
    </tr>
  );
}
