"use client";

import React from "react";
import { 
  FiUsers, FiShoppingCart, FiDollarSign, FiBox, 
  FiArrowUpRight, FiArrowDownRight, FiActivity, FiArrowRight
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";

const data = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 2000, orders: 150 },
  { name: "Apr", sales: 2780, orders: 390 },
  { name: "May", sales: 1890, orders: 480 },
  { name: "Jun", sales: 2390, orders: 380 },
  { name: "Jul", sales: 3490, orders: 430 },
];

const StatCard = ({ title, value, icon, change, isPositive, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5 group hover:border-primary/20 transition-all"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full ${
        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
      }`}>
        {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
        {change}%
      </div>
    </div>
    <div className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</div>
    <div className="text-3xl font-black mt-2 tracking-tight group-hover:text-primary transition-colors">{value}</div>
  </motion.div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            Dashboard <FiActivity className="text-primary animate-pulse" />
          </h1>
          <p className="text-gray-500 font-bold mt-1">Global performance overview and analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2">
            View Orders <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard title="Total Revenue" value="45,231 EGP" icon={<FiDollarSign />} change="12.5" isPositive={true} delay={0.1} />
        <StatCard title="Total Orders" value="1,205" icon={<FiShoppingCart />} change="8.2" isPositive={true} delay={0.2} />
        <StatCard title="Active Users" value="8,432" icon={<FiUsers />} change="2.4" isPositive={false} delay={0.3} />
        <StatCard title="Total Products" value="432" icon={<FiBox />} change="4.1" isPositive={true} delay={0.4} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Sales Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black">Revenue Analytics</h3>
              <p className="text-gray-500 text-sm font-bold">Monthly growth trajectory</p>
            </div>
            <select className="bg-gray-50 dark:bg-white/5 border-none rounded-xl px-4 py-2.5 text-xs font-black outline-none focus:ring-2 focus:ring-primary/20 uppercase tracking-widest cursor-pointer">
              <option>Year 2024</option>
              <option>Year 2023</option>
            </select>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888815" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 900}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 900}} 
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '24px', padding: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#E91E63', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                  labelStyle={{ color: '#888', marginBottom: '8px', fontWeight: '900', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#E91E63" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black">Order Volume</h3>
              <p className="text-gray-500 text-sm font-bold">Distribution by month</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest">
                Real-time
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888815" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 900}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 900}} 
                  dx={-15}
                />
                <Tooltip 
                  cursor={{fill: '#88888808'}}
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '24px', padding: '20px' }}
                />
                <Bar dataKey="orders" fill="#1E4FA3" radius={[12, 12, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black uppercase tracking-tight italic">Global Orders History</h3>
          <Link href="/admin/orders" className="text-primary font-black hover:underline text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            Explore All <FiArrowRight />
          </Link>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="pb-6 pl-4">Order Entity</th>
                <th className="pb-6">Buyer Identity</th>
                <th className="pb-6">Inventory Items</th>
                <th className="pb-6">Gross Amount</th>
                <th className="pb-6 pr-4 text-center">Lifecycle Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {[
                { id: "#ORD-7721", user: "John Doe", item: "Samsung TV", price: "12,000 EGP", status: "Delivered", color: "text-emerald-500 bg-emerald-500/10" },
                { id: "#ORD-7722", user: "Jane Smith", item: "LG Washer", price: "8,500 EGP", status: "Processing", color: "text-blue-500 bg-blue-500/10" },
                { id: "#ORD-7723", user: "Ahmed Ali", item: "Gree AC", price: "7,200 EGP", status: "Pending", color: "text-amber-500 bg-amber-500/10" },
                { id: "#ORD-7724", user: "Maria Garcia", item: "Iron", price: "450 EGP", status: "Cancelled", color: "text-rose-500 bg-rose-500/10" },
              ].map((order, i) => (
                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="py-6 pl-4 font-black group-hover:text-primary transition-colors text-sm">{order.id}</td>
                  <td className="py-6">
                    <div className="font-bold text-sm">{order.user}</div>
                  </td>
                  <td className="py-6 text-gray-500 dark:text-gray-400 font-medium text-sm">{order.item}</td>
                  <td className="py-6 font-black text-primary">{order.price}</td>
                  <td className="py-6 pr-4 text-center">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.color}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden space-y-4">
          {[
            { id: "#ORD-7721", user: "John Doe", item: "Samsung TV", price: "12,000 EGP", status: "Delivered", color: "text-emerald-500 bg-emerald-500/10" },
            { id: "#ORD-7722", user: "Jane Smith", item: "LG Washer", price: "8,500 EGP", status: "Processing", color: "text-blue-500 bg-blue-500/10" },
          ].map((order, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-black text-primary text-xs">{order.id}</span>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.color}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-black text-sm">{order.user}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{order.item}</p>
                </div>
                <p className="font-black text-lg">{order.price}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
