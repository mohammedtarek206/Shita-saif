"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiRepeat, FiArrowRight } from "react-icons/fi";
import { useCompare } from "@/context/CompareContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { language } = useLanguage();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] w-[95vw] max-w-2xl"
        >
          <div className="bg-white dark:bg-[#0F0F0F] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-4 flex items-center gap-4">
            {/* Products mini list */}
            <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar">
              {compareList.map(product => (
                <div key={product._id} className="relative shrink-0 group">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl p-2 border border-gray-100 dark:border-white/10 overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt=""
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <FiX size={10} />
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                <div key={i} className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 shrink-0 flex items-center justify-center text-gray-300 dark:text-gray-700 text-xl">
                  +
                </div>
              ))}
            </div>

            {/* Info + Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                  {language === "ar" ? "مقارنة المنتجات" : "Compare Products"}
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {compareList.length}/3 {language === "ar" ? "منتجات" : "selected"}
                </span>
              </div>

              <button
                onClick={clearCompare}
                className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                title={language === "ar" ? "مسح" : "Clear"}
              >
                <FiX size={16} />
              </button>

              {compareList.length >= 2 && (
                <Link
                  href="/compare"
                  className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  <FiRepeat />
                  {language === "ar" ? "قارن الآن" : "Compare"}
                  <FiArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
