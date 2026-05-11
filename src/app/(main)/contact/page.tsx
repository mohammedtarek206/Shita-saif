"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4">{language === "ar" ? "تواصل معنا" : "Contact Us"}</h1>
          <p className="text-gray-500 text-xl">{language === "ar" ? "نحن هنا لمساعدتك في أي وقت" : "We are here to help you anytime"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
                  <FiPhone />
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase font-bold">{language === "ar" ? "رقم الهاتف" : "Phone"}</div>
                  <div className="font-bold">01223366046</div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-3xl border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-xl">
                  <FiMail />
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase font-bold">{language === "ar" ? "البريد الإلكتروني" : "Email"}</div>
                  <div className="font-bold">whaba78@gmail.com</div>
                </div>
              </div>
            </div>
            <div className="glass p-8 rounded-3xl border-white/20">
              <a 
                href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.bing.com%2Fmaps%2Fdefault.aspx%3Fv%3D2%26pc%3DFACEBK%26mid%3D8100%26where1%3D%25D8%25A7%25D9%2584%25D9%2585%25D8%25AF%25D8%25AE%25D9%2584%2520%25D8%25A7%25D9%2584%25D8%25A7%25D9%2588%25D9%2584%2520%25D8%25AA%25D8%25B2%25D9%2585%25D9%2586%25D8%25AA%2520%25D8%25A7%25D9%2584%25D8%25B4%25D8%25B1%25D9%2582%25D9%258A%25D8%25A9%2520%25D8%25A8%25D9%2586%25D9%258A%2520%25D8%25B3%25D9%2588%25D9%258A%25D9%2581%2520%252C%2520Beni%2520Suef%252C%2520Egypt%26FORM%3DFBKPL1%26mkt%3Den-US%26fbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExQWQyS2hha0RUeU8yZDd5M3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6xudkSkOUI8yfeGWPALzIHuP9txhS8617sq2WPDsR3Q4UIA1PJPisJmMzciw_aem_yvpL7smS9zZa5ZKX3GQNlA&h=AUA-7j8I3cgJrEMg7Hx_64yXlIopUBcRwlKYw4CpRR9cmB74C2VxBPlssvHQankrMfujn9svM8VTFW7HrATPuz9m6GxZgTy3WqaJpKIGPBG-CKwSZg12R97X4qSR5_AKyPjx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-xl">
                  <FiMapPin />
                </div>
                <div>
                  <div className="text-sm text-gray-500 uppercase font-bold">{language === "ar" ? "الموقع" : "Location"}</div>
                  <div className="font-bold">{language === "ar" ? "المدخل الاول تزمنت الشرقية بني سويف , Egypt" : "The first entrance, Tazmant Al-Sharqiya, Beni Suef, Egypt"}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass p-10 rounded-[3rem] border-white/20">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder={language === "ar" ? "الاسم" : "Name"} className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none focus:border-primary border border-transparent" />
                  <input type="email" placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none focus:border-primary border border-transparent" />
                </div>
                <input type="text" placeholder={language === "ar" ? "الموضوع" : "Subject"} className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none focus:border-primary border border-transparent" />
                <textarea rows={5} placeholder={language === "ar" ? "رسالتك" : "Message"} className="w-full px-6 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none focus:border-primary border border-transparent resize-none"></textarea>
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                  <FiSend /> {language === "ar" ? "إرسال الرسالة" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
