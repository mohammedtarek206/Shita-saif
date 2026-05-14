"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { FiZap, FiShield, FiTruck, FiSmile, FiExternalLink, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const { language } = useLanguage();
  const [products, setProducts] = React.useState<any[]>([]);
  const [partners, setPartners] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, partnersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/partners")
        ]);
        
        const productsData = await productsRes.json();
        const partnersData = await partnersRes.json();
        
        if (Array.isArray(productsData)) setProducts(productsData.slice(0, 8));
        if (Array.isArray(partnersData)) setPartners(partnersData);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statsData = [
    { id: 1, labelEn: "Happy Clients", labelAr: "عميل سعيد", value: "200+", icon: <FiSmile /> },
    { id: 2, labelEn: "Products", labelAr: "منتج", value: products.length > 0 ? `${products.length}+` : "0", icon: <FiZap /> },
    { id: 3, labelEn: "Branches", labelAr: "فرع", value: "3", icon: <FiShield /> },
    { id: 4, labelEn: "Years Experience", labelAr: "سنة خبرة", value: "10+", icon: <FiTruck /> },
  ];

  const t = {
    features: language === "ar" ? "مميزاتنا" : "Our Features",
    featuredProducts: language === "ar" ? "المنتجات المميزة" : "Featured Products",
    bestAppliances: language === "ar" ? "أفضل الأجهزة الكهربائية بأسعار حصرية" : "Best appliances at exclusive prices",
    viewAll: language === "ar" ? "مشاهدة الكل" : "View All",
    ourPartners: language === "ar" ? "شركاؤنا" : "Our Partners",
    trustedBrands: language === "ar" ? "أفضل العلامات التجارية العالمية تحت سقف واحد" : "Top global brands under one roof",
    newsletterTitle: language === "ar" ? "انضم إلى قائمتنا البريدية" : "Join Our Newsletter",
    newsletterDesc: language === "ar" ? "احصل على آخر العروض والخصومات الحصرية قبل الجميع" : "Get the latest offers and exclusive discounts before everyone else",
    emailPlaceholder: language === "ar" ? "البريد الإلكتروني الخاص بك" : "Your Email Address",
    subscribe: language === "ar" ? "اشترك الآن" : "Subscribe Now",
  };

  const features = [
    { icon: <FiTruck />, titleAr: "توصيل سريع", titleEn: "Fast Delivery", descAr: "توصيل خلال 24 ساعة", descEn: "Delivery within 24h" },
    { icon: <FiShield />, titleAr: "ضمان معتمد", titleEn: "Certified Warranty", descAr: "ضمان الوكيل المعتمد", descEn: "Official agent warranty" },
    { icon: <FiZap />, titleAr: "تركيب مجاني", titleEn: "Free Installation", descAr: "لأجهزة التكييف والمنزل", descEn: "For ACs & appliances" },
    { icon: <FiSmile />, titleAr: "دعم فني 24/7", titleEn: "24/7 Support", descAr: "فريق متخصص لخدمتكم", descEn: "Dedicated support team" },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex items-center gap-5 p-6 md:p-8 bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-black text-sm md:text-base uppercase tracking-tight italic">
                    {language === "ar" ? feature.titleAr : feature.titleEn}
                  </h3>
                  <p className="text-gray-500 text-xs md:text-sm font-bold mt-1">
                    {language === "ar" ? feature.descAr : feature.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <span className="text-primary font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block italic">Our Curated Collection</span>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter italic uppercase">{t.featuredProducts}</h2>
              <p className="text-gray-500 font-bold mt-4 text-sm md:text-lg max-w-xl">{t.bestAppliances}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Link href="/products" className="group flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all">
                {t.viewAll} <FiArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[3/4] bg-gray-100 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
              {products.length > 0 ? (
                products.map((product, i) => (
                  <motion.div 
                    key={product._id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-24 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 font-black uppercase tracking-widest text-sm italic">Inventory Synchronizing...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Partners Auto-Scroll */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-white/[0.02] overflow-hidden border-y border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">{t.ourPartners}</h2>
          <p className="text-gray-500 font-bold text-xs md:text-base uppercase tracking-widest">{t.trustedBrands}</p>
        </div>
        <div className="flex overflow-hidden group">
          <div className="flex space-x-8 md:space-x-12 animate-scroll group-hover:pause">
            {partners.length > 0 ? (
              [...partners, ...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex-shrink-0 w-40 md:w-56 h-24 md:h-32 bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex items-center justify-center border border-gray-100 dark:border-white/5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all shadow-xl hover:shadow-primary/10">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 font-black text-gray-300 uppercase tracking-[0.5em] italic">Strategic Alliances Pending</div>
            )}
          </div>
        </div>
      </section>

      {/* Global Stats with Parallax feel */}
      <section className="py-20 md:py-32 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 text-center">
            {statsData.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                key={stat.id} className="space-y-4"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-[2rem] bg-white/20 border border-white/20 flex items-center justify-center text-3xl md:text-5xl mx-auto backdrop-blur-md shadow-2xl">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-7xl font-black tracking-tighter italic">{stat.value}</div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-80">{language === "ar" ? stat.labelAr : stat.labelEn}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Newsletter */}
      <section className="py-24 md:py-48 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white dark:bg-white/2 backdrop-blur-3xl p-10 md:p-24 rounded-[4rem] text-center max-w-5xl mx-auto border border-gray-100 dark:border-white/10 shadow-2xl relative"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl rotate-12">
              <FiMail />
            </div>
            <h2 className="text-3xl md:text-7xl font-black mb-8 italic uppercase tracking-tighter leading-tight mt-6">{t.newsletterTitle}</h2>
            <p className="text-gray-500 font-bold mb-14 text-sm md:text-xl max-w-2xl mx-auto opacity-80 leading-relaxed">{t.newsletterDesc}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
              <input 
                type="email" 
                placeholder={t.emailPlaceholder}
                className="flex-1 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary px-8 py-5 md:py-6 rounded-[2rem] outline-none font-bold shadow-inner"
              />
              <button className="px-12 py-5 md:py-6 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-[2rem] shadow-[0_20px_50px_rgba(233,30,99,0.3)] hover:scale-105 active:scale-95 transition-all italic">
                {t.subscribe}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


