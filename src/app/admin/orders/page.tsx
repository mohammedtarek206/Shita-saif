"use client";

import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiCheckCircle, FiXCircle, 
  FiClock, FiEye, FiDownload, FiDollarSign,
  FiPhone, FiChevronDown, FiTrash2, FiCalendar, FiUser, FiSearch, FiTruck, FiEdit3
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<any>(null);

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
                  <FiXCircle size={24} />
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

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-zoom-out" 
            />
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} className="relative max-w-full max-h-[80vh] rounded-[3rem] shadow-2xl border-2 border-white/10" 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
