"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function CartPage() {
  const { language } = useLanguage();
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

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
    <main className="min-h-screen pt-28">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-12">{t.title} ({totalItems} {t.items})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const itemPrice = item.discount ? item.price - (item.price * item.discount / 100) : item.price;
              return (
                <div key={item._id} className="glass p-6 rounded-[2.5rem] border-white/20 flex flex-col sm:row items-center sm:items-stretch gap-6">
                  <div className="w-32 h-32 bg-white dark:bg-white/5 rounded-3xl p-4 flex-shrink-0">
                    <img src={item.images[0]} alt={language === "ar" ? item.title.ar : item.title.en} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                    <h3 className="text-xl font-bold mb-2">{language === "ar" ? item.title.ar : item.title.en}</h3>
                    <div className="text-primary font-black text-lg mb-4">
                      {itemPrice} {language === "ar" ? "ج.م" : "EGP"}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-4 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-xl">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="hover:text-primary transition-colors"><FiMinus /></button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="hover:text-primary transition-colors"><FiPlus /></button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-dark dark:text-white flex items-center">
                    {itemPrice * item.quantity} {language === "ar" ? "ج.م" : "EGP"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-[2.5rem] border-white/20 sticky top-24">
              <h2 className="text-2xl font-black mb-8">{t.summary}</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>{t.subtotal}</span>
                  <span>{totalPrice} {language === "ar" ? "ج.م" : "EGP"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t.shipping}</span>
                  <span className="text-green-500 font-bold">{t.free}</span>
                </div>
                <div className="h-[1px] bg-foreground/10 my-4" />
                <div className="flex justify-between text-2xl font-black">
                  <span>{t.total}</span>
                  <span className="text-primary">{totalPrice} {language === "ar" ? "ج.م" : "EGP"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={t.promoCode}
                    className={`w-full py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none ${language === "ar" ? "pl-24 pr-6" : "pr-24 pl-6"}`}
                  />
                  <button className={`absolute top-2 bottom-2 px-6 bg-dark dark:bg-white text-white dark:text-dark rounded-xl text-sm font-bold transition-all hover:scale-105 ${language === "ar" ? "left-2" : "right-2"}`}>
                    {t.apply}
                  </button>
                </div>
                <Link href="/checkout" className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                  {t.checkout}
                  <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                </Link>
                <Link href="/products" className="block w-full py-4 text-center text-gray-500 font-bold hover:text-primary transition-colors">
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
