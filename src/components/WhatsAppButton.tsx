"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppButton() {
  const { language } = useLanguage();
  const phoneNumber = "201223366046"; // Replace with actual phone number
  const message = language === "ar" ? "مرحباً، أود الاستفسار عن منتجاتكم." : "Hello, I would like to inquire about your products.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] cursor-pointer hover:bg-[#1ebd5a] transition-colors"
      style={language === "ar" ? { right: "auto", left: "1.5rem" } : {}}
      title={language === "ar" ? "تواصل معنا عبر واتساب" : "Contact us on WhatsApp"}
    >
      <div className="absolute inset-0 w-full h-full bg-[#25D366] rounded-full animate-ping opacity-30" />
      <FaWhatsapp className="text-3xl relative z-10" />
    </motion.a>
  );
}
