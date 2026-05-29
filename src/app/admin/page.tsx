"use client";

import React, { useEffect, useState } from "react";
import {
  FiUsers, FiShoppingCart, FiDollarSign, FiBox,
  FiArrowUpRight, FiArrowRight, FiActivity, FiTag
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/users"),
        ]);

        const safeJson = async (res: Response) => {
          if (!res.ok) return [];
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              return await res.json();
            } catch (err) {
              return [];
            }
          }
          return [];
        };

        const products = await safeJson(productsRes);
        const orders = await safeJson(ordersRes);
        const users = await safeJson(usersRes);

        const revenue = Array.isArray(orders)
          ? orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0)
          : 0;

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          revenue,
        });
        if (Array.isArray(orders)) setRecentOrders(orders.slice(0, 5));
        if (Array.isArray(products)) setTopProducts(products.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Demo chart data (shown when no real order data)
  const demoChart = [
    { name: language === "ar" ? "يناير" : "Jan", orders: 12, revenue: 48000 },
    { name: language === "ar" ? "فبراير" : "Feb", orders: 18, revenue: 72000 },
    { name: language === "ar" ? "مارس" : "Mar", orders: 9,  revenue: 36000 },
    { name: language === "ar" ? "أبريل" : "Apr", orders: 25, revenue: 100000 },
    { name: language === "ar" ? "مايو" : "May", orders: 30, revenue: 120000 },
    { name: language === "ar" ? "يونيو" : "Jun", orders: 22, revenue: 88000 },
  ];

  // Build real chart data from orders grouped by month
  const buildChartData = () => {
    if (recentOrders.length === 0) return demoChart;
    return MONTHS_EN.map((m, i) => {
      const monthOrders = recentOrders.filter((o: any) => {
        const d = new Date(o.createdAt || o.updatedAt || Date.now());
        return d.getMonth() === i;
      });
      return {
        name: language === "ar" ? MONTHS_AR[i].slice(0, 3) : m,
        orders: monthOrders.length,
        revenue: monthOrders.reduce((a: number, o: any) => a + (o.total || 0), 0),
      };
    }).filter(d => d.orders > 0);
  };

  const displayChart = buildChartData();

  const statCards = [
    {
      titleAr: "الإيرادات", titleEn: "Revenue",
      value: loading ? null : `${stats.revenue.toLocaleString()} ${language === "ar" ? "ج.م" : "EGP"}`,
      icon: <FiDollarSign />, iconBg: "bg-primary text-white", glow: "shadow-primary/20",
    },
    {
      titleAr: "الطلبات", titleEn: "Orders",
      value: loading ? null : stats.orders.toLocaleString(),
      icon: <FiShoppingCart />, iconBg: "bg-blue-500 text-white", glow: "shadow-blue-500/20",
    },
    {
      titleAr: "المنتجات", titleEn: "Products",
      value: loading ? null : stats.products.toLocaleString(),
      icon: <FiBox />, iconBg: "bg-purple-500 text-white", glow: "shadow-purple-500/20",
    },
    {
      titleAr: "المستخدمون", titleEn: "Users",
      value: loading ? null : stats.users.toLocaleString(),
      icon: <FiUsers />, iconBg: "bg-emerald-500 text-white", glow: "shadow-emerald-500/20",
    },
  ];

  const statusColor: Record<string, string> = {
    delivered: "text-emerald-500 bg-emerald-500/10",
    processing: "text-blue-500 bg-blue-500/10",
    pending: "text-amber-500 bg-amber-500/10",
    cancelled: "text-rose-500 bg-rose-500/10",
    shipped: "text-purple-500 bg-purple-500/10",
  };
  const statusLabelAr: Record<string, string> = {
    delivered: "تم التوصيل", processing: "جاري التجهيز",
    pending: "قيد الانتظار", cancelled: "ملغي", shipped: "تم الشحن",
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            {language === "ar" ? "لوحة التحكم" : "Dashboard"}
            <FiActivity className="text-primary animate-pulse" />
          </h1>
          <p className="text-gray-500 font-bold mt-1">
            {language === "ar" ? "نظرة شاملة على أداء المتجر" : "Full performance overview"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/coupons"
            className="px-5 py-3 bg-gray-100 dark:bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          >
            <FiTag /> {language === "ar" ? "الكوبونات" : "Coupons"}
          </Link>
          <Link
            href="/admin/orders"
            className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            {language === "ar" ? "الطلبات" : "Orders"} <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={`item-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-black/40 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl group hover:scale-[1.02] hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <FiArrowUpRight className="text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              {language === "ar" ? card.titleAr : card.titleEn}
            </p>
            {card.value === null ? (
              <div className="w-24 h-8 bg-gray-100 dark:bg-white/10 rounded-xl animate-pulse" />
            ) : (
              <p className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                {card.value}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-black/40 p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
        >
          <div className="mb-8">
            <h3 className="text-xl font-black">{language === "ar" ? "تحليل الإيرادات" : "Revenue Analytics"}</h3>
            <p className="text-gray-500 text-sm font-bold mt-1">{language === "ar" ? "النمو الشهري" : "Monthly growth"}</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChart}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888812" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#888", fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#888", fontWeight: 900 }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "20px", padding: "16px" }}
                  itemStyle={{ color: "#E91E63", fontWeight: "900", fontSize: "10px" }}
                  labelStyle={{ color: "#888", marginBottom: "8px", fontWeight: "900", fontSize: "10px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E91E63" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-black/40 p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
        >
          <div className="mb-8">
            <h3 className="text-xl font-black">{language === "ar" ? "حجم الطلبات" : "Order Volume"}</h3>
            <p className="text-gray-500 text-sm font-bold mt-1">{language === "ar" ? "توزيع شهري" : "Monthly distribution"}</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888812" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#888", fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#888", fontWeight: 900 }} dx={-10} />
                <Tooltip cursor={{ fill: "#88888808" }} contentStyle={{ backgroundColor: "#111", border: "none", borderRadius: "20px", padding: "16px" }} />
                <Bar dataKey="orders" fill="#1E4FA3" radius={[12, 12, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders + Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-black/40 p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black">
            {language === "ar" ? "أحدث الطلبات" : "Recent Orders"}
          </h3>
          <Link
            href="/admin/orders"
            className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline"
          >
            {language === "ar" ? "عرض الكل" : "View All"} <FiArrowRight />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-bold text-sm">
            {language === "ar" ? "لا توجد طلبات حتى الآن" : "No orders yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 dark:border-white/5">
                  <th className="pb-5 text-start">{language === "ar" ? "رقم الطلب" : "Order ID"}</th>
                  <th className="pb-5 text-start">{language === "ar" ? "العميل" : "Customer"}</th>
                  <th className="pb-5 text-start">{language === "ar" ? "المبلغ" : "Total"}</th>
                  <th className="pb-5 text-center">{language === "ar" ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {recentOrders.map((order: any, i: number) => {
                  const st = (order.status || "pending").toLowerCase();
                  return (
                    <tr key={`item-${i}`} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <td className="py-5 font-black text-sm group-hover:text-primary transition-colors">
                        #{(order._id || "").toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="py-5 font-bold text-sm">
                        {order.customerName || order.userName || "—"}
                      </td>
                      <td className="py-5 font-black text-primary">
                        {(order.total || 0).toLocaleString()} {language === "ar" ? "ج.م" : "EGP"}
                      </td>
                      <td className="py-5 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusColor[st] || "text-gray-500 bg-gray-100"}`}>
                          {language === "ar" ? (statusLabelAr[st] || st) : st}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-gray-500">
              {language === "ar" ? "أبرز المنتجات" : "Top Products"}
            </h4>
            <div className="space-y-4">
              {topProducts.map((p: any, i: number) => (
                <div key={`item-${i}`} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-2xl shrink-0 overflow-hidden p-1.5">
                    <img src={p.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate">
                      {language === "ar" ? p.title?.ar : p.title?.en}
                    </p>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, 100 - i * 15)}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <span className="font-black text-primary shrink-0 text-sm">
                    {(p.price || 0).toLocaleString()} {language === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
