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
    title: { ar: "مطبخك العصري بلمسة واحدة", en: "Your Modern Kitchen" },
    subtitle: { ar: "تشكيلة واسعة من أفران الطبخ والثلاجات الفاخرة", en: "Wide range of premium cooking ovens and refrigerators" },
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    color: "from-purple-600/20 to-transparent"
  },
  {
    id: 2,
    title: { ar: "ذكاء الغسيل المطور", en: "Smart Laundry" },
    subtitle: { ar: "أحدث الغسالات والمنشفات بتقنيات ذكاء اصطناعي", en: "Latest washers and dryers with AI technologies" },
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=2071&auto=format&fit=crop",
    color: "from-blue-600/20 to-transparent"
  },
  {
    id: 3,
    title: { ar: "انتعاش الصيف يبدأ هنا", en: "Summer Freshness" },
    subtitle: { ar: "أقوى أنظمة التكييف والتحكم بالمناخ المنزلي", en: "Powerful AC systems and home climate control" },
    image: "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=2070&auto=format&fit=crop",
    color: "from-pink-600/20 to-transparent"
  }
];

const Hero = () => {
  const { language } = useLanguage();

  return (
    <section className="relative h-[100svh] md:h-[85vh] min-h-[500px] w-full overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full overflow-hidden">
                {/* Background Image with Ken Burns effect */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent ${slide.color}`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content Overlay */}
                <div className={cn(
                  "container mx-auto px-4 h-full flex flex-col justify-center relative z-20 transition-all duration-1000",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
                  language === 'ar' ? 'items-end text-right' : 'items-start text-left'
                )}>
                  <div className="max-w-3xl w-full">
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={isActive ? { opacity: 1, x: 0 } : {}}
                      className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs md:text-sm font-black mb-4 md:mb-8 backdrop-blur-md"
                    >
                      {language === "ar" ? "حصرياً في معرضنا 2024" : "Exclusive Collection 2024"}
                    </motion.span>
                    
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-8 leading-[1.1] tracking-tighter drop-shadow-2xl">
                      {language === "ar" ? slide.title.ar : slide.title.en}
                    </h1>
                    
                    <p className="text-sm md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 max-w-xl leading-relaxed font-medium drop-shadow-lg">
                      {language === "ar" ? slide.subtitle.ar : slide.subtitle.en}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 md:gap-5">
                      <Link 
                        href="/products"
                        className="px-8 md:px-10 py-4 md:py-5 bg-primary text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center text-sm md:text-lg z-30"
                      >
                        {language === "ar" ? "ابدأ التسوق" : "Start Shopping"}
                      </Link>
                      <Link 
                        href="/offers"
                        className="px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white rounded-2xl font-black backdrop-blur-xl hover:bg-white/20 transition-all border border-white/20 text-sm md:text-lg flex items-center justify-center z-30"
                      >
                        {language === "ar" ? "أفضل العروض" : "Hot Offers"}
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Visual Elements */}
                <div className={`absolute bottom-32 right-12 hidden 2xl:block transition-all duration-1000 delay-500 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                   <div className="w-48 h-48 glass rounded-[3rem] p-8 flex flex-col items-center justify-center border-white/20">
                      <span className="text-4xl font-black text-primary">50%</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter text-center">
                        {language === 'ar' ? 'خصم متاح الآن' : 'Discount Available'}
                      </span>
                   </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default Hero;


