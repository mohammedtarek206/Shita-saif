"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { FiZap, FiShield, FiTruck, FiSmile, FiExternalLink } from "react-icons/fi";
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
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-dark/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-6 glass rounded-2xl hover:translate-y-[-5px] transition-transform">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{language === "ar" ? feature.titleAr : feature.titleEn}</h3>
                  <p className="text-gray-500 text-sm">{language === "ar" ? feature.descAr : feature.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">{t.featuredProducts}</h2>
              <p className="text-gray-500">{t.bestAppliances}</p>
            </div>
            <Link href="/products" className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
              {t.viewAll}
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-[400px] bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-gray-200">
                  <p className="text-gray-500 font-bold">No products found. Start adding products from admin panel.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark/50 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-2">{t.ourPartners}</h2>
          <p className="text-gray-500">{t.trustedBrands}</p>
        </div>
        <div className="flex overflow-hidden group">
          <div className="flex space-x-12 animate-scroll group-hover:pause">
            {partners.length > 0 ? (
              [...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex-shrink-0 w-48 h-24 glass rounded-2xl p-6 flex items-center justify-center border-white/20 grayscale hover:grayscale-0 transition-all">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 opacity-50">
                {language === "ar" ? "سيتم إضافة الشركاء قريباً" : "Partners coming soon"}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-20 gradient-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {statsData.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl backdrop-blur-md">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black">{stat.value}</div>
                <div className="text-sm font-medium uppercase tracking-widest text-white/80">{language === "ar" ? stat.labelAr : stat.labelEn}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="glass p-12 rounded-[3rem] text-center max-w-4xl mx-auto border-white/20">
            <h2 className="text-3xl md:text-5xl font-black mb-6">{t.newsletterTitle}</h2>
            <p className="text-gray-500 mb-10 text-lg">{t.newsletterDesc}</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                placeholder={t.emailPlaceholder}
                className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary px-6 py-4 rounded-2xl outline-none"
              />
              <button className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                {t.subscribe}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


