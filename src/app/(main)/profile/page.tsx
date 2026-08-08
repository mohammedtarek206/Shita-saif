"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
  FiUser, FiMail, FiShield, FiLogOut, FiEdit2,
  FiShoppingBag, FiHeart, FiMapPin, FiSave, FiCheck,
  FiArrowRight, FiPackage, FiCalendar, FiDollarSign
} from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const tabs = [
    { id: "overview", label: language === "ar" ? "نظرة عامة" : "Overview", icon: <FiUser /> },
    { id: "orders", label: language === "ar" ? "طلباتي" : "My Orders", icon: <FiShoppingBag /> },
    { id: "wishlist", label: language === "ar" ? "المفضلة" : "Wishlist", icon: <FiHeart /> },
    { id: "settings", label: language === "ar" ? "الإعدادات" : "Settings", icon: <FiMapPin /> },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (status === "authenticated") fetchOrders();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && tabs.some(t => t.id === tab)) setActiveTab(tab);
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <motion.div
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!session) return null;
  const user = session.user as any;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-500">
      <Navbar />

      <div className="container mx-auto px-4 max-w-6xl pb-20">
        {/* Profile Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 md:mb-24"
        >
          <div className="h-48 md:h-64 gradient-primary rounded-[3rem] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="absolute -bottom-16 md:-bottom-20 left-6 md:left-12 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] gradient-primary flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl border-8 border-gray-50 dark:border-[#0A0A0A] relative group">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center cursor-pointer">
                <FiEdit2 size={24} />
              </div>
            </div>

            <div className="mb-2 md:mb-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight italic uppercase">{user?.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm md:text-base mt-1">
                <FiMail className="text-primary" /> {user?.email}
              </div>
            </div>
          </div>

          <div className="absolute bottom-[-100px] md:bottom-2 right-4 md:right-0 flex flex-wrap gap-3">
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Link href="/admin" className="px-6 py-3 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
                <FiShield className="text-primary" /> {language === "ar" ? "لوحة الإدارة" : "Dashboard"}
              </Link>
            )}
            <button onClick={() => signOut({ callbackUrl: "/" })} className="px-6 py-3 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all shadow-xl">
              <FiLogOut /> {language === "ar" ? "خروج" : "Logout"}
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar mt-32 md:mt-0">
          {tabs.map((tab) => (
            <button
              key={(tab as any)?._id || (tab as any)?.id || (tab as any)?.slug || (tab as any)?.name || (tab as any)?.title?.en || (tab as any)?.title?.ar || JSON.stringify(tab).substring(0, 20)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab.id
                  ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105"
                  : "bg-white dark:bg-white/5 text-gray-400 hover:text-primary border border-gray-100 dark:border-white/5"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content with Animations */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 bg-white dark:bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl">
                <h2 className="text-2xl font-black uppercase italic tracking-tight mb-10 flex items-center gap-3">
                  <FiUser className="text-primary" /> {language === "ar" ? "الملف الشخصي" : "Profile Identity"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { icon: <FiUser />, label: language === "ar" ? "الاسم الكامل" : "Display Name", value: user?.name },
                    { icon: <FiMail />, label: language === "ar" ? "البريد الإلكتروني" : "Email Address", value: user?.email },
                    { icon: <FiShield />, label: language === "ar" ? "مستوى الوصول" : "Access Level", value: user?.role || "Verified Client" },
                    { icon: <FiCalendar />, label: language === "ar" ? "عضو منذ" : "Member Since", value: "May 2024" },
                  ].map((item, i) => (
                    <div key={`item-${i}`} className="space-y-2 p-6 bg-gray-50 dark:bg-white/2 rounded-[2rem] group hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20">
                      <div className="flex items-center gap-2 text-primary">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">{item.label}</span>
                      </div>
                      <p className="text-lg font-black tracking-tight">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "Total Orders", value: orders.length, icon: <FiPackage />, color: "from-blue-500 to-indigo-600" },
                  { label: "Wishlist", value: "0", icon: <FiHeart />, color: "from-rose-500 to-pink-600" },
                  { label: "Loyalty Points", value: orders.length * 100, icon: <FiDollarSign />, color: "from-amber-500 to-orange-600" },
                ].map((stat, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    key={`item-${i}`} className={`bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group`}
                  >
                    <div className="relative z-10">
                      <div className="text-5xl font-black mb-1 italic">{stat.value}</div>
                      <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">{stat.label}</div>
                    </div>
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-8xl opacity-10 group-hover:scale-125 transition-transform duration-500">
                      {stat.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {ordersLoading ? (
                <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
              ) : orders.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {orders.map((order, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      key={(order as any)?._id || (order as any)?.id || (order as any)?.slug || (order as any)?.name || (order as any)?.title?.en || (order as any)?.title?.ar || JSON.stringify(order).substring(0, 20)} className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden group hover:border-primary/30 transition-all"
                    >
                      <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl">
                              <FiPackage />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {order.invoiceNumber}</span>
                              </div>
                              <h3 className="text-xl font-black italic uppercase tracking-tight">
                                {new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-6 md:pt-0 border-gray-100 dark:border-white/5">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Order Amount</p>
                              <p className="text-2xl font-black text-primary tracking-tighter italic">{order.totalPrice} <span className="text-xs">EGP</span></p>
                            </div>
                            <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500" :
                                order.status === "cancelled" ? "bg-rose-500/10 text-rose-500" :
                                  "bg-blue-500/10 text-blue-500"
                              }`}>
                              {language === "ar" ?
                                (order.status === "pending" ? "بانتظار التأكيد" :
                                  order.status === "processing" ? "قيد التجهيز" :
                                    order.status === "shipped" ? "في الطريق" :
                                      order.status === "delivered" ? "تم الاستلام" : "ملغي") :
                                order.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                          {order.products.map((item: any, i: number) => (
                            <div key={`item-${i}`} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-transparent hover:border-white/10 transition-all">
                              <img src={item.product?.images?.[0] || item.image || "https://placehold.co/100"} className="w-14 h-14 rounded-xl object-cover shadow-lg" alt="" />
                              <div className="min-w-0">
                                <h4 className="font-black text-xs truncate group-hover:text-primary transition-colors">{language === "ar" ? (item.product?.title?.ar || item.title?.ar) : (item.product?.title?.en || item.title?.en)}</h4>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">Qty: {item.quantity} × {Number(item.price).toLocaleString()} EGP</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                          <Link
                            href={`/track-order?phone=${order.shippingAddress?.phone}`}
                            className="flex-1 md:flex-none text-center px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                          >
                            {language === "ar" ? "تتبع الطلب" : "Track Order"}
                          </Link>
                          <Link
                            href={`/orders/${order.orderNumber || order._id}/invoice`}
                            className="flex-1 md:flex-none text-center px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                          >
                            {language === "ar" ? "عرض الفاتورة" : "View Invoice"}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-white/5 rounded-[3rem] p-16 md:p-24 text-center border border-gray-100 dark:border-white/10 shadow-2xl">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl text-gray-300">
                    <FiShoppingBag />
                  </div>
                  <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tight">{language === "ar" ? "أنت لم تطلب أي شيء بعد!" : "Your Bag is Empty"}</h3>
                  <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto">{language === "ar" ? "ابدأ رحلة التسوق الآن واستمتع بأفضل العروض الحصرية" : "Start your shopping journey now and explore our exclusive deals"}</p>
                  <Link href="/products" className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                    {language === "ar" ? "تسوق الآن" : "Explore Products"} <FiArrowRight className={language === "ar" ? "rotate-180" : ""} />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl max-w-2xl"
            >
              <h2 className="text-2xl font-black uppercase italic tracking-tight mb-10 flex items-center gap-3">
                <FiMapPin className="text-primary" /> {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
              </h2>
              <div className="space-y-8">
                {[
                  { label: language === "ar" ? "الاسم الكامل" : "Display Name", type: "text", value: user?.name, icon: <FiUser /> },
                  { label: language === "ar" ? "البريد الإلكتروني" : "Email Address", type: "email", value: user?.email, icon: <FiMail /> },
                  { label: language === "ar" ? "كلمة المرور الجديدة" : "New Password", type: "password", placeholder: "••••••••", icon: <FiShield /> },
                ].map((field, i) => (
                  <div key={`item-${i}`} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-4 italic">{field.label}</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        {field.icon}
                      </div>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        placeholder={field.placeholder}
                        className="w-full pl-16 pr-6 py-4 bg-gray-50 dark:bg-white/2 border border-transparent focus:border-primary rounded-2xl outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                  {saved ? <FiCheck size={20} /> : <FiSave size={20} />}
                  {saved ? (language === "ar" ? "تم الحفظ بنجاح!" : "Identity Updated!") : (language === "ar" ? "حفظ التغييرات" : "Save Changes")}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] p-16 md:p-24 text-center border border-gray-100 dark:border-white/10 shadow-2xl"
            >
              <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl text-gray-300">
                <FiHeart />
              </div>
              <h3 className="text-3xl font-black mb-4 italic uppercase tracking-tight">{language === "ar" ? "قائمة الأمنيات فارغة" : "Wishlist is Empty"}</h3>
              <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto">{language === "ar" ? "احفظ المنتجات التي تعجبك هنا لتتمكن من الوصول إليها لاحقاً بسهولة" : "Save items you love and they will appear here for easy access later"}</p>
              <Link href="/products" className="inline-flex items-center gap-3 px-12 py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                {language === "ar" ? "تصفح المنتجات" : "Browse Collection"}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
