"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { language } = useLanguage();

  const t = {
    title: language === "ar" ? "من نحن" : "About Us",
    description: language === "ar" 
      ? "معرض الشتاء والصيف هو وجهتك الأولى لأفضل الأجهزة المنزلية والكهربائية. نحن نسعى دائماً لتقديم الجودة العالية بأفضل الأسعار مع خدمة ما بعد البيع المتميزة."
      : "Winter & Summer Gallery is your first destination for the best home and electrical appliances. We always strive to provide high quality at the best prices with excellent after-sales service.",
    vision: language === "ar" ? "رؤيتنا" : "Our Vision",
    visionText: language === "ar" 
      ? "أن نكون الخيار الأول والأساسي لكل منزل في المنطقة عند البحث عن الجودة والابتكار في الأجهزة المنزلية."
      : "To be the first and primary choice for every home in the region when searching for quality and innovation in home appliances.",
    mission: language === "ar" ? "رسالتنا" : "Our Mission",
    missionText: language === "ar" 
      ? "توفير أحدث التقنيات العالمية وتسهيل اقتنائها من خلال حلول دفع ميسرة وفريق عمل احترافي."
      : "Providing the latest global technologies and facilitating their acquisition through easy payment solutions and a professional team.",
  };

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black mb-8">{t.title}</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              {t.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="glass p-10 rounded-[3rem] border-white/20">
              <h2 className="text-2xl font-black mb-4 text-primary">{t.vision}</h2>
              <p className="text-gray-500 leading-relaxed">{t.visionText}</p>
            </div>
            <div className="glass p-10 rounded-[3rem] border-white/20">
              <h2 className="text-2xl font-black mb-4 text-secondary">{t.mission}</h2>
              <p className="text-gray-500 leading-relaxed">{t.missionText}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
