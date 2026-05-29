"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { 
  FiMapPin, FiPhone, FiUser, FiMail, 
  FiCreditCard, FiTruck, FiCheckCircle, FiPercent,
  FiShoppingBag, FiInfo, FiArrowRight, FiLock, FiShield
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cart, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    city: "",
    address: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // Shipping Logic
  const shippingCost = totalPrice > 5000 ? 0 : 150;
  const tax = totalPrice * 0.14; // 14% VAT
  const finalTotal = totalPrice + shippingCost + tax - discount;

  const handleApplyCoupon = async () => {
    try {
      setCouponError("");
      const response = await axios.post("/api/coupons/validate", {
        code: couponCode,
        amount: totalPrice
      });
      setDiscount(response.data.discount);
      setAppliedCoupon(response.data.code);
    } catch (error: any) {
      setCouponError(error.response?.data?.error || "Invalid coupon");
    }
  };

  const handleScreenshotUpload = async (file: File) => {
    setUploadingScreenshot(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/upload", formData);
      setScreenshotUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
      setScreenshotUrl("https://placehold.co/600x400?text=Upload+Process+Fallback");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callback=${encodeURIComponent("/checkout")}`);
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await axios.post("/api/orders", {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.discount ? item.price - (item.price * item.discount / 100) : item.price
        })),
        subtotal: totalPrice,
        tax,
        shippingCost,
        discount,
        totalPrice: finalTotal,
        couponCode: appliedCoupon,
        paymentMethod,
        shippingAddress: formData,
        paymentDetails: {
          paymentScreenshot: screenshotUrl
        }
      });

      const order = orderResponse.data;

      if (paymentMethod === "cod" || paymentMethod === "instapay" || paymentMethod === "paymob_wallet") {
        clearCart();
        router.push(`/checkout/success?orderId=${order._id}`);
      } else if (paymentMethod === "stripe") {
        const stripeResponse = await axios.post("/api/payment/stripe", {
          orderId: order._id,
          products: cart.map(item => ({
            title: item.title[language],
            price: item.discount ? item.price - (item.price * item.discount / 100) : item.price,
            quantity: item.quantity
          })),
          totalPrice: finalTotal
        });
        window.location.href = stripeResponse.data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "cod", nameAr: "الدفع عند الاستلام", nameEn: "Cash on Delivery", icon: <FiTruck />, color: "bg-blue-500" },
    { id: "stripe", nameAr: "بطاقة ائتمان", nameEn: "Credit Card", icon: <FiCreditCard />, color: "bg-purple-500" },
    { id: "instapay", nameAr: "إنستا باي", nameEn: "InstaPay", icon: <FiCheckCircle />, color: "bg-pink-500" },
    { id: "paymob_wallet", nameAr: "محفظة إلكترونية", nameEn: "E-Wallet", icon: <FiShoppingBag />, color: "bg-red-500" },
  ];

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-2xl shadow-primary/30">
              <FiShoppingBag />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight italic uppercase">
                {language === "ar" ? "إتمام الطلب" : "Secure Checkout"}
              </h1>
              <p className="text-gray-500 font-bold mt-1">
                {language === "ar" ? "أنت على بعد خطوة واحدة من استلام طلبك" : "You are one step away from completing your order"}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white dark:bg-white/5 rounded-2xl border border-white/10 shadow-sm">
            <FiShield className="text-green-500 text-xl" />
            <div className="text-xs font-black uppercase tracking-widest text-gray-400">
              {language === "ar" ? "تشفير آمن 256-بت" : "256-Bit SSL Secured"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Shipping Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FiMapPin size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">
                  {language === "ar" ? "بيانات التوصيل" : "Delivery Address"}
                </h2>
              </div>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {[
                  { name: "name", label: language === "ar" ? "الاسم الكامل" : "Full Name", icon: <FiUser />, type: "text" },
                  { name: "email", label: language === "ar" ? "البريد الإلكتروني" : "Email Address", icon: <FiMail />, type: "email" },
                  { name: "phone", label: language === "ar" ? "رقم الهاتف" : "Phone Number", icon: <FiPhone />, type: "tel" },
                  { name: "city", label: language === "ar" ? "المدينة" : "City", icon: <FiMapPin />, type: "text" },
                ].map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2 italic">{field.label}</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        {field.icon}
                      </div>
                      <input 
                        required
                        type={field.type}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/2 border border-transparent focus:border-primary focus:bg-white dark:focus:bg-white/5 rounded-2xl outline-none transition-all font-bold"
                        value={(formData as any)[field.name]}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      />
                    </div>
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2 italic">{language === "ar" ? "العنوان بالتفصيل" : "Complete Street Address"}</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <FiMapPin />
                    </div>
                    <input 
                      required
                      type="text" 
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/2 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Payment Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-white dark:bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FiCreditCard size={20} />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">
                  {language === "ar" ? "وسيلة الدفع" : "Payment Method"}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method?._id || method?.id || method?.slug || method?.name || method?.title?.en || method?.title?.ar || JSON.stringify(method).substring(0, 20)}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-5 group relative overflow-hidden ${
                      paymentMethod === method.id 
                        ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                        : "border-gray-100 dark:border-white/5 hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg ${method.color} group-hover:rotate-6 transition-transform`}>
                      {method.icon}
                    </div>
                    <div className="text-left rtl:text-right">
                      <span className="block font-black text-sm md:text-base uppercase italic tracking-tight">
                        {language === "ar" ? method.nameAr : method.nameEn}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 opacity-60">
                        {method.id === 'cod' ? 'Pay upon delivery' : 'Secure instant pay'}
                      </span>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="absolute top-4 right-4 text-primary">
                        <FiCheckCircle size={20} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Sub-options for Instapay/Wallet */}
              <AnimatePresence>
                {(paymentMethod === "instapay" || paymentMethod === "paymob_wallet") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    className="mt-8 p-6 md:p-8 bg-gray-50 dark:bg-white/2 rounded-[2.5rem] border-2 border-dashed border-primary/20 space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <FiInfo size={18} />
                          <h4 className="font-black text-sm uppercase tracking-widest">
                            {language === "ar" ? "بيانات التحويل" : "Transfer Information"}
                          </h4>
                        </div>
                        <div className="p-5 bg-white dark:bg-black/20 rounded-2xl border border-white/5">
                          <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                            {paymentMethod === "instapay" ? "InstaPay Address" : "Wallet Number"}
                          </p>
                          <p className="text-xl md:text-2xl font-black text-primary tracking-tight">01223366046</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <FiCheckCircle size={18} />
                          <h4 className="font-black text-sm uppercase tracking-widest">
                            {language === "ar" ? "إثبات الدفع" : "Proof of Payment"}
                          </h4>
                        </div>
                        <div className="relative group cursor-pointer">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                            screenshotUrl ? "border-emerald-500 bg-emerald-500/5 text-emerald-500" : "border-gray-200 dark:border-white/10 group-hover:border-primary text-gray-400"
                          }`}>
                            {uploadingScreenshot ? (
                              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : screenshotUrl ? (
                              <>
                                <FiCheckCircle size={28} />
                                <span className="font-black text-xs uppercase italic">File Attached Successfully</span>
                              </>
                            ) : (
                              <>
                                <FiShoppingBag size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Receipt Image</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                      <FiInfo className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed italic">
                        {language === "ar" 
                          ? "برجاء رفع صورة إيصال التحويل لضمان سرعة تأكيد الطلب. سيتم البدء في التجهيز فور التحقق." 
                          : "Please provide a screenshot of your successful transaction to expedite order confirmation."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 md:top-32 space-y-6">
              {/* Order Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-white/5 backdrop-blur-3xl p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                  <FiShoppingBag size={120} />
                </div>
                
                <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">
                  {language === "ar" ? "ملخص الحقيبة" : "Order Summary"}
                </h2>
                
                <div className="space-y-5 max-h-[350px] overflow-y-auto custom-scrollbar mb-8 pr-2">
                  {cart.map((item) => (
                    <div key={item?._id || item?.id || item?.slug || item?.name || item?.title?.en || item?.title?.ar || JSON.stringify(item).substring(0, 20)} className="flex gap-4 items-center group">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 p-2 overflow-hidden shrink-0 border border-transparent group-hover:border-primary/20 transition-all">
                        <img src={item.images[0]} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.title[language]}</h4>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-black text-sm whitespace-nowrap">{(item.discount ? item.price * (1 - item.discount / 100) : item.price) * item.quantity} <span className="text-[10px] text-gray-400">EGP</span></span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-gray-100 dark:border-white/10 pt-8">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                    <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span className="text-gray-900 dark:text-white">{totalPrice.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                    <span>{language === "ar" ? "تكلفة الشحن" : "Shipping"}</span>
                    <span className={shippingCost === 0 ? "text-emerald-500" : "text-gray-900 dark:text-white"}>
                      {shippingCost === 0 ? (language === "ar" ? "توصيل مجاني" : "FREE SHIPPING") : `${shippingCost} EGP`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                    <span>{language === "ar" ? "الضريبة المقدرة" : "Estimated Tax"}</span>
                    <span className="text-gray-900 dark:text-white">{tax.toFixed(0)} EGP</span>
                  </div>
                  
                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex justify-between items-center text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">
                        <span>{language === "ar" ? "قيمة الخصم" : "Coupon Discount"}</span>
                        <span>-{discount} EGP</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-end pt-6 border-t border-gray-100 dark:border-white/10 mt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1 italic">Total Amount</p>
                      <p className="text-3xl font-black text-primary tracking-tighter italic">
                        {finalTotal.toLocaleString()} <span className="text-xs uppercase">EGP</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mb-1 opacity-40">
                      <FiLock className="text-xs" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Coupon Section */}
              <div className="bg-white dark:bg-white/5 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2 text-primary">
                  <FiPercent /> {language === "ar" ? "كوبون الخصم" : "Promo Code"}
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={language === "ar" ? "كود الخصم..." : "Enter code..."}
                    className="flex-1 px-5 py-3.5 bg-gray-50 dark:bg-black/20 rounded-xl outline-none border border-transparent focus:border-primary transition-all font-black text-xs"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    {language === "ar" ? "تفعيل" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-rose-500 text-[10px] font-black uppercase mt-3 ml-2 italic">{couponError}</p>}
                {appliedCoupon && <p className="text-emerald-500 text-[10px] font-black uppercase mt-3 ml-2 italic">Promo {appliedCoupon} active!</p>}
              </div>

              {/* Checkout Button */}
              <button 
                type="submit"
                form="checkout-form"
                disabled={loading || cart.length === 0}
                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(233,30,99,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase italic tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {language === "ar" ? "تأكيد الطلب الآن" : "Place Order Now"}
                    <FiArrowRight size={24} className={language === "ar" ? "rotate-180" : ""} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all pt-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
