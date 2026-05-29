"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiBell, FiShoppingCart, FiInfo, FiX, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function AdminNotifications() {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<any>(null);
  
  const knownOrderIdsRef = useRef<string[]>([]);
  const isFirstLoadRef = useRef(true);

  // Play synthetic gentle sound using browser Web Audio API (zero external assets needed)
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Ring chime
      const playTone = (freq: number, delay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };
      
      // Beautiful high-pitched chime sequence (C6 -> G6)
      playTone(1046.50, 0, 0.4);
      playTone(1567.98, 0.12, 0.6);
    } catch (err) {
      console.warn("Audio Context playback blocked by browser user gesture policies.", err);
    }
  };

  const fetchLatestOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) return;
      const orders = await res.json();
      if (!Array.isArray(orders)) return;

      const currentIds = orders.map((o: any) => o._id);

      if (isFirstLoadRef.current) {
        knownOrderIdsRef.current = currentIds;
        isFirstLoadRef.current = false;
        
        // Find any pending or processing orders on load to show as unread notifications
        const pending = orders.filter((o: any) => o.status === "pending" || o.status === "processing").slice(0, 5);
        setNotifications(pending);
        setUnreadCount(pending.length);
        return;
      }

      // Check for new orders
      const newOrders = orders.filter((o: any) => !knownOrderIdsRef.current.includes(o._id));
      if (newOrders.length > 0) {
        knownOrderIdsRef.current = [...newOrders.map((o: any) => o._id), ...knownOrderIdsRef.current];
        
        // Push to notifications dropdown
        setNotifications(prev => [...newOrders, ...prev].slice(0, 8));
        setUnreadCount(prev => prev + newOrders.length);
        
        // Show active slide-in toast for the latest order
        const latest = newOrders[0];
        setActiveToast({
          id: latest._id,
          customer: latest.shippingAddress?.name || "Customer",
          total: latest.total,
          phone: latest.shippingAddress?.phone || "",
        });
        
        playNotificationSound();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Poll for new orders every 10 seconds (efficient and fast)
  useEffect(() => {
    fetchLatestOrders();
    const interval = setInterval(fetchLatestOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative flex items-center">
      {/* Bell Button */}
      <button 
        onClick={() => { setIsOpen(!isOpen); markAllAsRead(); }}
        className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all"
      >
        <FiBell className="text-xl text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center font-black text-[9px] border-2 border-white dark:border-black animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[2rem] shadow-2xl p-4 space-y-4 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
                <h4 className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                  {language === "ar" ? "الإشعارات الحية" : "Live Alerts"}
                </h4>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    {language === "ar" ? "قراءة الكل" : "Mark read"}
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 font-bold text-xs">
                    <FiInfo className="text-xl mx-auto mb-2 text-gray-400/50" />
                    {language === "ar" ? "لا توجد إشعارات حالياً" : "No active alerts"}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <Link
                      key={(notif as any)?._id || (notif as any)?.id || (notif as any)?.slug || (notif as any)?.name || (notif as any)?.title?.en || (notif as any)?.title?.ar || JSON.stringify(notif).substring(0, 20)}
                      href="/admin/orders"
                      onClick={() => setIsOpen(false)}
                      className="block p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                    >
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FiShoppingCart className="text-sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-gray-800 dark:text-gray-200 truncate">
                            {language === "ar" ? "طلب جديد" : "New Order Received"}
                          </p>
                          <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5">
                            {notif.shippingAddress?.name || "Customer"} - {notif.total?.toLocaleString()} EGP
                          </p>
                          <span className="text-[8px] font-bold text-gray-400 block mt-1">
                            {new Date(notif.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Audio Toast Alert */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ x: language === "ar" ? -300 : 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: language === "ar" ? -300 : 300, opacity: 0 }}
            className={`fixed bottom-6 ${language === "ar" ? "left-6" : "right-6"} bg-black text-white p-5 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-4 z-[999] max-w-sm`}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white text-lg shrink-0 animate-bounce">
              <FiShoppingCart />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black uppercase tracking-wider text-primary">
                {language === "ar" ? "طلب جديد وارد! 🔔" : "New Order Alert! 🔔"}
              </h5>
              <p className="text-[10px] font-bold text-gray-300 truncate mt-1">
                {activeToast.customer} ({activeToast.phone})
              </p>
              <p className="text-xs font-black text-white mt-0.5">
                {activeToast.total?.toLocaleString()} EGP
              </p>
            </div>
            <div className="flex flex-col gap-1.5 ml-2 rtl:mr-2 rtl:ml-0">
              <button 
                onClick={() => setActiveToast(null)}
                className="w-7 h-7 bg-white/10 text-white rounded-lg flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <FiX className="text-xs" />
              </button>
              <Link
                href="/admin/orders"
                onClick={() => setActiveToast(null)}
                className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/80 transition-all"
              >
                <FiCheck className="text-xs" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
