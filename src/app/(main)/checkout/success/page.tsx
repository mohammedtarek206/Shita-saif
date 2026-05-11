"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { FiCheckCircle, FiArrowRight, FiShoppingBag, FiFileText } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen pt-32 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto glass p-12 rounded-[3rem] border-white/20 shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">
            <FiCheckCircle />
          </div>
          
          <h1 className="text-4xl font-black mb-4">
            {language === "ar" ? "شكراً لطلبك!" : "Thank You!"}
          </h1>
          <p className="text-gray-500 text-lg mb-10">
            {language === "ar" 
              ? "تم استلام طلبك بنجاح. سنرسل لك رسالة تأكيد عبر البريد الإلكتروني قريباً." 
              : "Your order has been placed successfully. We'll send you a confirmation email shortly."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/profile?tab=orders" 
              className="flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <FiFileText />
              {language === "ar" ? "متابعة الطلبات" : "My Orders"}
            </Link>
            <Link 
              href="/products" 
              className="flex items-center justify-center gap-2 py-4 bg-dark dark:bg-white text-white dark:text-dark rounded-2xl font-bold hover:scale-105 transition-all"
            >
              <FiShoppingBag />
              {language === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
