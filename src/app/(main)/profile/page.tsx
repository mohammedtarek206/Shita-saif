"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { 
  FiUser, FiMail, FiShield, FiLogOut, FiEdit2, 
  FiShoppingBag, FiHeart, FiMapPin, FiSave, FiCheck
} from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const tabs = [
    { id: "overview", label: language === "ar" ? "نظرة عامة" : "Overview", icon: <FiUser /> },
    { id: "orders", label: language === "ar" ? "طلباتي" : "My Orders", icon: <FiShoppingBag /> },
    { id: "wishlist", label: language === "ar" ? "المفضلة" : "Wishlist", icon: <FiHeart /> },
    { id: "settings", label: language === "ar" ? "الإعدادات" : "Settings", icon: <FiMapPin /> },
  ];

  // Fetch Orders
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  // Handle Tab from URL and Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
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
    <main className="min-h-screen pt-28 bg-gray-50 dark:bg-[#0A0A0A]">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="relative mb-12">
          <div className="h-48 gradient-primary rounded-[2.5rem] overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          <div className="absolute bottom-0 left-10 translate-y-1/2 flex items-end gap-6">
            <div className="w-28 h-28 rounded-3xl gradient-primary flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white dark:border-[#0A0A0A]">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black">{user?.name}</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
              {user?.role || "user"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Link 
                href="/admin"
                className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                <FiShield />
                {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
            >
              <FiLogOut />
              {language === "ar" ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 border border-gray-100 dark:border-white/10 col-span-2">
              <h2 className="text-xl font-black mb-6">{language === "ar" ? "معلوماتي" : "My Information"}</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white"><FiUser /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">{language === "ar" ? "الاسم" : "Full Name"}</p>
                    <p className="font-black text-lg">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white"><FiMail /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">{language === "ar" ? "البريد الإلكتروني" : "Email"}</p>
                    <p className="font-black text-lg">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white"><FiShield /></div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">{language === "ar" ? "الصلاحية" : "Role"}</p>
                    <p className="font-black text-lg capitalize">{user?.role || "Customer"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: language === "ar" ? "إجمالي الطلبات" : "Total Orders", value: orders.length.toString(), color: "from-blue-500 to-blue-600" },
                { label: language === "ar" ? "المنتجات المفضلة" : "Wishlist Items", value: "0", color: "from-pink-500 to-rose-600" },
                { label: language === "ar" ? "النقاط المكتسبة" : "Points Earned", value: (orders.length * 10).toString(), color: "from-amber-500 to-orange-500" },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-[2rem] text-white`}>
                  <div className="text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            {ordersLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white dark:bg-white/5 rounded-[2rem] p-8 border border-gray-100 dark:border-white/10 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-foreground/5">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{language === "ar" ? "رقم الفاتورة" : "Invoice #"}</span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-full text-[10px] font-black">{order.invoiceNumber}</span>
                        </div>
                        <h3 className="text-xl font-black">{new Date(order.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-bold uppercase">{language === "ar" ? "الإجمالي" : "Total Amount"}</p>
                          <p className="text-xl font-black text-primary">{order.totalPrice} EGP</p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                          order.status === "delivered" ? "bg-green-500/10 text-green-500" : 
                          order.status === "cancelled" ? "bg-red-500/10 text-red-500" : 
                          "bg-blue-500/10 text-blue-500"
                        }`}>
                          {language === "ar" ? 
                            (order.status === "pending" ? "قيد الانتظار" : 
                             order.status === "processing" ? "جاري المعالجة" : 
                             order.status === "shipped" ? "تم الشحن" : 
                             order.status === "delivered" ? "تم التوصيل" : "ملغي") : 
                            order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {order.products.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                          <img src={item.product?.images?.[0] || "https://placehold.co/100"} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h4 className="font-bold">{item.product?.title?.[language] || "Product"}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × {item.price} EGP</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-white/5 rounded-[2rem] p-12 border border-gray-100 dark:border-white/10 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-gray-400">
                  <FiShoppingBag />
                </div>
                <h3 className="text-2xl font-black mb-3">{language === "ar" ? "لا توجد طلبات بعد" : "No Orders Yet"}</h3>
                <p className="text-gray-500 mb-8">{language === "ar" ? "ابدأ التسوق الآن واستمتع بأفضل العروض" : "Start shopping now and enjoy the best deals"}</p>
                <Link href="/products" className="inline-block px-10 py-4 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  {language === "ar" ? "تسوق الآن" : "Shop Now"}
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-12 border border-gray-100 dark:border-white/10 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-gray-400">
              <FiHeart />
            </div>
            <h3 className="text-2xl font-black mb-3">{language === "ar" ? "قائمة المفضلة فارغة" : "Wishlist is Empty"}</h3>
            <p className="text-gray-500 mb-8">{language === "ar" ? "أضف المنتجات التي تعجبك إلى المفضلة" : "Save products you love to your wishlist"}</p>
            <Link href="/products" className="inline-block px-10 py-4 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 border border-gray-100 dark:border-white/10 max-w-2xl">
            <h2 className="text-xl font-black mb-8">{language === "ar" ? "إعدادات الحساب" : "Account Settings"}</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-black text-gray-500 uppercase tracking-widest block mb-2">{language === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || ""}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary rounded-2xl outline-none font-bold transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-black text-gray-500 uppercase tracking-widest block mb-2">{language === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ""}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary rounded-2xl outline-none font-bold transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-black text-gray-500 uppercase tracking-widest block mb-2">{language === "ar" ? "كلمة مرور جديدة" : "New Password"}</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-primary rounded-2xl outline-none font-bold transition-all"
                />
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-10 py-4 gradient-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                {saved ? <FiCheck /> : <FiSave />}
                {saved 
                  ? (language === "ar" ? "تم الحفظ!" : "Saved!") 
                  : (language === "ar" ? "حفظ التغييرات" : "Save Changes")}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
