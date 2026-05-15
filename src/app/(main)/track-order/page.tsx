"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCalendar, FiCreditCard, FiArrowRight, FiInfo } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";

function TrackOrderContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialPhone = searchParams?.get("phone") || "";
  
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTracking = async (searchPhone: string, isPolling = false) => {
    if (!isPolling) setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/track?phone=${encodeURIComponent(searchPhone.trim())}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();

      if (data.error) {
        if (!isPolling) setError(language === "ar" ? "تعذر العثور على طلب مسجل بهذا الرقم." : "No orders found for this phone number.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      if (!isPolling) setError(language === "ar" ? "حدث خطأ أثناء البحث." : "Error occurred during search.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(phone);
  };

  useEffect(() => {
    if (initialPhone) {
      fetchTracking(initialPhone);
    }
  }, [initialPhone]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (order && !["delivered", "cancelled"].includes(order.status)) {
      // Poll every 30 seconds for live updates
      interval = setInterval(() => {
        fetchTracking(order.shippingAddress.phone, true);
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [order]);

  const t = {
    title: language === "ar" ? "تتبع طلبك" : "Track Your Order",
    subtitle: language === "ar" ? "تابع حالة شحنتك لحظة بلحظة برقم الهاتف" : "Follow your shipment status in real-time by phone",
    contactLabel: language === "ar" ? "رقم الهاتف المسجل بالطلب" : "Phone Number",
    btn: language === "ar" ? "تتبع الآن" : "Track Now",
    details: language === "ar" ? "تفاصيل الطلب" : "Order Details",
    status: language === "ar" ? "الحالة الحالية" : "Current Status",
    expected: language === "ar" ? "التوصيل المتوقع" : "Expected Delivery",
    address: language === "ar" ? "عنوان الشحن" : "Shipping Address",
    payment: language === "ar" ? "طريقة الدفع" : "Payment Method",
    products: language === "ar" ? "المنتجات" : "Products",
  };

  const getStatusInfo = (status: string) => {
    const statuses: any = {
      pending: { color: "bg-yellow-500", icon: <FiClock />, text: { ar: "قيد الانتظار", en: "Pending" }, step: 1 },
      confirmed: { color: "bg-blue-500", icon: <FiCheckCircle />, text: { ar: "تم التأكيد", en: "Confirmed" }, step: 2 },
      preparing: { color: "bg-indigo-500", icon: <FiPackage />, text: { ar: "جاري التجهيز", en: "Preparing" }, step: 3 },
      processing: { color: "bg-purple-500", icon: <FiPackage />, text: { ar: "قيد المعالجة", en: "Processing" }, step: 4 },
      shipped: { color: "bg-orange-500", icon: <FiTruck />, text: { ar: "تم الشحن", en: "Shipped" }, step: 5 },
      out_for_delivery: { color: "bg-cyan-500", icon: <FiTruck />, text: { ar: "مع المندوب", en: "Out for Delivery" }, step: 6 },
      delivered: { color: "bg-green-500", icon: <FiCheckCircle />, text: { ar: "تم التوصيل", en: "Delivered" }, step: 7 },
      cancelled: { color: "bg-rose-500", icon: <FiInfo />, text: { ar: "ملغي", en: "Cancelled" }, step: 0 },
    };
    return statuses[status] || statuses.pending;
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6"
            >
              <FiTruck className="animate-bounce" /> {language === "ar" ? "نظام تتبع برقم الهاتف" : "Phone Number Tracking"}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-tight"
            >
              {t.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-gray-500 dark:text-gray-400 text-lg font-bold"
            >
              {t.subtitle}
            </motion.p>
          </div>

          {/* Search Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-white/[0.03] rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl backdrop-blur-3xl mb-12 max-w-3xl mx-auto"
          >
            <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6 items-end">
              <div className="space-y-3 flex-1 w-full">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">{t.contactLabel}</label>
                <div className="relative group">
                  <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-14 py-4 font-bold outline-none transition-all"
                    placeholder="01234567890"
                  />
                </div>
              </div>
              <button 
                disabled={loading}
                className="w-full md:w-48 h-[60px] bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiSearch /> {t.btn}</>}
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold text-sm text-center border border-rose-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tracking Result */}
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Status Timeline */}
                <div className="bg-white dark:bg-white/[0.03] rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{t.details} #{order.orderNumber}</h2>
                      <p className="text-gray-400 font-bold flex items-center gap-2">
                        <FiCalendar /> {new Date(order.createdAt).toLocaleDateString(language === "ar" ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                    <div className={cn(
                      "px-8 py-4 rounded-3xl flex items-center gap-4 shadow-xl",
                      getStatusInfo(order.status).color, "text-white"
                    )}>
                      <span className="text-2xl">{getStatusInfo(order.status).icon}</span>
                      <span className="font-black uppercase tracking-widest text-sm">
                        {language === "ar" ? getStatusInfo(order.status).text.ar : getStatusInfo(order.status).text.en}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar / Stepper */}
                  <div className="relative pb-12">
                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 dark:bg-white/10" />
                    <div 
                      className="absolute top-6 left-0 h-1 bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${(getStatusInfo(order.status).step / 7) * 100}%` }}
                    />
                    
                    <div className="relative flex justify-between">
                      {["pending", "confirmed", "preparing", "shipped", "delivered"].map((stepStatus, i) => {
                        const stepInfo = getStatusInfo(stepStatus);
                        const isActive = getStatusInfo(order.status).step >= stepInfo.step;
                        return (
                          <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
                              isActive ? "bg-primary text-white scale-110" : "bg-gray-100 dark:bg-white/10 text-gray-400"
                            )}>
                              {stepInfo.icon}
                            </div>
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest text-center hidden md:block",
                              isActive ? "text-primary" : "text-gray-400"
                            )}>
                              {language === "ar" ? stepInfo.text.ar : stepInfo.text.en}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Shipping Info */}
                  <div className="lg:col-span-2 bg-white dark:bg-white/[0.03] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                          <FiMapPin className="text-xl" />
                          <h3 className="font-black uppercase tracking-widest text-xs italic">{t.address}</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-black">{order.shippingAddress.name}</p>
                          <p className="text-gray-500 font-bold">{order.shippingAddress.address}</p>
                          <p className="text-gray-500 font-bold">{order.shippingAddress.city}</p>
                          <p className="text-primary font-black">{order.shippingAddress.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                          <FiClock className="text-xl" />
                          <h3 className="font-black uppercase tracking-widest text-xs italic">{t.expected}</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-black italic text-primary">
                            {order.estimatedDelivery || (language === "ar" ? "سيتم التحديث قريباً" : "Updating soon")}
                          </p>
                          {order.deliveryNotes && (
                            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                              <p className="text-xs text-primary font-bold italic">{order.deliveryNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8">
                        <FiCreditCard className="text-xl" />
                        <h3 className="font-black uppercase tracking-widest text-xs italic">{t.payment}</h3>
                      </div>
                      <div className="space-y-6 flex-1">
                        <p className="text-4xl font-black italic uppercase tracking-tighter">{order.paymentMethod}</p>
                        <div className="px-4 py-2 bg-white/10 rounded-full inline-block font-black text-[10px] uppercase tracking-[0.2em]">
                          {order.paymentStatus}
                        </div>
                      </div>
                      <div className="pt-8 border-t border-white/10">
                        <p className="text-xs font-bold opacity-60 uppercase mb-1">Total Amount</p>
                        <p className="text-4xl font-black italic">{order.totalPrice.toLocaleString()} <span className="text-lg">EGP</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="bg-white dark:bg-white/[0.03] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">{t.products}</h3>
                  <div className="space-y-6">
                    {order.products.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all">
                        <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center p-2 shadow-lg">
                          <img src={item.product?.images?.[0] || item.image} alt="Product" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-lg truncate">{language === "ar" ? (item.product?.title?.ar || item.title?.ar) : (item.product?.title?.en || item.title?.en)}</p>
                          <p className="text-gray-500 font-bold text-sm">Qty: {item.quantity} × {item.price.toLocaleString()} EGP</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-primary">{(item.quantity * item.price).toLocaleString()} <span className="text-[10px]">EGP</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </React.Suspense>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
