"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const defaultSlides = [
  {
    id: "1",
    titleAr: "مطبخك العصري بلمسة واحدة",
    titleEn: "Your Modern Kitchen",
    subtitleAr: "تشكيلة واسعة من أفران الطبخ والثلاجات الفاخرة",
    subtitleEn: "Wide range of premium cooking ovens and refrigerators",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    link: "/products",
    discount: 50,
  },
  {
    id: "2",
    titleAr: "ذكاء الغسيل المطور",
    titleEn: "Smart Laundry",
    subtitleAr: "أحدث الغسالات والمنشفات بتقنيات ذكاء اصطناعي",
    subtitleEn: "Latest washers and dryers with AI technologies",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1200&auto=format&fit=crop",
    link: "/products",
    discount: 35,
  },
  {
    id: "3",
    titleAr: "انتعاش الصيف يبدأ هنا",
    titleEn: "Summer Freshness",
    subtitleAr: "أقوى أنظمة التكييف والتحكم بالمناخ المنزلي",
    subtitleEn: "Powerful AC systems and home climate control",
    image: "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=1200&auto=format&fit=crop",
    link: "/products",
    discount: 40,
  },
];

const btnBase =
  "inline-flex h-12 min-w-[148px] items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-all duration-300 sm:text-base";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  }),
};

// ─── Mini Image Carousel (inside promo card) ─────────────────────────────────
const promoImages = [
  "/hero-appliances.png",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631542171261-267866385732?q=80&w=900&auto=format&fit=crop",
];

function MiniImageCarousel() {
  const [current, setCurrent] = React.useState(0);
  const [prev, setPrev] = React.useState<number | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % promoImages.length;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
      {/* Previous image fading out */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={promoImages[prev]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ animation: "miniCarouselFadeOut 0.7s ease forwards" }}
        />
      )}
      {/* Current image fading in */}
      <img
        key={`cur-${current}`}
        src={promoImages[current]}
        alt="معرض الشتاء والصيف"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ animation: "miniCarouselFadeIn 0.7s ease forwards" }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {promoImages.map((_, i) => (
          <button
            key={`item-${i}`}
            onClick={() => { setPrev(current); setCurrent(i); }}
            aria-label={`صورة ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

const Hero = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [banners, setBanners] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          if (data.banners?.length > 0) setBanners(data.banners);
        }
      } catch (e) {
        console.error("Error fetching banners:", e);
      }
    };
    fetchBanners();
  }, []);

  const activeSlides = banners.length > 0 ? banners : defaultSlides;

  return (
    <section className="relative w-full overflow-hidden bg-[#0c0f14]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        className="hero-swiper w-full"
        speed={600}
      >
        {activeSlides.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            {({ isActive }) => (
              <div className="relative min-h-[480px] w-full sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px] lg:max-h-[720px]">
                {/* Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0f14]/95 via-[#0c0f14]/75 to-[#1E4FA3]/30" />
                <div
                  className={cn(
                    "absolute inset-0",
                    isAr
                      ? "bg-gradient-to-l from-[#0c0f14]/90 via-transparent to-transparent"
                      : "bg-gradient-to-r from-[#0c0f14]/90 via-transparent to-transparent"
                  )}
                  aria-hidden
                />

                {/* Soft ambient glow — center zone */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] lg:h-80 lg:w-80" />
                  <div className="absolute left-[38%] top-[30%] h-40 w-40 rounded-full bg-secondary/15 blur-[80px] hidden lg:block" />
                  <div className="absolute right-[20%] bottom-[20%] h-32 w-32 rounded-full bg-primary/10 blur-[70px] hidden lg:block" />
                </div>

                {/* 3-zone layout */}
                <div className="relative z-10 mx-auto flex h-full min-h-[480px] w-full max-w-7xl items-center px-4 py-20 sm:px-6 sm:py-24 md:min-h-[560px] md:py-28 lg:min-h-[600px] lg:px-10">
                  <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                    {/* Zone 1 — Content */}
                    <motion.div
                      className="flex flex-col gap-4 sm:gap-6 lg:col-span-5 lg:gap-7"
                      initial="hidden"
                      animate={isActive ? "visible" : "hidden"}
                    >
                      <motion.span
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {isAr ? "حصرياً في معرضنا" : "Exclusive at our store"}
                      </motion.span>

                      <motion.h1
                        variants={fadeUp}
                        custom={0.08}
                        className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                      >
                        {isAr ? slide.titleAr : slide.titleEn}
                      </motion.h1>

                      <motion.p
                        variants={fadeUp}
                        custom={0.16}
                        className="max-w-md text-sm font-medium leading-relaxed text-gray-300 sm:text-base md:text-lg"
                      >
                        {isAr ? slide.subtitleAr : slide.subtitleEn}
                      </motion.p>

                      <motion.div
                        variants={fadeUp}
                        custom={0.24}
                        className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-4"
                      >
                        <Link
                          href={slide.link || "/products"}
                          className={cn(
                            btnBase,
                            "bg-gradient-primary text-white shadow-lg shadow-primary/25 hover:brightness-110 hover:shadow-primary/35 active:scale-[0.98]"
                          )}
                        >
                          {isAr ? "ابدأ التسوق" : "Start Shopping"}
                          <ArrowIcon className={cn(isAr && "rotate-180")} />
                        </Link>
                        <Link
                          href="/offers"
                          className={cn(
                            btnBase,
                            "border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/15 active:scale-[0.98]"
                          )}
                        >
                          {isAr ? "أفضل العروض" : "Hot Offers"}
                        </Link>
                      </motion.div>
                    </motion.div>

                    {/* Zone 2 — Center breathing space (desktop only) */}
                    <div className="relative hidden min-h-[120px] lg:col-span-2 lg:block" aria-hidden>
                      <motion.div
                        animate={isActive ? { opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
                      />
                      <motion.div
                        animate={isActive ? { y: [-6, 6, -6] } : {}}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-1/2 top-[30%] h-3 w-3 -translate-x-1/2 rounded-full bg-primary/60 blur-[1px]"
                      />
                      <motion.div
                        animate={isActive ? { y: [6, -6, 6] } : {}}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-1/2 bottom-[28%] h-2 w-2 -translate-x-1/2 rounded-full bg-secondary/70"
                      />
                    </div>

                    {/* Zone 3 — Promo / product card */}
                    <motion.div
                      className="hidden sm:block lg:col-span-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <div className="mx-auto w-full max-w-sm lg:ms-auto lg:me-0 lg:max-w-md">
                        <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-1.5 shadow-2xl backdrop-blur-xl">
                          <MiniImageCarousel />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

export default Hero;
