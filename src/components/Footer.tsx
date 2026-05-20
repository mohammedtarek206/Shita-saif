"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 border-t border-white/5 relative overflow-hidden font-cairo">
      {/* Background radial soft lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/Logo-removebg-preview.png" 
                  alt="Logo" 
                  className="w-16 h-16 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                    SHETA-SAIF
                  </span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                    {language === "ar" ? "للأجهزة الكهربية المنزلية" : "Premium Appliances"}
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
              {language === "ar" 
                ? "وجهتكم الأولى لأفضل الأجهزة المنزلية والكهربائية. جودة، ثقة، وخدمة متميزة تليق بكم."
                : "Your first destination for the best home appliances. Quality, trust, and premium service."}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: FiFacebook, href: "https://facebook.com" },
                { Icon: FiTwitter, href: "https://twitter.com" },
                { Icon: FiInstagram, href: "https://instagram.com" },
                { Icon: FiYoutube, href: "https://youtube.com" }
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110 active:scale-95">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-6">
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-primary">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: language === "ar" ? "كل المنتجات" : "All Products", href: "/products" },
                { name: language === "ar" ? "العروض الخاصة" : "Special Offers", href: "/offers" },
                { name: language === "ar" ? "المدونة الرسمية" : "Official Blog", href: "/blog" },
                { name: language === "ar" ? "من نحن" : "About Us", href: "/about" },
                { name: language === "ar" ? "تواصل معنا" : "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-white transition-colors font-bold text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-primary">{language === "ar" ? "الأقسام" : "Categories"}</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: language === "ar" ? "التكييفات" : "Air Conditioners", href: "/products?search=تكييف" },
                { name: language === "ar" ? "الغسالات" : "Washing Machines", href: "/products?search=غسال" },
                { name: language === "ar" ? "الثلاجات" : "Refrigerators", href: "/products?search=ثلاج" },
                { name: language === "ar" ? "أجهزة المطبخ" : "Kitchen Appliances", href: "/products?search=مطبخ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-white transition-colors font-bold text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-primary">{language === "ar" ? "اتصل بنا" : "Contact Info"}</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <FiPhone />
                </div>
                <a href="tel:01223366046" className="block mt-1">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</p>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">01223366046</p>
                </a>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <FiMail />
                </div>
                <a href="mailto:whaba78@gmail.com" className="block mt-1">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">whaba78@gmail.com</p>
                </a>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <FiMapPin />
                </div>
                <a href="https://maps.google.com/?q=تزمنت+الشرقية+بني+سويف+مصر" target="_blank" rel="noopener noreferrer" className="block mt-1">
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'الموقع' : 'Location'}</p>
                  <p className="text-sm font-bold leading-relaxed group-hover:text-primary transition-colors">
                    {language === "ar" ? "تزمنت الشرقية، بني سويف، مصر" : "Tazmant Al-Sharqiya, Beni Suef, Egypt"}
                  </p>
                </a>
              </li>
            </ul>
          </div>

          {/* Developer Info Card */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-secondary">{language === "ar" ? "المطور التقني" : "Technical Developer"}</h4>
            <div className="relative overflow-hidden p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-secondary/30 transition-all duration-500 shadow-2xl hover:shadow-secondary/5 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                {language === "ar" ? "تصميم وتطوير بواسطة:" : "Designed & Developed By:"}
              </p>
              <h5 className="text-sm font-black text-white hover:text-secondary transition-colors duration-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shrink-0" />
                {language === "ar" ? "م. محمد طارق" : "Eng. Mohamed Tarek"}
              </h5>
              
              <div className="mt-4 flex flex-col gap-3">
                <a href="tel:01284621015" className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors font-bold">
                  <span className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-xs">
                    📞
                  </span>
                  <span>01284621015</span>
                </a>
                <a href="https://wa.me/201284621015" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-xs text-gray-400 hover:text-white transition-colors font-bold">
                  <span className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-xs font-bold">
                    wa
                  </span>
                  <span>{language === "ar" ? "واتساب المطور" : "WhatsApp Chat"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase text-center lg:text-left">
              © {new Date().getFullYear()} {language === "ar" ? "الشتاء والصيف. جميع الحقوق محفوظة لـ محمد محمد وهبه (Mohamed Wahba)." : "Winter & Summer. All rights reserved to Mohamed Mohamed Wahba."}
            </p>
            <div className="inline-flex items-center flex-wrap justify-center gap-2 text-[11px] font-black text-gray-500">
              <span>{language === "ar" ? "تصميم وتطوير بواسطة" : "Designed & Developed by"}</span>
              <a href="https://wa.me/201284621015" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-primary/50 text-white rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(var(--primary),0.1)] hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:-translate-y-0.5 group">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                <span className="tracking-widest">Mohammed Tarek</span>
                <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary transition-colors" />
                <span className="font-mono text-primary group-hover:text-white transition-colors">01284621015</span>
              </a>
            </div>
          </div>
          <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
