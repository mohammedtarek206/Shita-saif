"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiTag, FiToggleLeft, FiToggleRight, FiCopy, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function CouponsAdmin() {
  const { language } = useLanguage();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "", type: "percentage", value: 10,
    minOrder: 0, maxUses: 100,
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    if (!form.code.trim()) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, code: form.code.toUpperCase() }),
      });
      if (res.ok) { fetchCoupons(); setShowModal(false); resetForm(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchCoupons();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetForm = () => setForm({
    code: "", type: "percentage", value: 10,
    minOrder: 0, maxUses: 100,
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
  });

  const inputCls = "w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white transition-all";
  const labelCls = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {language === "ar" ? "الكوبونات والخصومات" : "Coupons & Discounts"}
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-1">
            {language === "ar" ? `${coupons.length} كوبون نشط` : `${coupons.length} active coupons`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm"
        >
          <FiPlus /> {language === "ar" ? "إنشاء كوبون" : "Create Coupon"}
        </button>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-48 bg-white dark:bg-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
          <FiTag className="text-5xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="font-black text-gray-400 uppercase tracking-widest">
            {language === "ar" ? "لا توجد كوبونات بعد" : "No coupons yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon, i) => (
            <motion.div
              key={coupon?._id || coupon?.id || coupon?.slug || coupon?.name || coupon?.title?.en || coupon?.title?.ar || JSON.stringify(coupon).substring(0, 20)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`relative bg-white dark:bg-white/[0.03] rounded-[2rem] p-6 border-2 transition-all ${
                coupon.isActive ? "border-primary/20 shadow-xl shadow-primary/5" : "border-gray-100 dark:border-white/5 opacity-60"
              }`}
            >
              {/* Dashed divider to mimic a ticket */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-100 dark:border-white/5" />

              <div className="relative z-10 space-y-4">
                {/* Code row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-2 font-black text-xl tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    {coupon.code}
                    {copied === coupon.code ? <FiCheck className="text-green-500" /> : <FiCopy className="text-gray-400" size={16} />}
                  </button>
                  <button onClick={() => handleToggle(coupon._id, coupon.isActive)} className="text-2xl transition-colors">
                    {coupon.isActive
                      ? <FiToggleRight className="text-primary" />
                      : <FiToggleLeft className="text-gray-400" />
                    }
                  </button>
                </div>

                {/* Value badge */}
                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl font-black text-lg">
                    {coupon.type === "percentage" ? `-${coupon.value}%` : `-${coupon.value} EGP`}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    coupon.isActive ? "bg-green-500/10 text-green-600" : "bg-gray-100 dark:bg-white/10 text-gray-500"
                  }`}>
                    {coupon.isActive ? (language === "ar" ? "نشط" : "Active") : (language === "ar" ? "معطل" : "Inactive")}
                  </span>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-white/5 text-center">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {language === "ar" ? "الاستخدام" : "Usage"}
                    </p>
                    <p className="font-black text-sm">{coupon.usedCount}/{coupon.maxUses}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {language === "ar" ? "الحد الأدنى" : "Min. Order"}
                    </p>
                    <p className="font-black text-sm">{coupon.minOrder}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      {language === "ar" ? "الانتهاء" : "Expires"}
                    </p>
                    <p className="font-black text-sm text-[10px]">
                      {new Date(coupon.expiresAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="w-full py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl font-black text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <FiTrash2 /> {language === "ar" ? "حذف" : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-[#0F0F0F] w-full max-w-lg rounded-[3rem] p-8 shadow-2xl border border-gray-100 dark:border-white/10 space-y-6"
            >
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {language === "ar" ? "إنشاء كوبون جديد" : "Create New Coupon"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>{language === "ar" ? "كود الكوبون" : "Coupon Code"}</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER20"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={inputCls + " uppercase tracking-widest font-black text-lg"}
                  />
                </div>
                <div>
                  <label className={labelCls}>{language === "ar" ? "النوع" : "Type"}</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className={inputCls}
                  >
                    <option value="percentage">{language === "ar" ? "نسبة مئوية %" : "Percentage %"}</option>
                    <option value="fixed">{language === "ar" ? "مبلغ ثابت" : "Fixed Amount"}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{language === "ar" ? "القيمة" : "Value"}</label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{language === "ar" ? "الحد الأدنى للطلب" : "Min. Order (EGP)"}</label>
                  <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{language === "ar" ? "الحد الأقصى للاستخدام" : "Max Uses"}</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>{language === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-white/5 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button onClick={handleCreate} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  {language === "ar" ? "إنشاء الكوبون" : "Create Coupon"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
