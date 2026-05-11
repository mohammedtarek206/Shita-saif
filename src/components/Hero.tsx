"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: { ar: "مطبخك العصري بلمسة واحدة", en: "Your Modern Kitchen in One Touch" },
    subtitle: { ar: "تشكيلة واسعة من أفران الطبخ والثلاجات الفاخرة", en: "Wide range of premium cooking ovens and refrigerators" },
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    color: "from-purple-600/20 to-transparent"
  },
  {
    id: 2,
    title: { ar: "ذكاء الغسيل المطور", en: "Advanced Smart Laundry" },
    subtitle: { ar: "أحدث الغسالات والمنشفات بتقنيات ذكاء اصطناعي", en: "Latest washers and dryers with AI technologies" },
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop",
    color: "from-blue-600/20 to-transparent"
  },
  {
    id: 3,
    title: { ar: "انتعاش الصيف يبدأ من هنا", en: "Summer Freshness Starts Here" },
    subtitle: { ar: "أقوى أنظمة التكييف والتحكم بالمناخ المنزلي", en: "Powerful AC systems and home climate control" },
    image: "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=2070&auto=format&fit=crop",
    color: "from-pink-600/20 to-transparent"
  }
];

const Hero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative h-[85vh] min-h-[650px] w-full overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* Background Image */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ${isActive ? 'scale-110' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent ${slide.color}`} />
                </div>

                {/* Content Overlay */}
                <div className={`container mx-auto px-4 h-full flex flex-col justify-center relative z-20 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${language === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className="max-w-3xl">
                    <span className="inline-block px-5 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-bold mb-8 backdrop-blur-sm">
                      {language === "ar" ? "وصل حديثاً 2024" : "New Arrival 2024"}
                    </span>
                    <h1 className="text-3xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] drop-shadow-2xl">
                      {language === "ar" ? slide.title.ar : slide.title.en}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-xl leading-relaxed drop-shadow-lg">
                      {language === "ar" ? slide.subtitle.ar : slide.subtitle.en}
                    </p>
                    <div className="flex flex-wrap gap-5">
                      <Link 
                        href="/products"
                        className="px-10 py-5 bg-primary text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center text-lg z-30"
                      >
                        {language === "ar" ? "تسوق الآن" : "Shop Now"}
                      </Link>
                      <Link 
                        href="/offers"
                        className="px-10 py-5 bg-white/10 text-white rounded-2xl font-bold backdrop-blur-xl hover:bg-white/20 transition-all border border-white/20 text-lg flex items-center justify-center z-30"
                      >
                        {language === "ar" ? "مشاهدة العروض" : "View Offers"}
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Floating Decoration */}
                <div className={`absolute bottom-24 right-24 hidden xl:block transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <motion.div
                    animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-40 h-40 rounded-[2.5rem] glass flex items-center justify-center p-8 border-white/20 shadow-2xl"
                  >
                    <div className="text-center">
                      <div className="text-4xl font-black text-white">50%</div>
                      <div className="text-xs text-gray-400 uppercase font-bold tracking-tighter mt-1">{language === "ar" ? "خصم حصري" : "Exclusive Discount"}</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;


