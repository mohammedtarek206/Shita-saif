"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { language } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const t = {
    title: language === "ar" ? "تواصل معنا" : "Contact Us",
    subtitle: language === "ar"
      ? "نحن هنا لمساعدتك! أرسل لنا رسالة وسنرد عليك في أقرب وقت"
      : "We're here to help! Send us a message and we'll get back to you shortly",
    namePlaceholder: language === "ar" ? "اسمك الكامل" : "Full Name",
    phonePlaceholder: language === "ar" ? "رقم الهاتف" : "Phone Number",
    emailPlaceholder: language === "ar" ? "البريد الإلكتروني" : "Email Address",
    messagePlaceholder: language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here...",
    send: language === "ar" ? "إرسال الرسالة" : "Send Message",
    sent: language === "ar" ? "تم الإرسال بنجاح!" : "Message Sent!",
    sentDesc: language === "ar" ? "سيتواصل معك فريقنا قريباً" : "Our team will contact you shortly",
    phone: language === "ar" ? "اتصل بنا" : "Call Us",
    email: language === "ar" ? "البريد الإلكتروني" : "Email",
    address: language === "ar" ? "العنوان" : "Address",
    addressValue: language === "ar" ? "القاهرة، مصر" : "Cairo, Egypt",
    whatsapp: language === "ar" ? "واتساب" : "WhatsApp",
    hours: language === "ar" ? "ساعات العمل" : "Working Hours",
    hoursValue: language === "ar" ? "السبت – الخميس: 9ص – 9م" : "Sat – Thu: 9AM – 9PM",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setSending(false);
  };

  const inputCls = "w-full px-6 py-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white transition-all placeholder:text-gray-400 placeholder:font-bold";

  const info = [
    { icon: <FiPhone />, label: t.phone, value: "+20 100 000 0000", href: "tel:+201000000000", color: "bg-blue-500/10 text-blue-500" },
    { icon: <FaWhatsapp />, label: t.whatsapp, value: "+20 100 000 0000", href: "https://wa.me/201000000000", color: "bg-green-500/10 text-green-500" },
    { icon: <FiMail />, label: t.email, value: "info@shetasaif.com", href: "mailto:info@shetasaif.com", color: "bg-primary/10 text-primary" },
    { icon: <FiMapPin />, label: t.address, value: t.addressValue, href: "#", color: "bg-orange-500/10 text-orange-500" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 bg-white dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">{t.title}</h1>
            <p className="text-gray-500 font-bold text-base md:text-lg">{t.subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {info.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white dark:bg-white/[0.03] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl hover:border-primary/30 hover:shadow-primary/5 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <p className="font-black text-sm text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2rem] border border-primary/10"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">{t.hours}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{t.hoursValue}</p>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="h-48 bg-gray-100 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.3!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(50%)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center gap-6 text-center py-20 bg-white dark:bg-white/[0.03] rounded-[3rem] border border-gray-100 dark:border-white/5 p-12"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-5xl"
                >
                  <FiCheck />
                </motion.div>
                <h3 className="text-3xl font-black italic uppercase tracking-tight">{t.sent}</h3>
                <p className="text-gray-500 font-bold">{t.sentDesc}</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", phone: "", email: "", message: "" }); }}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  {language === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-white/[0.03] rounded-[3rem] border border-gray-100 dark:border-white/5 p-8 md:p-12 shadow-2xl space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                      {language === "ar" ? "الاسم" : "Name"}
                    </label>
                    <input
                      type="text"
                      placeholder={t.namePlaceholder}
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                      {language === "ar" ? "الهاتف" : "Phone"}
                    </label>
                    <input
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    {language === "ar" ? "الرسالة" : "Message"}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={t.messagePlaceholder}
                    required
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className={inputCls + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-70"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend className={language === "ar" ? "rotate-180" : ""} />
                      {t.send}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
