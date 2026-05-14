"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
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
                    {language === "ar" ? "للأجهزة المنزلية الفاخرة" : "Premium Appliances"}
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
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:scale-110 active:scale-95">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-12">
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-primary">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: language === "ar" ? "كل المنتجات" : "All Products", href: "/products" },
                { name: language === "ar" ? "العروض الخاصة" : "Special Offers", href: "/offers" },
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
                { name: language === "ar" ? "التكييفات" : "Air Conditioners", href: "/category/air-conditioners" },
                { name: language === "ar" ? "الغسالات" : "Washing Machines", href: "/category/washers" },
                { name: language === "ar" ? "الثلاجات" : "Refrigerators", href: "/category/refrigerators" },
                { name: language === "ar" ? "أجهزة المطبخ" : "Kitchen Appliances", href: "/category/kitchen" },
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
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</p>
                  <p className="text-sm font-bold">01223366046</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiMail />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                  <p className="text-sm font-bold">whaba78@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-1">{language === 'ar' ? 'الموقع' : 'Location'}</p>
                  <p className="text-sm font-bold leading-relaxed">
                    {language === "ar" ? "تزمنت الشرقية، بني سويف، مصر" : "Tazmant Al-Sharqiya, Beni Suef, Egypt"}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} {language === "ar" ? "الشتاء والصيف. جميع الحقوق محفوظة." : "Winter & Summer. All rights reserved."}
          </p>
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
