"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { 
  FiMapPin, FiPhone, FiUser, FiMail, 
  FiCreditCard, FiTruck, FiCheckCircle, FiPercent,
  FiShoppingBag, FiInfo, FiArrowRight
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
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);



  // Shipping Logic (Mock)
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
      // Fallback in case even the API fallback fails
      setScreenshotUrl("https://placehold.co/600x400?text=Upload+Process+Fallback");
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login?callback=/checkout");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
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

      // 2. Handle Payment Redirection
      if (paymentMethod === "cod") {
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
      } else if (paymentMethod.startsWith("paymob")) {
        const paymobResponse = await axios.post("/api/payment/paymob", {
          orderId: order._id,
          amount: finalTotal,
          userData: formData,
          method: paymentMethod
        });
        
        const paymentKey = paymobResponse.data.paymentKey;
        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/783414?payment_token=${paymentKey}`;
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };



  const paymentMethods = [
    { id: "cod", nameAr: "الدفع عند الاستلام", nameEn: "Cash on Delivery", icon: <FiTruck />, color: "bg-blue-500" },
    { id: "stripe", nameAr: "بطاقة ائتمان (Stripe)", nameEn: "Credit Card (Stripe)", icon: <FiCreditCard />, color: "bg-purple-500" },
    { id: "instapay", nameAr: "إنستا باي (InstaPay)", nameEn: "InstaPay", icon: <FiCheckCircle />, color: "bg-pink-500" },
    { id: "paymob_wallet", nameAr: "فودافون كاش / محفظة", nameEn: "Vodafone Cash / Wallet", icon: <FiShoppingBag />, color: "bg-red-500" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-dark">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl">
            <FiShoppingBag />
          </div>
          <div>
            <h1 className="text-4xl font-black">{language === "ar" ? "إتمام الشراء" : "Checkout"}</h1>
            <p className="text-gray-500">{language === "ar" ? "خطوة واحدة تفصلك عن طلبك" : "One step away from your order"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2.5rem] border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FiUser className="text-primary" />
                {language === "ar" ? "بيانات الشحن" : "Shipping Details"}
              </h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">{language === "ar" ? "الاسم بالكامل" : "Full Name"}</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">{language === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required
                      type="email" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">{language === "ar" ? "رقم الهاتف" : "Phone"}</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required
                      type="tel" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-2">{language === "ar" ? "المدينة" : "City"}</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold ml-2">{language === "ar" ? "العنوان بالتفصيل" : "Full Address"}</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl outline-none border border-transparent focus:border-primary transition-all"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FiCreditCard className="text-primary" />
                {language === "ar" ? "اختر وسيلة الدفع" : "Payment Method"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === method.id 
                        ? "border-primary bg-primary/5 shadow-lg" 
                        : "border-gray-100 dark:border-white/10 hover:border-primary/50"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white ${method.color}`}>
                      {method.icon}
                    </div>
                    <span className="font-bold text-lg">{language === "ar" ? method.nameAr : method.nameEn}</span>
                  </button>
                ))}
              </div>

              {/* Payment Instructions & Screenshot */}
              <AnimatePresence>
                {(paymentMethod === "instapay" || paymentMethod === "paymob_wallet") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-primary/30"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-2">
                          {language === "ar" ? "بيانات التحويل" : "Payment Details"}
                        </h4>
                        {paymentMethod === "instapay" ? (
                          <div className="space-y-2">
                            <p className="text-gray-500">{language === "ar" ? "حول المبلغ إلى الحساب التالي:" : "Transfer to this handle:"}</p>
                            <p className="text-2xl font-black text-primary">01223366046@instapay</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-gray-500">{language === "ar" ? "حول المبلغ إلى رقم المحفظة:" : "Transfer to this wallet number:"}</p>
                            <p className="text-2xl font-black text-primary">01223366046</p>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-2">
                          {language === "ar" ? "إرفاق إثبات الدفع" : "Upload Receipt"}
                        </h4>
                        <div className="relative group">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleScreenshotUpload(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`w-full h-24 border-2 border-dashed rounded-2xl flex flex-row items-center justify-center gap-3 transition-all ${
                            screenshotUrl ? "border-green-500 bg-green-500/5" : "border-gray-200 dark:border-white/10 group-hover:border-primary"
                          }`}>
                            {uploadingScreenshot ? (
                              <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : screenshotUrl ? (
                              <>
                                <FiCheckCircle className="text-green-500 text-2xl" />
                                <span className="font-bold text-green-500">{language === "ar" ? "تم الرفع بنجاح" : "Uploaded Successfully"}</span>
                              </>
                            ) : (
                              <>
                                <FiShoppingBag className="text-gray-400 group-hover:text-primary transition-colors" />
                                <span className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors">
                                  {language === "ar" ? "اضغط لرفع سكرين شوت الدفع" : "Upload Payment Screenshot"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {screenshotUrl && (
                          <p className="text-[10px] text-gray-500 mt-2 italic line-clamp-1">{screenshotUrl}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-xl font-bold">
                      {language === "ar" 
                        ? "⚠️ تنبيه: سيتم مراجعة الطلب وتأكيده فور التأكد من وصول التحويل." 
                        : "⚠️ Note: Your order will be confirmed once the payment is verified."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-32">
              {/* Order Summary */}
              <div className="glass p-8 rounded-[2.5rem] border-white/20 shadow-2xl">
                <h2 className="text-2xl font-black mb-8">{language === "ar" ? "ملخص الطلب" : "Summary"}</h2>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-8 pr-2">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.title[language]}</h4>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="font-bold">{item.price * item.quantity} EGP</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-foreground/10 pt-6">
                  <div className="flex justify-between text-gray-500">
                    <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span>{totalPrice} EGP</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{language === "ar" ? "الشحن" : "Shipping"}</span>
                    <span>{shippingCost === 0 ? (language === "ar" ? "مجاني" : "Free") : `${shippingCost} EGP`}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{language === "ar" ? "الضريبة (14%)" : "Tax (14%)"}</span>
                    <span>{tax.toFixed(2)} EGP</span>
                  </div>
                  
                  <AnimatePresence>
                    {discount > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex justify-between text-green-500 font-bold"
                      >
                        <span>{language === "ar" ? "الخصم" : "Discount"}</span>
                        <span>-{discount} EGP</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between text-2xl font-black pt-4 border-t border-foreground/10">
                    <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                    <span className="text-primary">{finalTotal.toFixed(2)} EGP</span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="glass p-6 rounded-[2rem] border-white/20">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <FiPercent className="text-primary" />
                  {language === "ar" ? "هل لديك كوبون خصم؟" : "Have a coupon?"}
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={language === "ar" ? "ادخل الكود" : "Enter code"}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-dark dark:bg-white text-white dark:text-dark font-bold rounded-xl hover:scale-105 transition-all"
                  >
                    {language === "ar" ? "تطبيق" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-2 ml-2">{couponError}</p>}
                {appliedCoupon && <p className="text-green-500 text-xs mt-2 ml-2">Coupon {appliedCoupon} applied!</p>}
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={loading}
                onClick={() => {
                  if (cart.length === 0) {
                    alert(language === "ar" ? "السلة فارغة!" : "Cart is empty!");
                  }
                }}
                className="w-full py-5 gradient-primary text-white rounded-3xl font-bold text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {language === "ar" ? "تأكيد الطلب الآن" : "Confirm Order"}
                    <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
