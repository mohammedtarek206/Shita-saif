"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0A0A0A] pb-8 pt-16 font-cairo text-white">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <img src="/Logo-removebg-preview.png" alt="Logo" className="h-14 w-14 object-contain" />
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-bold uppercase tracking-tight text-transparent">
                  SHETA-SAIF
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                  {isAr ? "للأجهزة الكهربائية المنزلية" : "Premium Appliances"}
                </span>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              {isAr
                ? "وجهتكم الأولى لأفضل الأجهزة الكهربائية المنزلية. جودة، ثقة، وخدمة متميزة تليق بكم."
                : "Your first destination for premium home appliances. Quality, trust, and excellent service."}
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: FiFacebook, href: "https://facebook.com" },
                { Icon: FiTwitter, href: "https://twitter.com" },
                { Icon: FiInstagram, href: "https://instagram.com" },
                { Icon: FiYoutube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={`item-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-primary"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              {isAr ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: isAr ? "كل المنتجات" : "All Products", href: "/products" },
                { name: isAr ? "العروض الخاصة" : "Special Offers", href: "/offers" },
                { name: isAr ? "المدونة" : "Blog", href: "/blog" },
                { name: isAr ? "من نحن" : "About Us", href: "/about" },
                { name: isAr ? "تواصل معنا" : "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-gray-500 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              {isAr ? "الأقسام" : "Categories"}
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: isAr ? "التكييفات" : "Air Conditioners", href: "/products?search=تكييف" },
                { name: isAr ? "الغسالات" : "Washing Machines", href: "/products?search=غسال" },
                { name: isAr ? "الثلاجات" : "Refrigerators", href: "/products?search=ثلاج" },
                { name: isAr ? "أجهزة المطبخ" : "Kitchen Appliances", href: "/products?search=مطبخ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-gray-500 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">
              {isAr ? "اتصل بنا" : "Contact"}
            </h4>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="tel:01223366046" className="flex items-start gap-3 group">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiPhone />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase text-gray-500">{isAr ? "الهاتف" : "Phone"}</span>
                    <span className="text-sm font-semibold group-hover:text-primary">01223366046</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="mailto:whaba78@gmail.com" className="flex items-start gap-3 group">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiMail />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase text-gray-500">{isAr ? "البريد" : "Email"}</span>
                    <span className="text-sm font-semibold group-hover:text-primary">whaba78@gmail.com</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=تزمنت+الشرقية+بني+سويف+مصر"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FiMapPin />
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase text-gray-500">{isAr ? "الموقع" : "Location"}</span>
                    <span className="text-sm font-semibold leading-snug group-hover:text-primary">
                      {isAr ? "تزمنت الشرقية، بني سويف" : "Tazmant Al-Sharqiya, Beni Suef"}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-center text-xs font-medium text-gray-500 sm:text-start">
            © {new Date().getFullYear()}{" "}
            {isAr
              ? "معرض الشتاء والصيف. جميع الحقوق محفوظة."
              : "Winter & Summer Exhibition. All rights reserved."}
          </p>
          <div className="flex items-center gap-6 opacity-50 grayscale transition-opacity hover:opacity-80">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3.5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3.5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
