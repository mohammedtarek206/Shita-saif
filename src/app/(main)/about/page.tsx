"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { FiAward, FiUsers, FiHeart, FiTrendingUp } from "react-icons/fi";

export default function AboutPage() {
  const { language } = useLanguage();

  const t = {
    title: language === "ar" ? "معرض الشتاء والصيف" : "Winter & Summer Store",
    subtitle: language === "ar" ? "تأسس برعاية رجل الأعمال الأستاذ محمد محمد وهبه" : "Founded and Sponsored by Mr. Mohamed Mohamed Wahba",
    description: language === "ar" 
      ? "يعتبر معرض الشتاء والصيف للأجهزة الكهربائية والمنزلية أحد الصروح الرائدة في جمهورية مصر العربية لتوفير أجود أنواع الأجهزة المنزلية بأسعار تنافسية وخدمات دفع وتسهيلات لا مثيل لها."
      : "Winter & Summer Exhibition is one of Egypt's leading sanctuaries for luxury home and electrical appliances, trusted by thousands of local families.",
    vision: language === "ar" ? "رؤيتنا" : "Our Vision",
    visionText: language === "ar" 
      ? "أن نكون القبلة الأولى والأساسية لكل منزل في مصر عند البحث عن الجودة، التميز والضمان الحقيقي للأجهزة المنزلية."
      : "To be the primary destination in Egypt for high quality, reliable home automation and authentic appliance warranties.",
    mission: language === "ar" ? "رسالتنا" : "Our Mission",
    missionText: language === "ar" 
      ? "توفير أحدث التقنيات العالمية من شاشات، غسالات، ثلاجات، وتكييفات، مع تسهيل اقتنائها وتوفير الدعم والصيانة برعاية وإشراف شخصي."
      : "Providing the latest Smart TV, Washing Machines and AC technologies with simplified payment options and specialized technical support.",
    founderTitle: language === "ar" ? "كلمة رئيس مجلس الإدارة" : "Message from Our Chairman",
    founderName: language === "ar" ? "محمد محمد وهبه (Mohamed Wahba)" : "Mohamed Mohamed Wahba",
    founderBio: language === "ar"
      ? "يفخر معرض الشتاء والصيف بتقديم أرقى مستويات الخدمة تحت إشراف الأستاذ محمد محمد وهبه. نسعى جاهدين ليس فقط لبيع الأجهزة الكهربائية، بل لبناء علاقات ثقة مستمرة مع كل أسرة مصرية، وتوفير الحلول الذكية التي تناسب الاحتياجات والقدرات المختلفة، ملتزمين دائماً بالأمانة والسرعة والجودة الفائقة."
      : "Under the leadership of Mr. Mohamed Wahba, we strive to build lifelong trust with Egyptian families. Our primary commitment is delivering authentic products, fair prices and direct support.",
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white transition-colors duration-500 font-cairo pt-28">
      {/* Schema.org Organization and Person Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": t.title,
            "description": t.description,
            "mainEntity": {
              "@type": "Person",
              "name": "محمد محمد وهبه (Mohamed Mohamed Wahba)",
              "jobTitle": "Founder and CEO of معرض الشتاء والصيف",
              "nationality": "Egyptian",
              "sameAs": [
                "https://facebook.com",
                "https://linkedin.com"
              ]
            }
          })
        }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider"
        >
          {language === "ar" ? "قصتنا وتأسيسنا" : "Our Heritage"}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tight"
        >
          {t.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-black text-sm md:text-base tracking-widest uppercase"
        >
          {t.subtitle}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-lg text-gray-500 font-bold leading-relaxed max-w-2xl mx-auto"
        >
          {t.description}
        </motion.p>
      </section>

      {/* Founder Spotlight */}
      <section className="bg-gray-50 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/5 py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Owner Image mockup card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="relative w-72 h-96 rounded-[3rem] bg-gradient-to-tr from-primary to-secondary p-1 overflow-hidden shadow-2xl group"
              >
                <div className="w-full h-full bg-white dark:bg-[#0A0A0A] rounded-[2.8rem] flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-2 border-primary/20">
                    MW
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">محمد وهبه</h3>
                    <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">Founder & CEO</p>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                    "نلتزم بتقديم الجودة وتسهيل معيشة الأسر المصرية بأحدث تقنيات الأجهزة المنزلية."
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Owner text bio */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t.founderTitle}</span>
              <h2 className="text-3xl font-black">{t.founderName}</h2>
              <p className="text-gray-500 dark:text-gray-300 font-bold leading-relaxed text-sm md:text-base">
                {t.founderBio}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                {[
                  { label: language === "ar" ? "تأسيس موثوق" : "Reliable Foundation", icon: <FiAward className="text-primary text-lg" /> },
                  { label: language === "ar" ? "دعم مستمر" : "Continuous Support", icon: <FiUsers className="text-secondary text-lg" /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission grid */}
      <section className="container mx-auto px-4 md:px-8 py-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl">
              <FiHeart />
            </div>
            <h3 className="text-2xl font-black text-primary">{t.vision}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">{t.visionText}</p>
          </div>
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-4 hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center text-xl">
              <FiTrendingUp />
            </div>
            <h3 className="text-2xl font-black text-secondary">{t.mission}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed">{t.missionText}</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
