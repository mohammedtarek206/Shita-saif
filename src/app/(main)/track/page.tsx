"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function TrackOrderPage() {
  const { language } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsSearching(true);
    // Mocking an API call for tracking
    setTimeout(() => {
      // Dummy data based on entered ID
      const statusOptions = ["Processing", "Shipped", "Delivered"];
      const randomStatus = statusOptions[orderId.length % 3];
      
      setOrderStatus({
        id: orderId,
        date: new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
        status: randomStatus,
        expectedDelivery: new Date(Date.now() + 86400000 * 3).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { weekday: 'long', month: 'long', day: 'numeric' }),
      });
      setIsSearching(false);
    }, 1500);
  };

  const t = {
    title: language === "ar" ? "تتبع طلبك" : "Track Your Order",
    subtitle: language === "ar" ? "أدخل رقم الطلب لمعرفة حالة الشحنة الخاصة بك" : "Enter your order ID to check the shipping status",
    placeholder: language === "ar" ? "رقم الطلب (مثال: ORD-12345)" : "Order ID (e.g. ORD-12345)",
    button: language === "ar" ? "تتبع الآن" : "Track Now",
    details: language === "ar" ? "تفاصيل الطلب" : "Order Details",
    orderNo: language === "ar" ? "طلب رقم:" : "Order No:",
    date: language === "ar" ? "تاريخ الطلب:" : "Order Date:",
    expected: language === "ar" ? "موعد الوصول المتوقع:" : "Expected Delivery:",
    statusMap: {
      Processing: language === "ar" ? "جاري التجهيز" : "Processing",
      Shipped: language === "ar" ? "تم الشحن" : "Shipped",
      Delivered: language === "ar" ? "تم التوصيل" : "Delivered",
    }
  };

  const steps = [
    { id: "Processing", icon: <FiClock />, labelAr: "جاري التجهيز", labelEn: "Processing" },
    { id: "Shipped", icon: <FiTruck />, labelAr: "في الطريق", labelEn: "Shipped" },
    { id: "Delivered", icon: <FiCheckCircle />, labelAr: "تم التوصيل", labelEn: "Delivered" }
  ];

  const getCurrentStepIndex = (status: string) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      
      <div className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary shadow-xl rotate-12">
              <FiMapPin className="text-4xl -rotate-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
              {t.title}
            </h1>
            <p className="text-gray-500 font-bold text-base md:text-lg mb-12">
              {t.subtitle}
            </p>

            {/* Tracking Form */}
            <form onSubmit={handleTrack} className="relative group max-w-2xl mx-auto">
              <FiSearch className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-2xl z-10" />
              <input 
                type="text" 
                placeholder={t.placeholder}
                className="w-full pl-20 pr-8 py-6 md:py-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-primary rounded-[2.5rem] outline-none font-black text-lg shadow-2xl transition-all text-gray-900 dark:text-white uppercase tracking-widest"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isSearching || !orderId.trim()}
                className="absolute right-3 top-3 bottom-3 px-8 md:px-12 bg-primary text-white font-black uppercase tracking-widest rounded-[2rem] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_10px_30px_rgba(233,30,99,0.3)]"
              >
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t.button
                )}
              </button>
            </form>
          </motion.div>

          {/* Tracking Results */}
          <AnimatePresence>
            {orderStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
                className="max-w-4xl mx-auto mt-16 md:mt-24"
              >
                <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16 pb-8 border-b border-gray-100 dark:border-white/5">
                    <div>
                      <p className="text-gray-500 font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-1">{t.orderNo}</p>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-primary">#{orderStatus.id}</h3>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 text-sm font-bold">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiClock /> {t.date} <span className="text-gray-900 dark:text-white">{orderStatus.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiPackage /> {t.expected} <span className="text-gray-900 dark:text-white font-black text-primary">{orderStatus.expectedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Timeline */}
                  <div className="relative">
                    <div className="absolute top-8 md:top-10 left-8 right-8 md:left-[10%] md:right-[10%] h-1.5 md:h-2 bg-gray-100 dark:bg-white/5 rounded-full z-0 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(getCurrentStepIndex(orderStatus.status) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-primary" 
                      />
                    </div>
                    
                    <div className="flex justify-between relative z-10">
                      {steps.map((step, index) => {
                        const isCompleted = index <= getCurrentStepIndex(orderStatus.status);
                        const isCurrent = index === getCurrentStepIndex(orderStatus.status);
                        return (
                          <div key={step?._id || step?.id || step?.slug || step?.name || step?.title?.en || step?.title?.ar || JSON.stringify(step).substring(0, 20)} className="flex flex-col items-center gap-4 w-1/3 text-center">
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-xl transition-all duration-500 ${
                                isCompleted 
                                  ? "bg-primary text-white shadow-primary/30 scale-110" 
                                  : "bg-white dark:bg-[#111] border-2 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-600"
                              }`}
                            >
                              {step.icon}
                            </motion.div>
                            <div>
                              <p className={`font-black text-sm md:text-lg uppercase tracking-widest transition-colors ${isCompleted ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                {language === "ar" ? step.labelAr : step.labelEn}
                              </p>
                              {isCurrent && (
                                <motion.span 
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                  className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] md:text-xs font-black rounded-lg uppercase tracking-widest"
                                >
                                  {language === "ar" ? "الحالة الحالية" : "Current Status"}
                                </motion.span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
