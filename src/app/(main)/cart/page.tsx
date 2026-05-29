"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag, FiCheck, FiX } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { language } = useLanguage();
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<null | { discount: number; type: string; value: number }>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const finalTotal = couponState ? Math.max(0, totalPrice - couponState.discount) : totalPrice;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setCouponState(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderTotal: totalPrice }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponState(data);
      } else {
        const msgs: Record<string, string> = {
          invalid: language === "ar" ? "الكود غير صحيح" : "Invalid code",
          expired: language === "ar" ? "الكود منتهي الصلاحية" : "Code expired",
          maxed: language === "ar" ? "تم استنفاد الكود" : "Code limit reached",
          min_order: language === "ar" ? `الحد الأدنى للطلب: ${data.minOrder} ج.م` : `Minimum order: ${data.minOrder} EGP`,
        };
        setCouponError(msgs[data.error] || (language === "ar" ? "حدث خطأ" : "An error occurred"));
      }
    } catch {
      setCouponError(language === "ar" ? "خطأ في الاتصال" : "Connection error");
    } finally {
      setCouponLoading(false);
    }
  };

  const t = {
    title: language === "ar" ? "سلة التسوق" : "Shopping Cart",
    empty: language === "ar" ? "سلة التسوق فارغة حالياً" : "Your cart is currently empty",
    shopNow: language === "ar" ? "تسوق الآن" : "Shop Now",
    summary: language === "ar" ? "ملخص الطلب" : "Order Summary",
    subtotal: language === "ar" ? "المجموع الفرعي" : "Subtotal",
    shipping: language === "ar" ? "الشحن" : "Shipping",
    free: language === "ar" ? "مجاني" : "Free",
    total: language === "ar" ? "الإجمالي" : "Total",
    checkout: language === "ar" ? "إتمام الشراء" : "Proceed to Checkout",
    items: language === "ar" ? "منتجات" : "items",
    promoCode: language === "ar" ? "كود الخصم" : "Promo Code",
    apply: language === "ar" ? "تطبيق" : "Apply",
    continue: language === "ar" ? "متابعة التسوق" : "Continue Shopping",
    discount: language === "ar" ? "خصم الكوبون" : "Coupon Discount",
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen pt-28">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl text-gray-400">
            <FiShoppingBag />
          </div>
          <h1 className="text-3xl font-black mb-6">{t.empty}</h1>
          <Link href="/products" className="inline-block px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            {t.shopNow}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 md:pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12">
          {t.title} <span className="text-primary text-lg md:text-2xl ml-2">({totalItems} {t.items})</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cart.map((item) => {
              const itemPrice = item.discount ? item.price - (item.price * item.discount / 100) : item.price;
              return (
                <div key={(item as any)?._id || (item as any)?.id || (item as any)?.slug || (item as any)?.name || (item as any)?.title?.en || (item as any)?.title?.ar || JSON.stringify(item).substring(0, 20)} className="glass p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-white/20 flex flex-col md:flex-row items-center gap-4 md:gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-white/5 rounded-2xl md:rounded-3xl p-4 flex-shrink-0 flex items-center justify-center">
                    <img src={item.images[0]} alt={language === "ar" ? item.title.ar : item.title.en} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2 text-center md:text-start">
                    <h3 className="text-lg md:text-xl font-black line-clamp-1">{language === "ar" ? item.title.ar : item.title.en}</h3>
                    <div className="text-primary font-black text-base md:text-lg">
                      {itemPrice.toLocaleString()} {language === "ar" ? "ج.م" : "EGP"}
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                      <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors"><FiMinus /></button>
                        <span className="font-black text-sm md:text-base w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors"><FiPlus /></button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xl md:text-2xl font-black text-gray-800 dark:text-white border-t md:border-t-0 md:border-r md:rtl:border-l border-gray-100 dark:border-white/10 pt-4 md:pt-0 md:px-8 w-full md:w-auto text-center md:text-end">
                    {(itemPrice * item.quantity).toLocaleString()} <span className="text-xs md:text-sm font-bold opacity-50">{language === "ar" ? "ج.م" : "EGP"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/20 sticky top-24 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-black mb-8">{t.summary}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-bold">
                  <span>{t.subtotal}</span>
                  <span>{totalPrice.toLocaleString()} {language === "ar" ? "ج.م" : "EGP"}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold">
                  <span>{t.shipping}</span>
                  <span className="text-green-500 font-black">{t.free}</span>
                </div>
                <AnimatePresence>
                  {couponState && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-between text-green-600 font-bold">
                      <span className="flex items-center gap-1"><FiTag /> {t.discount}</span>
                      <span className="font-black">-{couponState.discount.toLocaleString()} {language === "ar" ? "ج.م" : "EGP"}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-black">{t.total}</span>
                  <div className="text-3xl font-black text-primary">
                    {finalTotal.toLocaleString()} <span className="text-sm">{language === "ar" ? "ج.م" : "EGP"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Coupon input */}
                {!couponState ? (
                  <div className="space-y-2">
                    <div className="relative group">
                      <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder={t.promoCode}
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                        className={cn(
                          "w-full py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white uppercase tracking-widest text-sm",
                          language === "ar" ? "pl-24 pr-12" : "pr-24 pl-12"
                        )}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className={cn(
                          "absolute top-2 bottom-2 px-5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-black transition-all hover:scale-105 disabled:opacity-50",
                          language === "ar" ? "left-2" : "right-2"
                        )}
                      >
                        {couponLoading
                          ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          : t.apply
                        }
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-xs font-bold flex items-center gap-1"><FiX /> {couponError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-5 py-3.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                    <span className="flex items-center gap-2 text-green-700 dark:text-green-400 font-black text-sm"><FiCheck /> {couponCode}</span>
                    <button onClick={() => { setCouponState(null); setCouponCode(""); }} className="text-gray-400 hover:text-red-500 transition-colors"><FiX /></button>
                  </div>
                )}

                <Link href="/checkout" className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg">
                  {t.checkout}
                  <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                </Link>
                
                <Link href="/products" className="block w-full py-4 text-center text-gray-500 font-black hover:text-primary transition-colors text-sm uppercase tracking-widest">
                  {t.continue}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
