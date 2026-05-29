"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiActivity, FiUser, FiCalendar, FiSmartphone, FiTerminal } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function AuditLogsPage() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [email, setEmail] = useState("");
  const [targetType, setTargetType] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 20;

  const t = {
    title: language === "ar" ? "سجل نشاطات المشرفين" : "Security & Audit Logs",
    subtitle: language === "ar" ? "مراقبة وتدقيق جميع العمليات الأمنية والتعديلات التي تتم في النظام" : "Monitor and audit all security operations and modifications in the system",
    searchEmail: language === "ar" ? "البحث بالبريد الإلكتروني..." : "Search by email...",
    filterAction: language === "ar" ? "كل الحركات" : "All Actions",
    filterTarget: language === "ar" ? "كل الكائنات" : "All Targets",
    admin: language === "ar" ? "المسؤول" : "Admin",
    actionCol: language === "ar" ? "الحركة" : "Action",
    targetCol: language === "ar" ? "النوع" : "Target",
    detailsCol: language === "ar" ? "التفاصيل" : "Details",
    deviceCol: language === "ar" ? "الجهاز والشبكة" : "Device & IP",
    dateCol: language === "ar" ? "التاريخ والوقت" : "Date & Time",
    empty: language === "ar" ? "لا توجد سجلات نشاطات مطابقة" : "No activity logs matched",
    prev: language === "ar" ? "السابق" : "Previous",
    next: language === "ar" ? "التالي" : "Next",
  };

  const actionOptions = [
    { value: "", label: t.filterAction },
    { value: "CREATE_PRODUCT", label: language === "ar" ? "إضافة منتج" : "Create Product" },
    { value: "UPDATE_PRODUCT", label: language === "ar" ? "تعديل منتج" : "Update Product" },
    { value: "DELETE_PRODUCT", label: language === "ar" ? "حذف منتج" : "Delete Product" },
    { value: "UPDATE_ORDER", label: language === "ar" ? "تعديل طلب" : "Update Order" },
    { value: "DELETE_ORDER", label: language === "ar" ? "حذف طلب" : "Delete Order" },
    { value: "CREATE_COUPON", label: language === "ar" ? "إنشاء كوبون" : "Create Coupon" },
    { value: "UPDATE_COUPON", label: language === "ar" ? "تعديل كوبون" : "Update Coupon" },
    { value: "DELETE_COUPON", label: language === "ar" ? "حذف كوبون" : "Delete Coupon" },
    { value: "CHANGE_ROLE", label: language === "ar" ? "تغيير رتبة" : "Change Role" },
  ];

  const targetOptions = [
    { value: "", label: t.filterTarget },
    { value: "Product", label: language === "ar" ? "منتج" : "Product" },
    { value: "Order", label: language === "ar" ? "طلب" : "Order" },
    { value: "Coupon", label: language === "ar" ? "كوبون" : "Coupon" },
    { value: "User", label: language === "ar" ? "مستخدم" : "User" },
  ];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
      });
      if (action) queryParams.append("action", action);
      if (email) queryParams.append("email", email);
      if (targetType) queryParams.append("targetType", targetType);

      const res = await fetch(`/api/admin/logs?${queryParams.toString()}`);
      const data = await res.json();
      if (data && !data.error) {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [action, email, targetType, skip]);

  const getActionColor = (act: string) => {
    if (act.startsWith("CREATE")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (act.startsWith("UPDATE")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    if (act.startsWith("DELETE")) return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <FiActivity className="text-primary animate-pulse" /> {t.title}
        </h1>
        <p className="text-gray-500 font-bold text-sm">{t.subtitle}</p>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] shadow-xl">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t.searchEmail}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSkip(0); }}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm transition-all"
          />
        </div>

        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setSkip(0); }}
          className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm transition-all"
        >
          {actionOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={targetType}
          onChange={(e) => { setTargetType(e.target.value); setSkip(0); }}
          className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none font-bold text-sm transition-all"
        >
          {targetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-5 px-6 text-start">{t.admin}</th>
                <th className="py-5 px-6 text-start">{t.actionCol}</th>
                <th className="py-5 px-6 text-start">{t.targetCol}</th>
                <th className="py-5 px-6 text-start">{t.detailsCol}</th>
                <th className="py-5 px-6 text-start">{t.deviceCol}</th>
                <th className="py-5 px-6 text-start">{t.dateCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`item-${i}`} className="animate-pulse">
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-28" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-64" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" /></td>
                    <td className="py-5 px-6"><div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-36" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-bold">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={(log as any)?._id || (log as any)?.id || (log as any)?.slug || (log as any)?.name || (log as any)?.title?.en || (log as any)?.title?.ar || JSON.stringify(log).substring(0, 20)} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                    {/* Admin */}
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {log.adminName?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 dark:text-white leading-none mb-1">{log.adminName}</p>
                          <p className="text-[10px] text-gray-400 font-bold leading-none">{log.adminEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-5 px-6">
                      <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-5 px-6">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{log.targetType}</span>
                    </td>

                    {/* Details */}
                    <td className="py-5 px-6 max-w-xs md:max-w-md">
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300 break-words">{log.details}</p>
                    </td>

                    {/* Device & IP */}
                    <td className="py-5 px-6">
                      <div className="text-xs font-bold text-gray-500 space-y-1">
                        {log.ipAddress && (
                          <div className="flex items-center gap-1">
                            <FiTerminal className="text-gray-400 shrink-0" />
                            <span>{log.ipAddress}</span>
                          </div>
                        )}
                        {log.userAgent && (
                          <div className="flex items-center gap-1 truncate max-w-[150px]" title={log.userAgent}>
                            <FiSmartphone className="text-gray-400 shrink-0" />
                            <span>{log.userAgent}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-5 px-6 text-xs font-bold text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar />
                        <span>{new Date(log.createdAt).toLocaleString(language === "ar" ? "ar-EG" : "en-US")}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="p-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
            <button
              disabled={skip === 0}
              onClick={() => setSkip(Math.max(0, skip - limit))}
              className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-primary hover:text-white transition-all"
            >
              {t.prev}
            </button>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              {Math.floor(skip / limit) + 1} / {Math.ceil(total / limit)}
            </span>
            <button
              disabled={skip + limit >= total}
              onClick={() => setSkip(skip + limit)}
              className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-primary hover:text-white transition-all"
            >
              {t.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
