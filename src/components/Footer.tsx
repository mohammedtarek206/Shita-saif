"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-4">
              <img 
                src="/Logo-removebg-preview.png" 
                alt="Logo" 
                className="w-32 h-32 object-contain"
              />
              {language === "ar" ? (
                <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#E91E63] to-[#1E4FA3] bg-clip-text text-transparent">
                  الشتاء والصيف
                </span>
              ) : (
                <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#E91E63] to-[#1E4FA3] bg-clip-text text-transparent">
                  SHETA - & - SAIF
                </span>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {language === "ar" 
                ? "وجهتكم الأولى لأفضل الأجهزة المنزلية والكهربائية في المنطقة. جودة، ثقة، وخدمة متميزة."
                : "Your first destination for the best home and electrical appliances in the region. Quality, trust, and excellent service."}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <FiYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{language === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "كل المنتجات" : "All Products"}</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "العروض الخاصة" : "Special Offers"}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "من نحن" : "About Us"}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "تواصل معنا" : "Contact Us"}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6">{language === "ar" ? "الأقسام" : "Categories"}</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/category/air-conditioners" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "التكييفات" : "Air Conditioners"}</Link></li>
              <li><Link href="/category/washers" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "الغسالات" : "Washing Machines"}</Link></li>
              <li><Link href="/category/refrigerators" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "الثلاجات" : "Refrigerators"}</Link></li>
              <li><Link href="/category/kitchen" className="text-gray-400 hover:text-white transition-colors">{language === "ar" ? "أجهزة المطبخ" : "Kitchen Appliances"}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">{language === "ar" ? "اتصل بنا" : "Contact Info"}</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-primary" />
                <span>01223366046</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-primary" />
                <span>whaba78@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="text-primary" />
                <span>{language === "ar" ? "المدخل الاول تزمنت الشرقية بني سويف , Egypt" : "The first entrance, Tazmant Al-Sharqiya, Beni Suef, Egypt"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {language === "ar" ? "الشتاء والصيف. جميع الحقوق محفوظة." : "Winter & Summer. All rights reserved."}
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
