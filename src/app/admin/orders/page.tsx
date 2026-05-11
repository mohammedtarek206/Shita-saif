"use client";

import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiCheckCircle, FiXCircle, 
  FiClock, FiEye, FiDownload, FiDollarSign,
  FiPhone, FiChevronDown, FiTrash2
} from "react-icons/fi";
import { motion } from "framer-motion";

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
        // Update local state immediately
        setOrders((prev: any) => 
          prev.map((o: any) => o._id === id ? { ...o, status: newStatus } : o)
        );
        alert("Status updated successfully!");
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
        // Update local state immediately
        setOrders((prev: any) => 
          prev.map((o: any) => o._id === id ? { ...o, paymentStatus: newStatus } : o)
        );
        alert("Payment status updated!");
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
      case "delivered": return "bg-green-500/20 text-green-500 border-green-500/50";
      case "cancelled": return "bg-red-500/20 text-red-500 border-red-500/50";
      case "processing": return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "shipped": return "bg-purple-500/20 text-purple-500 border-purple-500/50";
      default: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Orders Management</h1>
          <p className="text-gray-500">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: orders.reduce((acc, o: any) => acc + o.totalPrice, 0), icon: <FiDollarSign />, color: "bg-green-500" },
          { label: "Total Orders", value: orders.length, icon: <FiPackage />, color: "bg-blue-500" },
          { label: "Pending", value: orders.filter((o: any) => o.status === "pending").length, icon: <FiClock />, color: "bg-yellow-500" },
          { label: "Delivered", value: orders.filter((o: any) => o.status === "delivered").length, icon: <FiCheckCircle />, color: "bg-green-600" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border-white/20">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white text-xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 text-sm font-bold uppercase">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value.toLocaleString()} EGP</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-[2.5rem] border-white/20 overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-start border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <th className="px-8 py-6 text-start">Invoice / Date</th>
              <th className="px-8 py-6 text-start">Customer Details</th>
              <th className="px-8 py-6 text-start">Payment Proof</th>
              <th className="px-8 py-6 text-start">Order Amount</th>
              <th className="px-8 py-6 text-start">Order Status</th>
              <th className="px-8 py-6 text-start">Payment Status</th>
              <th className="px-8 py-6 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {orders.map((order: any) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-black text-sm group-hover:text-primary transition-colors">{order.invoiceNumber}</div>
                  <div className="text-[10px] text-gray-500 font-bold">{new Date(order.createdAt).toLocaleString()}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="font-bold text-sm">{order.shippingAddress?.name || "N/A"}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                    <FiPhone className="text-[8px]" /> {order.shippingAddress?.phone}
                  </div>
                </td>
                <td className="px-8 py-6">
                  {order.paymentDetails?.paymentScreenshot ? (
                    <button 
                      onClick={() => setSelectedImage(order.paymentDetails.paymentScreenshot)}
                      className="flex flex-col items-center gap-1 group/btn"
                    >
                      <div className="w-14 h-14 rounded-2xl border-2 border-primary/20 overflow-hidden group-hover/btn:border-primary transition-all shadow-lg">
                        <img src={order.paymentDetails.paymentScreenshot} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-black text-primary uppercase flex items-center gap-1">
                        <FiEye /> View Proof
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-1 opacity-30">
                      <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center">
                        <FiPackage className="text-gray-400" />
                      </div>
                      <span className="text-[9px] font-bold uppercase text-gray-400">
                        {order.paymentMethod === 'cod' ? 'No Proof Needed' : 'Missing Proof'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="font-black text-primary text-base">{order.totalPrice} EGP</div>
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">
                    Method: {order.paymentMethod?.replace("_", " ")}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="relative">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-[10px] font-black uppercase outline-none border-2 border-transparent focus:border-primary cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                    >
                      <option value="pending" className="bg-white dark:bg-[#111] text-black dark:text-white">Pending</option>
                      <option value="processing" className="bg-white dark:bg-[#111] text-black dark:text-white">Processing</option>
                      <option value="shipped" className="bg-white dark:bg-[#111] text-black dark:text-white">Shipped</option>
                      <option value="delivered" className="bg-white dark:bg-[#111] text-black dark:text-white">Delivered</option>
                      <option value="cancelled" className="bg-white dark:bg-[#111] text-black dark:text-white">Cancelled</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="relative">
                    <select 
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentUpdate(order._id, e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl text-[10px] font-black uppercase outline-none border-2 border-transparent focus:border-primary cursor-pointer appearance-none ${order.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}
                    >
                      <option value="pending" className="bg-white dark:bg-[#111] text-black dark:text-white">Unpaid / Pending</option>
                      <option value="paid" className="bg-white dark:bg-[#111] text-black dark:text-white">Paid / Confirmed</option>
                      <option value="failed" className="bg-white dark:bg-[#111] text-black dark:text-white">Failed / Rejected</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="px-8 py-6 text-end">
                  <button 
                    onClick={() => handleDelete(order._id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 group-hover:scale-110"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedImage(null)} />
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl p-2"
            >
              <FiXCircle />
            </button>
            <img src={selectedImage} className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white/20" />
          </div>
        </div>
      )}
    </div>
  );
}
