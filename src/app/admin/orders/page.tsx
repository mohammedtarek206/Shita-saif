"use client";

import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiCheckCircle, FiXCircle, 
  FiClock, FiEye, FiDownload, FiDollarSign,
  FiPhone, FiChevronDown, FiTrash2, FiCalendar, FiUser, FiSearch, FiTruck, FiEdit3, FiPrinter, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [printingOrder, setPrintingOrder] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [printMode, setPrintMode] = useState<"invoice" | "receipt">("invoice");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  const handleUpdateOrder = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setOrders((prev: any) => 
          prev.map((o: any) => o._id === id ? { ...o, ...updates } : o)
        );
        if (editingOrder?._id === id) {
          setEditingOrder({ ...editingOrder, ...updates });
        }
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev: any) => prev.filter((o: any) => o._id !== id));
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handlePrint = (order: any, mode: "invoice" | "receipt" = "invoice") => {
    setPrintingOrder(order);
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "cancelled": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "shipped": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "out_for_delivery": return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "preparing": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "confirmed": return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress?.phone?.includes(searchTerm) ||
    o.shippingAddress?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const orderStatuses = ["pending", "confirmed", "preparing", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

  return (
    <div className="space-y-8 pb-20">
      {/* Print CSS Injection */}
      <style>{`
        @media print {
          body > *:not(#printable-invoice-container) {
            display: none !important;
          }
          #printable-invoice-container {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: ${printMode === "receipt" ? "80mm !important" : "100% !important"};
            max-width: ${printMode === "receipt" ? "80mm !important" : "none !important"};
            background: white !important;
            color: black !important;
            padding: ${printMode === "receipt" ? "10px !important" : "40px !important"};
            box-sizing: border-box;
            direction: rtl;
            font-size: ${printMode === "receipt" ? "11px !important" : "inherit"};
            line-height: 1.4;
          }
        }
      `}</style>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">Order Management</h2>
          <p className="text-gray-500 text-xs font-bold mt-1">Track and update customer shipments in real-time</p>
        </div>
        <div className="relative group w-full md:w-96">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by ID, Phone, Email..."
            className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-14 py-4 font-bold outline-none focus:border-primary transition-all shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Revenue", value: orders.reduce((acc, o: any) => acc + o.totalPrice, 0), icon: <FiDollarSign />, color: "from-emerald-500 to-emerald-600", suffix: "EGP" },
          { label: "Total Orders", value: orders.length, icon: <FiPackage />, color: "from-blue-500 to-blue-600" },
          { label: "Pending", value: orders.filter((o: any) => o.status === "pending").length, icon: <FiClock />, color: "from-amber-500 to-amber-600" },
          { label: "Out for Delivery", value: orders.filter((o: any) => o.status === "out_for_delivery").length, icon: <FiTruck />, color: "from-cyan-500 to-cyan-600" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="glass p-6 rounded-[2rem] border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg group-hover:rotate-6 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value.toLocaleString()} {stat.suffix}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left rtl:text-right border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-6">Order ID</th>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Amount</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredOrders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-black text-sm group-hover:text-primary transition-colors">{order.orderNumber || order.invoiceNumber}</div>
                  <div className="text-[10px] text-gray-500 font-bold mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary font-black">
                      {order.shippingAddress?.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-sm">{order.shippingAddress?.name}</div>
                      <div className="text-[10px] text-gray-400 font-bold">{order.shippingAddress?.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="font-black text-lg">{order.totalPrice.toLocaleString()} <span className="text-[10px]">EGP</span></div>
                  <div className={`text-[9px] font-black uppercase inline-block px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {order.paymentStatus}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase inline-flex items-center gap-2",
                    getStatusColor(order.status)
                  )}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {order.status.replace("_", " ")}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handlePrint(order, "invoice")}
                      title="طباعة فاتورة A4 / Print A4 Invoice"
                      className="w-9 h-9 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <FiPrinter size={14} />
                    </button>
                    <button 
                      onClick={() => handlePrint(order, "receipt")}
                      title="طباعة إيصال حراري / Print Thermal Receipt"
                      className="w-9 h-9 flex items-center justify-center bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      <FiPrinter size={14} className="scale-x-[-1]" />
                    </button>
                    <button 
                      onClick={() => setEditingOrder(order)}
                      className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      <FiEdit3 />
                    </button>
                    <button 
                      onClick={() => handleDelete(order._id)}
                      className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order: any) => (
          <div key={order._id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-sm">{order.orderNumber || order.invoiceNumber}</p>
                <p className="text-[10px] text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={cn("px-3 py-1 rounded-lg text-[9px] font-black uppercase", getStatusColor(order.status))}>
                {order.status}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-gray-800 dark:text-gray-200">{order.shippingAddress?.name}</p>
              <p className="text-[10px] text-gray-500 font-bold">{order.shippingAddress?.phone}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
              <p className="font-black text-primary">{order.totalPrice.toLocaleString()} EGP</p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePrint(order, "invoice")}
                  title="A4 Invoice"
                  className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl"
                >
                  <FiPrinter size={16} />
                </button>
                <button 
                  onClick={() => handlePrint(order, "receipt")}
                  title="Thermal Receipt"
                  className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl"
                >
                  <FiPrinter size={16} className="scale-x-[-1]" />
                </button>
                <button 
                  onClick={() => setEditingOrder(order)}
                  className="p-2.5 bg-primary/10 text-primary rounded-xl"
                >
                  <FiEdit3 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal / Drawer */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-end p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 500, opacity: 0 }}
              className="relative w-full max-w-xl h-full bg-white dark:bg-[#0A0A0A] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Manage Order</h3>
                  <p className="text-xs font-bold text-gray-500">{editingOrder.orderNumber}</p>
                </div>
                <button onClick={() => setEditingOrder(null)} className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
                {/* Status Update */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <FiClock /> Order Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {orderStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleUpdateOrder(editingOrder._id, { status: s })}
                        className={cn(
                          "px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          editingOrder.status === s 
                            ? "bg-primary border-primary text-white shadow-xl shadow-primary/30" 
                            : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-primary/50"
                        )}
                      >
                        {s.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <FiTruck /> Shipping Details
                  </label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase ml-2">Estimated Delivery Date</p>
                      <input 
                        type="text"
                        placeholder="e.g. Wednesday, 20 May"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-6 py-4 font-bold outline-none transition-all"
                        value={editingOrder.estimatedDelivery || ""}
                        onChange={(e) => handleUpdateOrder(editingOrder._id, { estimatedDelivery: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase ml-2">Internal Delivery Notes</p>
                      <textarea 
                        placeholder="Add notes for the customer or courier..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary rounded-2xl px-6 py-4 font-bold outline-none transition-all h-32 resize-none"
                        value={editingOrder.deliveryNotes || ""}
                        onChange={(e) => handleUpdateOrder(editingOrder._id, { deliveryNotes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-6">
                    <FiDollarSign /> Financial Status
                  </label>
                  <div className="flex gap-4">
                    {["pending", "paid", "refunded", "failed"].map(ps => (
                      <button
                        key={ps}
                        onClick={() => handleUpdateOrder(editingOrder._id, { paymentStatus: ps })}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all",
                          editingOrder.paymentStatus === ps ? "bg-emerald-500 text-white" : "bg-white dark:bg-white/10"
                        )}
                      >
                        {ps}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden printable invoice container */}
      {mounted && printingOrder && typeof window !== "undefined" && createPortal(
        <div id="printable-invoice-container" className="font-cairo text-black">
          {printMode === "invoice" ? (
            /* ========================================================
               1. A4 INVOICE TEMPLATE (Amazon / Noon inspired)
               ======================================================== */
            <div style={{ direction: "rtl", textAlign: "right" }}>
              {/* Top Banner and Brand details */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #6366f1", paddingBottom: "20px", marginBottom: "25px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src="/Logo-removebg-preview.png" alt="Logo" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                    <div>
                      <h1 style={{ margin: 0, fontWeight: "900", fontSize: "26px", color: "#1e1b4b" }}>معرض الشتاء والصيف</h1>
                      <p style={{ margin: "2px 0 0 0", color: "#4f46e5", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>SHETA-SAIF APPLIANCES</p>
                    </div>
                  </div>
                  <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "11px", lineHeight: "1.6" }}>
                    تزمنت الشرقية، بني سويف، مصر <br />
                    هاتف: 01223366046 | البريد: whaba78@gmail.com
                  </p>
                </div>
                
                <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ backgroundColor: "#f3f4f6", padding: "8px 15px", borderRadius: "10px", marginBottom: "10px", borderRight: "4px solid #db2777" }}>
                    <h2 style={{ margin: 0, color: "#db2777", fontWeight: "900", fontSize: "18px" }}>فاتورة مبيعات رقمية</h2>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", fontWeight: "bold", color: "#374151" }}>
                      رقم الطلب: {printingOrder.orderNumber || printingOrder.invoiceNumber}
                    </p>
                  </div>
                  {/* Retail Code128 Barcode Generator API */}
                  <img 
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${printingOrder.orderNumber || printingOrder.invoiceNumber || 'INV-123'}&scale=1.5&rotate=N&includeText=true`}
                    alt="Barcode"
                    style={{ height: "40px", width: "150px", objectFit: "contain", marginBottom: "5px" }}
                  />
                </div>
              </div>

              {/* QR and Order Tracking Details card */}
              <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "20px", marginBottom: "25px" }}>
                
                {/* Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div style={{ border: "1px solid #e5e7eb", padding: "15px", borderRadius: "15px", backgroundColor: "#fafafa" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#4f46e5", fontWeight: "900", borderBottom: "1px solid #e5e7eb", paddingBottom: "4px", fontSize: "13px" }}>👤 بيانات العميل</h4>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>الاسم:</b> {printingOrder.shippingAddress?.name}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>الهاتف:</b> {printingOrder.shippingAddress?.phone}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>العنوان:</b> {printingOrder.shippingAddress?.street}, {printingOrder.shippingAddress?.city}</p>
                  </div>
                  
                  <div style={{ border: "1px solid #e5e7eb", padding: "15px", borderRadius: "15px", backgroundColor: "#fafafa" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#4f46e5", fontWeight: "900", borderBottom: "1px solid #e5e7eb", paddingBottom: "4px", fontSize: "13px" }}>📦 تفاصيل الشحنة والتتبع</h4>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>التاريخ:</b> {new Date(printingOrder.createdAt).toLocaleDateString("ar-EG")}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>طريقة الدفع:</b> {printingOrder.paymentStatus === "paid" ? "مدفوع بالكامل" : "الدفع عند الاستلام (COD)"}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>رقم التتبع:</b> TRK-{printingOrder.orderNumber || printingOrder._id?.substring(18)}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}><b>الوقت المتوقع للتوصيل:</b> خلال 2-3 أيام عمل</p>
                  </div>
                </div>

                {/* QR Code tracking container */}
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "15px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px", backgroundColor: "#fff" }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://wintersummer.com/orders/track/${printingOrder._id}`}
                    alt="Tracking QR Code"
                    style={{ width: "90px", height: "90px", objectFit: "contain", marginBottom: "5px" }}
                  />
                  <span style={{ fontSize: "9px", fontWeight: "900", color: "#4f46e5", textAlign: "center" }}>امسح لتتبع الطلب لايف</span>
                </div>

              </div>

              {/* Products Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "25px", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ backgroundColor: "#4f46e5", color: "#ffffff" }}>
                    <th style={{ padding: "12px 15px", textAlign: "right", fontSize: "12px", fontWeight: "900" }}>المنتج المطلوب</th>
                    <th style={{ padding: "12px 15px", textAlign: "center", fontSize: "12px", fontWeight: "900", width: "80px" }}>الكمية</th>
                    <th style={{ padding: "12px 15px", textAlign: "center", fontSize: "12px", fontWeight: "900", width: "120px" }}>سعر الوحدة</th>
                    <th style={{ padding: "12px 15px", textAlign: "left", fontSize: "12px", fontWeight: "900", width: "120px" }}>إجمالي البند</th>
                  </tr>
                </thead>
                <tbody>
                  {printingOrder.items?.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px solid #e5e7eb", backgroundColor: i % 2 === 0 ? "#fafafa" : "#ffffff" }}>
                      <td style={{ padding: "12px 15px", fontSize: "12px", fontWeight: "bold" }}>
                        {item.product?.title?.ar || item.product?.title?.en || "منتج منزل مميز"}
                      </td>
                      <td style={{ padding: "12px 15px", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "12px 15px", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>
                        {item.price?.toLocaleString()} ج.م
                      </td>
                      <td style={{ padding: "12px 15px", textAlign: "left", fontSize: "12px", fontWeight: "bold" }}>
                        {(item.price * item.quantity)?.toLocaleString()} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Calculation card */}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", marginBottom: "40px" }}>
                <div style={{ width: "320px", border: "1px solid #e5e7eb", padding: "15px", borderRadius: "15px", backgroundColor: "#fafafa" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", fontSize: "12px" }}>
                    <span style={{ color: "#666" }}>إجمالي المنتجات:</span>
                    <span style={{ fontWeight: "bold" }}>{(printingOrder.totalPrice - (printingOrder.shippingCost || 0)).toLocaleString()} ج.م</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", fontSize: "12px" }}>
                    <span style={{ color: "#666" }}>تكلفة الشحن والتوصيل:</span>
                    <span style={{ fontWeight: "bold" }}>{(printingOrder.shippingCost || 0).toLocaleString()} ج.م</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0 0 0", paddingTop: "10px", borderTop: "2px solid #e5e7eb", fontWeight: "900", fontSize: "16px", color: "#db2777" }}>
                    <span>المبلغ الصافي المستحق:</span>
                    <span>{printingOrder.totalPrice.toLocaleString()} ج.م</span>
                  </div>
                </div>

              </div>

              {/* Slogan */}
              <div style={{ textAlign: "center", borderTop: "1px solid #e5e7eb", paddingTop: "15px", color: "#6b7280", fontSize: "11px" }}>
                نشكركم لاختياركم معرض الشتاء والصيف. نسعد دائماً بزيارتكم وثقتكم الغالية!
              </div>

            </div>
          ) : (
            /* ========================================================
               2. THERMAL RECEIPT TEMPLATE (80mm width standard)
               ======================================================== */
            <div style={{ direction: "rtl", textAlign: "right", padding: "5px", fontSize: "11px", lineHeight: "1.3" }}>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <img src="/Logo-removebg-preview.png" alt="Logo" style={{ width: "40px", height: "40px", objectFit: "contain", margin: "0 auto 5px auto" }} />
                <h3 style={{ margin: 0, fontWeight: "900", fontSize: "15px" }}>معرض الشتاء والصيف</h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "9px", color: "#555" }}>إيصال مبيعات سريع</p>
              </div>

              <div style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", padding: "5px 0", margin: "5px 0" }}>
                <p style={{ margin: "2px 0" }}><b>الفاتورة:</b> {printingOrder.orderNumber || printingOrder.invoiceNumber}</p>
                <p style={{ margin: "2px 0" }}><b>التاريخ:</b> {new Date(printingOrder.createdAt).toLocaleDateString("ar-EG")}</p>
                <p style={{ margin: "2px 0" }}><b>العميل:</b> {printingOrder.shippingAddress?.name}</p>
                <p style={{ margin: "2px 0" }}><b>الهاتف:</b> {printingOrder.shippingAddress?.phone}</p>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", margin: "10px 0" }}>
                <thead>
                  <tr style={{ borderBottom: "1px dashed #000" }}>
                    <th style={{ textAlign: "right", padding: "3px 0", fontSize: "10px" }}>المنتج</th>
                    <th style={{ textAlign: "center", padding: "3px 0", fontSize: "10px", width: "30px" }}>ك</th>
                    <th style={{ textAlign: "left", padding: "3px 0", fontSize: "10px", width: "70px" }}>الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {printingOrder.items?.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom: "1px dotted #ccc" }}>
                      <td style={{ padding: "4px 0", fontSize: "10px" }}>{item.product?.title?.ar?.substring(0, 25) || "منتج منزل"}</td>
                      <td style={{ padding: "4px 0", textAlign: "center", fontSize: "10px" }}>{item.quantity}</td>
                      <td style={{ padding: "4px 0", textAlign: "left", fontSize: "10px" }}>{(item.price * item.quantity)?.toLocaleString()} ج</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ margin: "5px 0", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                  <span>إجمالي المنتجات:</span>
                  <span>{(printingOrder.totalPrice - (printingOrder.shippingCost || 0)).toLocaleString()} ج</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                  <span>الشحن والتوصيل:</span>
                  <span>{(printingOrder.shippingCost || 0).toLocaleString()} ج</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0 0 0", paddingTop: "4px", borderTop: "1px dashed #000", fontWeight: "900", fontSize: "13px" }}>
                  <span>الصافي المطلوب:</span>
                  <span>{printingOrder.totalPrice.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Barcode inside thermal receipt */}
              <div style={{ textAlign: "center", margin: "10px 0" }}>
                <img 
                  src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${printingOrder.orderNumber || printingOrder.invoiceNumber || 'INV-123'}&scale=1.2&rotate=N&includeText=true`}
                  alt="Barcode"
                  style={{ height: "30px", width: "120px", objectFit: "contain" }}
                />
              </div>

              <div style={{ textAlign: "center", marginTop: "10px", fontSize: "9px", color: "#666" }}>
                شكراً لتسوقكم معنا!
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
