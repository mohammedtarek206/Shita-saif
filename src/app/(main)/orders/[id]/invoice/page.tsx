"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiPrinter, FiDownload, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id;
  const { language } = useLanguage();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/track?identifier=${id}&orderId=${id}`);
        // Note: In a real scenario, this should be a protected API for the specific user
        const res2 = await fetch(`/api/orders`); // Fallback for testing or use a specific API
        const data = await res2.json();
        const found = Array.isArray(data) ? data.find((o: any) => o._id === id || o.orderNumber === id) : null;
        setOrder(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#050505] py-20 px-4 print:p-0 print:bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 font-bold text-gray-500 hover:text-primary transition-colors">
            <FiArrowLeft /> {language === "ar" ? "رجوع" : "Back"}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              <FiPrinter /> {language === "ar" ? "طباعة الفاتورة" : "Print Invoice"}
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-white/[0.02] rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-white/5 shadow-2xl print:shadow-none print:border-none print:rounded-none print:p-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16 border-b border-gray-100 dark:border-white/10 pb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src="/Logo-removebg-preview.png" alt="Logo" className="w-16 h-16" />
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">SHETA-SAIF</h1>
              </div>
              <div className="text-xs font-bold text-gray-500 space-y-1">
                <p>Tazmant Al-Sharqiya, Beni Suef, Egypt</p>
                <p>Phone: 01223366046</p>
                <p>Email: info@wintersummer.com</p>
              </div>
            </div>
            <div className="flex items-start gap-8">
              <div className="text-right space-y-2">
                <h2 className="text-5xl font-black italic text-primary uppercase tracking-tighter">Invoice</h2>
                <p className="font-black text-lg">{order.orderNumber}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="hidden md:block p-2 bg-white rounded-xl shadow-lg border border-gray-100 print:shadow-none print:border-black">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/track-order?phone=${order.shippingAddress?.phone}` : order.shippingAddress?.phone)}`}
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-black text-xl">{order.shippingAddress.name}</p>
                <p className="text-sm font-bold text-gray-500">{order.shippingAddress.address}</p>
                <p className="text-sm font-bold text-gray-500">{order.shippingAddress.city}</p>
                <p className="text-sm font-black text-primary">{order.shippingAddress.phone}</p>
              </div>
            </div>
            <div className="md:text-right space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Payment Info:</h3>
              <div className="space-y-1">
                <p className="font-black text-xl uppercase italic">{order.paymentMethod}</p>
                <p className="text-sm font-bold text-gray-500">Status: <span className="text-emerald-500 uppercase">{order.paymentStatus}</span></p>
                <p className="text-sm font-bold text-gray-500">Transaction ID: {order.paymentDetails?.transactionId || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-16">
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <th className="py-4">Item Description</th>
                  <th className="py-4 text-center">Qty</th>
                  <th className="py-4 text-right">Price</th>
                  <th className="py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {order.products.map((item: any, i: number) => (
                  <tr key={`item-${i}`} className="text-sm font-bold">
                    <td className="py-6">
                      <p className="font-black">{language === "ar" ? (item.product?.title?.ar || item.title?.ar) : (item.product?.title?.en || item.title?.en)}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.product?.brand}</p>
                    </td>
                    <td className="py-6 text-center">{item.quantity}</td>
                    <td className="py-6 text-right">{Number(item.price).toLocaleString()} EGP</td>
                    <td className="py-6 text-right font-black">{(item.quantity * Number(item.price)).toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end border-t-2 border-gray-100 dark:border-white/10 pt-10">
            <div className="w-full md:w-80 space-y-4">
              <div className="flex justify-between text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <span>Subtotal</span>
                <span>{order.subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                <span>Shipping</span>
                <span>{order.shippingCost.toLocaleString()} EGP</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-primary font-bold uppercase text-[10px] tracking-widest">
                  <span>Discount</span>
                  <span>-{order.discount.toLocaleString()} EGP</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                <span className="text-2xl font-black text-primary italic">{order.totalPrice.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 text-center space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic flex items-center justify-center gap-2">
              <FiCheckCircle /> Thank you for choosing SHETA-SAIF
            </p>
            <p className="text-[8px] font-bold text-gray-400">This is a computer generated invoice and does not require a physical signature.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
