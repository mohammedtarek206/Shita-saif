"use client";

import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiCheckCircle, FiXCircle, 
  FiClock, FiEye, FiDownload, FiDollarSign,
  FiPhone, FiChevronDown, FiTrash2, FiCalendar, FiUser
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
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

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setOrders((prev: any) => 
          prev.map((o: any) => o._id === id ? { ...o, status: newStatus } : o)
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePaymentUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setOrders((prev: any) => 
          prev.map((o: any) => o._id === id ? { ...o, paymentStatus: newStatus } : o)
        );
      }
    } catch (error) {
      console.error("Error updating payment:", error);
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
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "shipped": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Revenue", value: orders.reduce((acc, o: any) => acc + o.totalPrice, 0), icon: <FiDollarSign />, color: "from-emerald-500 to-emerald-600", suffix: "EGP" },
          { label: "Total Orders", value: orders.length, icon: <FiPackage />, color: "from-blue-500 to-blue-600" },
          { label: "Pending", value: orders.filter((o: any) => o.status === "pending").length, icon: <FiClock />, color: "from-amber-500 to-amber-600" },
          { label: "Delivered", value: orders.filter((o: any) => o.status === "delivered").length, icon: <FiCheckCircle />, color: "from-indigo-500 to-indigo-600" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass p-6 rounded-[2rem] border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl shadow-lg group-hover:rotate-6 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value.toLocaleString()} {stat.suffix}</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="text-6xl font-black">#0{i+1}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">Live Orders Feed</h2>
        
        {/* Desktop Table */}
        <div className="hidden lg:block bg-white dark:bg-white/2 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left rtl:text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-6">Order ID / Date</th>
                <th className="px-8 py-6">Customer Info</th>
                <th className="px-8 py-6 text-center">Payment Proof</th>
                <th className="px-8 py-6">Total Amount</th>
                <th className="px-8 py-6">Status Management</th>
                <th className="px-8 py-6 text-right rtl:text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-sm group-hover:text-primary transition-colors">{order.invoiceNumber}</div>
                    <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-1">
                      <FiCalendar size={10} /> {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary">
                        <FiUser />
                      </div>
                      <div>
                        <div className="font-black text-sm">{order.shippingAddress?.name || "Anonymous"}</div>
                        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                          <FiPhone size={10} /> {order.shippingAddress?.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {order.paymentDetails?.paymentScreenshot ? (
                        <button 
                          onClick={() => setSelectedImage(order.paymentDetails.paymentScreenshot)}
                          className="w-12 h-12 rounded-2xl border-2 border-primary/20 overflow-hidden hover:border-primary transition-all shadow-lg group/img relative"
                        >
                          <img src={order.paymentDetails.paymentScreenshot} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <FiEye className="text-white" />
                          </div>
                        </button>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-300">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-primary text-lg">{order.totalPrice.toLocaleString()} <span className="text-[10px]">EGP</span></div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-tighter mt-1">
                      {order.paymentMethod?.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase outline-none border border-transparent focus:border-primary cursor-pointer appearance-none transition-all ${getStatusColor(order.status)}`}
                        >
                          {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                            <option key={s} value={s} className="bg-white dark:bg-[#111] text-black dark:text-white font-bold">{s}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select 
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase outline-none border border-transparent focus:border-primary cursor-pointer appearance-none transition-all ${order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                        >
                          <option value="pending" className="bg-white dark:bg-[#111] text-black dark:text-white">Unpaid</option>
                          <option value="paid" className="bg-white dark:bg-[#111] text-black dark:text-white">Confirmed Paid</option>
                          <option value="failed" className="bg-white dark:bg-[#111] text-black dark:text-white">Failed</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right rtl:text-left">
                    <button 
                      onClick={() => handleDelete(order._id)}
                      className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order: any) => (
            <motion.div 
              layout
              key={order._id} 
              className="glass p-6 rounded-[2.5rem] border-white/5 space-y-6 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm">{order.invoiceNumber}</h3>
                  <p className="text-[10px] font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary">
                  <FiUser />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">{order.shippingAddress?.name}</p>
                  <p className="text-[10px] font-bold text-gray-500">{order.shippingAddress?.phone}</p>
                </div>
                {order.paymentDetails?.paymentScreenshot && (
                  <button onClick={() => setSelectedImage(order.paymentDetails.paymentScreenshot)} className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                    <img src={order.paymentDetails.paymentScreenshot} className="w-full h-full object-cover" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1">Total Amount</p>
                  <p className="text-xl font-black text-primary">{order.totalPrice.toLocaleString()} <span className="text-xs">EGP</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest mb-1">Payment</p>
                  <p className={`font-black text-xs ${order.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.paymentStatus.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase outline-none appearance-none"
                  >
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
                </div>
                <button onClick={() => handleDelete(order._id)} className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-zoom-out" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <FiXCircle size={24} />
              </button>
              <img src={selectedImage} className="w-full h-auto rounded-[3rem] shadow-2xl border-2 border-white/20" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
