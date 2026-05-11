"use client";

import React from "react";
import { 
  FiUsers, FiShoppingCart, FiDollarSign, FiBox, 
  FiArrowUpRight, FiArrowDownRight 
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";

const data = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 198 },
  { name: "Mar", sales: 2000, orders: 150 },
  { name: "Apr", sales: 2780, orders: 390 },
  { name: "May", sales: 1890, orders: 480 },
  { name: "Jun", sales: 2390, orders: 380 },
  { name: "Jul", sales: 3490, orders: 430 },
];

const StatCard = ({ title, value, icon, change, isPositive }: any) => (
  <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-black/5">
    <div className="flex items-center justify-between mb-6">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-black px-3 py-1 rounded-full ${
        isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
      }`}>
        {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
        {change}%
      </div>
    </div>
    <div className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</div>
    <div className="text-3xl font-black mt-2 tracking-tight">{value}</div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Revenue" value="45,231 EGP" icon={<FiDollarSign />} change="12.5" isPositive={true} />
        <StatCard title="Total Orders" value="1,205" icon={<FiShoppingCart />} change="8.2" isPositive={true} />
        <StatCard title="Active Users" value="8,432" icon={<FiUsers />} change="2.4" isPositive={false} />
        <StatCard title="Total Products" value="432" icon={<FiBox />} change="4.1" isPositive={true} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black">Revenue Analytics</h3>
              <p className="text-gray-500 text-sm">Monthly sales performance</p>
            </div>
            <select className="bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E91E63" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#888', fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#888', fontWeight: 600}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '20px', color: '#fff', padding: '15px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#E91E63', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#E91E63" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black">Order Activity</h3>
              <p className="text-gray-500 text-sm">Real-time order tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <div className="w-2 h-2 rounded-full bg-secondary" /> Orders
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#888', fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#888', fontWeight: 600}} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: '#88888810'}}
                  contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '20px', color: '#fff', padding: '15px' }}
                />
                <Bar dataKey="orders" fill="#1E4FA3" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black">Recent Orders</h3>
          <button className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 text-xs font-black uppercase tracking-widest">
                <th className="pb-6 pl-4">Order ID</th>
                <th className="pb-6">Customer</th>
                <th className="pb-6">Product</th>
                <th className="pb-6">Amount</th>
                <th className="pb-6 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {[
                { id: "#ORD-7721", user: "John Doe", item: "Samsung TV", price: "12,000 EGP", status: "Delivered" },
                { id: "#ORD-7722", user: "Jane Smith", item: "LG Washer", price: "8,500 EGP", status: "Processing" },
                { id: "#ORD-7723", user: "Ahmed Ali", item: "Gree AC", price: "7,200 EGP", status: "Pending" },
                { id: "#ORD-7724", user: "Maria Garcia", item: "Iron", price: "450 EGP", status: "Cancelled" },
              ].map((order, i) => (
                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="py-6 pl-4 font-black group-hover:text-primary transition-colors">{order.id}</td>
                  <td className="py-6">
                    <div className="font-bold">{order.user}</div>
                  </td>
                  <td className="py-6 text-gray-500 dark:text-gray-400">{order.item}</td>
                  <td className="py-6 font-black text-lg">{order.price}</td>
                  <td className="py-6 pr-4 text-center">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
